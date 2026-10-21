# Course Document Endpoints

A course document is a **file** (uploaded to object storage) or a **link** (an external https URL, e.g. a Google Sheet) attached to one language course. The course's student and the teacher who runs it can add, list, open and delete; only the user who added a document can delete it.

How files are stored, the `media_assets` table and the stale-upload cleanup are described in [media-assets.md](../media-assets/media-assets.md) and [storage.md](../infrastructure/storage.md).

## Routes

All routes live in `CourseDocumentsController`, under `/students/:studentId/courses/:courseId/documents`.

| Method | Route | Result |
|---|---|---|
| `POST` | `…/documents/upload-url` | `201 { mediaAssetId, uploadUrl }` |
| `POST` | `…/documents/files` | `201 { id }` |
| `POST` | `…/documents/links` | `201 { id }` |
| `GET` | `…/documents/:documentId/download-url` | `200 { url }` |
| `DELETE` | `…/documents/:documentId` | `204` |

The list has no route of its own: it is part of `GET /students/:studentId/courses/:courseId` (see [Course Details](language-course-endpoints.md#course-details)).

## Access

Every route runs only `JwtAccessGuard` and `RolesGuard` (teacher or student).


## Upload a File

A file takes three requests. The browser sends the bytes straight to storage; the backend only signs URLs and checks the result.

```mermaid
sequenceDiagram
  participant B as Browser
  participant API as Backend
  participant S3 as Object storage
  B->>API: POST …/documents/upload-url { fileName, mimeType, sizeBytes }
  API->>API: course access, document limit, pending-upload cap, insert media_assets (pending)
  API-->>B: 201 { mediaAssetId, uploadUrl }
  B->>S3: PUT uploadUrl (file, same Content-Type and size)
  S3-->>B: 200
  B->>API: POST …/documents/files { mediaAssetId, title? }
  API->>S3: HEAD object (exists? size? type?)
  API->>API: transaction: lock course, check limit, asset → uploaded, insert course_documents
  API-->>B: 201 { id }
```

### Step 1: upload URL

```mermaid
flowchart TD
  Request["POST …/documents/upload-url"] --> Guards["JwtAccessGuard + RolesGuard"]
  Guards --> Dto["CreateMediaAssetUploadUrlDto: allowed mimeType? size within its kind's limit? else 400"]
  Dto --> Service["CourseDocumentUploadService.requestFileUpload()"]
  Service --> Limit["CourseDocumentsService.ensureCourseHasCapacity(): no accessible course? 404 STUDENT_LANGUAGE_COURSE_NOT_FOUND; 100 active documents? 409 COURSE_DOCUMENTS_LIMIT_REACHED"]
  Limit --> PendingCap["MediaAssetUploadService.requestUpload(): caller already holds 20 pending uploads? 409 MEDIA_ASSET_PENDING_LIMIT_REACHED"]
  PendingCap --> Asset["key uploads/{userId}/{uuid}, insert media_assets (pending)"]
  Asset --> Sign["StorageProvider.createUploadUrl(): presigned PUT, 5 min"]
  Sign --> Response["201 { mediaAssetId, uploadUrl }"]
```

- The size limit depends on the type (documents 20 MB, images 10 MB, audio 50 MB) and is checked in the DTO by `IsWithinMediaAssetSizeLimitConstraint`, so it returns a standard validation `400`.
- The upload URL is signed with `content-type` and `content-length`: storage rejects a different type or size with `403`.
- The capacity check here is an early exit, so a full course does not get files uploaded in vain. It is not the guarantee: step 2 checks the limit again under a lock.
- Pending uploads count against no course until attached, so each user may hold at most 20 (`mediaAssetsConfig.UPLOAD.MAX_PENDING_PER_UPLOADER`). This is a per-user cap rather than `@Throttle`, because every request reaches the backend from the Next server's IP. It is a soft cap: parallel requests can pass the count together.

### Step 2: attach the file

```mermaid
flowchart TD
  Request["POST …/documents/files"] --> Guards["JwtAccessGuard + RolesGuard"]
  Guards --> Service["CourseDocumentUploadService.createFileDocument()"]
  Service --> Pending["MediaAssetUploadService.getVerifiedPendingAsset(): pending asset of this caller? else 404 MEDIA_ASSET_NOT_FOUND"]
  Pending --> Head["StorageProvider.getObjectInfo(): object exists with the declared size and type? else 400 MEDIA_ASSET_UPLOAD_INVALID"]
  Head --> Tx["CourseDocumentsRepository.createFileDocumentFromPendingAsset() (transaction)"]
  Tx --> Lock["getCreateBlocker(): SELECT accessible course FOR UPDATE, count active documents"]
  Lock -- no accessible course --> NoCourse["404 STUDENT_LANGUAGE_COURSE_NOT_FOUND"]
  Lock -- 100 or more --> Full["409 COURSE_DOCUMENTS_LIMIT_REACHED"]
  Lock -- below 100 --> Claim{"UPDATE media_assets SET status = uploaded WHERE id, uploader = caller, status = pending"}
  Claim -- no row --> Taken["404 MEDIA_ASSET_NOT_FOUND (claimed by a concurrent request)"]
  Claim -- row --> Insert["INSERT course_documents (type file, title ?? original file name)"]
  Insert --> Response["201 { id }"]
```

- The client sends `mediaAssetId`, never a storage key, so it can only attach an upload the backend issued to it.
- The conditional update plus the unique `course_documents.media_asset_id` make one upload attachable once.
- A rejected upload stays `pending` and is removed by the daily cleanup.
- The repository returns an outcome (`CourseDocumentCreateOutcome`: `created`, `course_not_found`, `limit_reached`, `asset_unavailable`), and `CourseDocumentsService.toCreatedDocument()` turns it into the response or the `409`/`404`.

### Document limit under concurrency

Counting first and inserting afterwards would let two parallel adds both see 99 documents and end at 101. So the count runs inside the insert transaction, after a pessimistic row lock on the course (`SELECT … FOR UPDATE` on `student_language_courses`):

```mermaid
sequenceDiagram
  participant A as Add A
  participant DB as Postgres
  participant B as Add B
  A->>DB: BEGIN, lock course row
  B->>DB: BEGIN, lock course row (waits)
  A->>DB: count = 99 → insert → COMMIT
  DB-->>B: lock granted
  B->>DB: count = 100 → limit_reached → ROLLBACK
```

Only adds to the same course wait for each other. Links and files use the same `getCreateBlocker()` helper, which also checks course access in the same locked query.

## Add a Link

```txt
POST …/documents/links  { url, title }  ->  201 { id }
```

- `url`: `https` only, at most 2048 characters (`@IsUrl({ protocols: ['https'], require_protocol: true })`). It is stored as-is and never fetched by the server.
- `title`: required, 1–255 characters.
- Same document limit as files, checked the same way inside the insert transaction (`CourseDocumentsRepository.createLinkDocument()`): `409 COURSE_DOCUMENTS_LIMIT_REACHED`.

## Course Details List

`StudentLanguageCoursesService.getStudentLanguageCourse()` adds `documents` to both the teacher's and the student's view through `CourseDocumentsService.getCourseDocuments()`:

```json
{ "id": "…", "type": "file", "title": "Homework week 3", "url": null,
  "file": { "sizeBytes": 2048000, "kind": "document" },
  "addedBy": { "name": "Max Student", "role": "student" }, "canDelete": false }
```

- Active documents only (`deleted_at IS NULL`), newest first; one query with left joins on `users` and `media_assets`.
- `file` is set for files, `url` for links. `addedBy` is `null` once the adding user is deleted. `canDelete` is `addedByUserId === caller`; the id itself is not returned.

## Open a File

```mermaid
flowchart TD
  Request["GET …/documents/:documentId/download-url"] --> Guards["JwtAccessGuard + RolesGuard"]
  Guards --> Lookup["CourseDocumentsRepository.getCourseDocumentFile(): active file document of this course, course accessible to caller"]
  Lookup -- none, a link, or no access --> NotFound["404 COURSE_DOCUMENT_NOT_FOUND"]
  Lookup -- found --> Sign["MediaAssetsService.createDownloadUrl(): presigned GET, 5 min, inline with the original name"]
  Sign --> Response["200 { url }"]
```

The URL makes storage answer with `Content-Disposition: inline; filename*=UTF-8''…`: the browser displays PDFs, images, audio and text, downloads other types (Office files), and keeps the original name for saving. The frontend opens it in a new tab.

## Delete a Document

```mermaid
flowchart TD
  Request["DELETE …/documents/:documentId"] --> Guards["JwtAccessGuard + RolesGuard"]
  Guards --> Soft["CourseDocumentDeletionService: UPDATE SET deleted_at WHERE id, course accessible, added_by = caller, deleted_at IS NULL"]
  Soft -- no row --> NotFound["404 COURSE_DOCUMENT_NOT_FOUND (missing, deleted, no course access, or added by someone else)"]
  Soft -- row --> Enqueue["queue course-documents: purge-course-document { documentId }"]
  Enqueue --> Response["204"]
```

A document someone else added is `404`, not `403`, so callers cannot probe which document ids exist; the client hides the button anyway through `canDelete`.

The document disappears from the list at once. The purge job then removes it for good:

```mermaid
flowchart TD
  Job["CourseDocumentsProcessor: purge-course-document"] --> Load["getDeletedCourseDocument(): still there and marked deleted?"]
  Load -- no --> Done["done (already purged)"]
  Load -- file --> Asset["MediaAssetsService.deleteMediaAsset(): delete storage object, then media_assets row (cascades the document row)"]
  Load -- link --> Row["deleteCourseDocument()"]
  Asset --> Row
```

- The file goes first, so a failed attempt is retried (5 attempts, exponential backoff from 5 s) without losing track of it.
- Every step is safe to repeat: a missing object, asset or row counts as already deleted.

## Errors

| Status | Error code | When |
|---|---|---|
| 400 | validation (no specific code) | invalid UUID, body, type, size, URL or title |
| 400 | `MEDIA_ASSET_UPLOAD_INVALID` | uploaded object missing or not matching the declared size or type |
| 404 | `STUDENT_LANGUAGE_COURSE_NOT_FOUND` | no access to the course (upload URL, add file or link) |
| 404 | `MEDIA_ASSET_NOT_FOUND` | upload unknown, already attached, or requested by another user |
| 404 | `COURSE_DOCUMENT_NOT_FOUND` | document not in this course, deleted, no course access, a link (open), or added by someone else (delete) |
| 409 | `COURSE_DOCUMENTS_LIMIT_REACHED` | course already has 100 active documents |
| 409 | `MEDIA_ASSET_PENDING_LIMIT_REACHED` | upload URL requested while the caller already holds 20 unattached uploads |

## Files

- `src/modules/students/controllers/course-documents.controller.ts`
- `src/modules/students/services/course-documents.service.ts`
- `src/modules/students/services/course-document-upload.service.ts`
- `src/modules/students/services/course-document-deletion.service.ts`
- `src/modules/students/services/course-documents-queue.service.ts`
- `src/modules/students/processors/course-documents.processor.ts`
- `src/modules/students/repositories/course-documents.repository.ts`
- `src/modules/students/constants/repository/course-document-select-fields.constant.ts`
- `src/modules/students/dto/create-course-file-document.dto.ts`
- `src/modules/students/dto/create-course-link-document.dto.ts`
- `src/modules/students/config.ts` (`COURSE_DOCUMENTS`)
- `src/constant/swagger/students/course-documents.swagger.ts` and the per-endpoint `*-course-*document*.swagger.ts` files

Self-check questions: [course-documents-quiz.md](course-documents-quiz.md).
