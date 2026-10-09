# Course Documents Quiz

Short self-check answers; full flows are in [course-document-endpoints.md](course-document-endpoints.md), [media-assets.md](../media-assets/media-assets.md) and [storage.md](../storage.md).

**1. Who may add documents to a course, and who may delete one?**
The course's student and the teacher who runs that course can add, list and open (`StudentLanguageCourseAccessGuard`). Only the user who added a document can delete it (`CourseDocumentDeleteGuard`, repeated in the soft-delete `WHERE`).

**2. What are the three requests of a file upload?**
`POST /documents/upload-url` to the backend (creates a `pending` asset, returns `{ mediaAssetId, uploadUrl }`), `PUT uploadUrl` with the file to storage, then `POST /documents/files` to the backend, which checks the object and creates the document.

**3. How does the backend know the declared size and type if it never gets the file?**
Step 1 sends `file.name`, `file.type` and `file.size`; they are validated and saved in the `media_assets` row and signed into the upload URL. Step 3 compares that row with a `HEAD` of the stored object (`400 MEDIA_ASSET_UPLOAD_INVALID` on mismatch).

**4. Which files may be uploaded, and how large?**
Documents (PDF, Office, OpenDocument, TXT, CSV) up to 20 MB, images (JPEG, PNG, WebP) up to 10 MB, audio (MP3, M4A, WAV, OGG) up to 50 MB. No video, SVG or HTML; the kind comes from `ALLOWED_MIME_TYPES`.

**5. Where is a 25 MB PDF rejected?**
In `CreateMediaAssetUploadUrlDto`: `IsWithinMediaAssetSizeLimitConstraint` maps `mimeType` to its kind and checks that kind's limit, giving a validation `400`. Guards run before pipes, so a caller without course access gets `404` first.

**6. What is validated for a link document?**
`url` must be `https` (blocks `javascript:` links) and at most 2048 characters; `title` is required, 1–255 characters. The 100-document limit applies, and the server never fetches the URL.

**7. What happens to an upload that is never attached?**
Its asset stays `pending`. The daily `media-assets` job (03:00) deletes `pending` assets older than 24 h: the storage object first, then the row.

**8. In which order do guards run on `DELETE /documents/:documentId`?**
`JwtAccessGuard`, `RolesGuard`, `StudentLanguageCourseAccessGuard` (class level), then `CourseDocumentDeleteGuard` (method level). The delete guard looks the document up within the course, so course access must be checked first.

**9. What happens after deleting a file document returns `204`?**
The row is already soft-deleted (hidden from the list) and a purge job is queued. The job deletes the storage object, then the asset row (cascading the document row); file first so a failed attempt can be retried.

**10. Why is `requestChecksumCalculation` set to `WHEN_REQUIRED`?**
By default the SDK signs a checksum of the body into the URL, but when presigning the backend has no file, so it would sign an empty body and the browser's real upload would be rejected. `WHEN_REQUIRED` adds checksums only where S3 demands them.