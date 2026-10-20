# Student Endpoints

Teachers create and manage students. A created student is a `users` row with `role = student` and `status = managed` plus a `students` profile row. Managed users cannot sign in; they exist so the teacher can keep student data.

Language courses are documented in [language-course-endpoints.md](language-course-endpoints.md). Self-check questions: [quiz.md](quiz.md).

## Routes

| Method | Route | Roles | Guards |
|---|---|---|---|
| `POST` | `/students` | teacher | `JwtAccessGuard`, `RolesGuard` |
| `GET` | `/students` | teacher | `JwtAccessGuard`, `RolesGuard` |
| `GET` | `/students/:studentId` | teacher, student | `JwtAccessGuard`, `RolesGuard`, `StudentAccessGuard` |
| `PATCH` | `/students/:studentId` | teacher, student | `JwtAccessGuard`, `RolesGuard`, `StudentEditGuard` |

All routes need the `accessToken` cookie. A wrong role returns `403 FORBIDDEN`.

## Access Rules

A student **belongs to** a teacher when the teacher created them (`students.created_by_teacher_id`) **or** has a course with them (`student_language_courses.teacher_id`). The condition lives once in `StudentsRepository.belongsToTeacher()`.

| Guard | Allows | Used by |
|---|---|---|
| `ManagedStudentGuard` | a teacher the student belongs to | `POST /students/:studentId/courses` |
| `StudentAccessGuard` | the student themselves (`user.id === studentId`), or a teacher the student belongs to | `GET /students/:studentId`, both course `GET` routes |
| `StudentEditGuard` | the student themselves once they have their own account (`status != managed`), or the **creating** teacher while the student is `managed` | `PATCH /students/:studentId` |
| `StudentLanguageCourseAccessGuard` | the student the course belongs to, or the teacher who **runs** the course; else `404 STUDENT_LANGUAGE_COURSE_NOT_FOUND` | all course document routes |
| `CourseDocumentDeleteGuard` | the user who added the document; else `404 COURSE_DOCUMENT_NOT_FOUND` / `403 COURSE_DOCUMENT_DELETE_FORBIDDEN` | `DELETE …/documents/:documentId` |

The two course document guards are described in [course-document-endpoints.md](course-document-endpoints.md#access).

`StudentEditGuard` calls `StudentAccessService.ensureStudentIsEditable()`. A caller who is neither the student nor the creating teacher gets `404 STUDENT_NOT_FOUND`; a candidate who may not edit right now gets `403 STUDENT_NOT_EDITABLE`. A teacher who only teaches the student a course can read but not edit them. The same rule, `isStudentEditable()`, fills `isEditable` in the details response.

Both guards parse `:studentId` as a UUID and delegate to `StudentAccessService`. Denials return `404 STUDENT_NOT_FOUND`, never `403`, so callers cannot probe which student ids exist.

## Create Student

```txt
POST /students
{ name, birthDate?, job?, hobbies? }  ->  201 { id }
```

```mermaid
flowchart TD
  Request["POST /students"] --> Guards["JwtAccessGuard + RolesGuard (teacher)"]
  Guards --> Controller["StudentsController.createStudent()"]
  Controller --> Service["StudentsService.createStudent()"]
  Service --> TeacherCheck["TeachersService: teachers row exists? else 400 TEACHER_NOT_FOUND"]
  TeacherCheck --> Tx["StudentsRepository.createManagedStudent() — one transaction"]
  Tx --> User["insert users: role student, status managed, no email, no Google id"]
  User --> Profile["insert students: created_by_teacher_id, birth_date, job, hobbies"]
  Profile --> Response["201 { id }"]
```

- `name` is required (1–255). `birthDate` (ISO date), `job` (≤ 255) and `hobbies` (≤ 20 items, ≤ 100 chars each) are optional.
- There is no `email` field: sending one returns `400` (`forbidNonWhitelisted`). If a teacher could set an email, a managed student would reserve that address, and its real owner could never sign in with Google.
- The student is always linked to the calling teacher through `created_by_teacher_id`.
- No email is sent.

## List My Students

```txt
GET /students?limit=20&offset=0&search=an  ->  200 { items: [{ id, name, job, hobbies }], total }
```

```mermaid
flowchart TD
  Request["GET /students"] --> Guards["JwtAccessGuard + RolesGuard (teacher)"]
  Guards --> Dto["GetStudentsQueryDto: limit, offset, search"]
  Dto --> Service["StudentsService.getTeacherStudents()"]
  Service --> Parallel["in parallel"]
  Parallel --> Cards["StudentsRepository.getTeacherStudentCards()"]
  Parallel --> Count["StudentsRepository.countTeacherStudents()"]
  Cards --> Response["200 { items, total }"]
  Count --> Response
```

- Only students that belong to the caller. Newest first (`created_at desc`).
- `limit` 1–100 (default 20), `offset` ≥ 0 (default 0).
- `search` (optional, case-insensitive) matches a student whose **name or email starts with it**: `an` matches "Anna …" and `andrew@example.com`. Students without an email (managed students) match by name only.
- `search` is matched literally: `escapeLikePattern()` (`src/common/helpers/string/`) escapes `%`, `_` and `\` before `StudentsRepository.startsWithFilter()` appends the trailing `%`, so typing `_` or `%` does not act as a wildcard.

## Student Details

```txt
GET /students/:studentId  ->  200 { id, name, email, birthDate, job, hobbies, status, isEditable }
```

`StudentAccessGuard` checks access, then `StudentsService.getStudentDetails()` loads the student joined with its user in one query (`StudentsRepository.getStudentDetailsWithEditAccess()`). That query also selects `created_by_teacher_id`, which feeds the edit flag and is left out of the response. `email` is `null` for managed students. `isEditable` tells the client whether `PATCH` would be allowed for this caller. A missing student returns `404 STUDENT_NOT_FOUND`.

## Update Student

```txt
PATCH /students/:studentId
{ name?, birthDate?, job?, hobbies? }  ->  200 { id }
```

```mermaid
flowchart TD
  Request["PATCH /students/:studentId"] --> Guards["JwtAccessGuard + RolesGuard (teacher, student)"]
  Guards --> Edit["StudentEditGuard: not the student or the creator → 404; not editable now → 403 STUDENT_NOT_EDITABLE"]
  Edit --> Body["UpdateStudentDto + NonEmptyBodyPipe: nothing to change → 400 EMPTY_UPDATE_BODY"]
  Body --> Service["StudentUpdateService.updateStudent()"]
  Service --> Self{"caller is the student?"}
  Self -- yes --> Own["StudentsRepository.updateStudent() — one transaction"]
  Self -- no --> Creator["StudentsRepository.updateStudentAsCreator(): lock row (FOR UPDATE), re-check creator + managed"]
  Creator -->|no longer managed| Gone["403 STUDENT_NOT_EDITABLE"]
  Creator --> Apply["update users (name) and students (birth_date, job, hobbies)"]
  Own --> Apply
  Apply --> Response["200 { id }"]
```

- `NonEmptyBodyPipe` (`src/common/pipes/non-empty-body.pipe.ts`) runs after the global `ValidationPipe` and rejects a body without any defined field.
- Nobody can change the email here, so `email` in the body returns `400` (`forbidNonWhitelisted`). An activated student's email belongs to their account (auth); a teacher setting one would reserve someone else's address.
- `updateStudentAsCreator` locks the student row and re-checks `created_by_teacher_id` and `status = managed` inside the transaction, so a teacher cannot edit a student who activates their account at the same moment.
- `applyStudentUpdate` skips the `users` or `students` update when it has no defined fields.

## Files

- `src/modules/students/controllers/students.controller.ts`
- `src/modules/students/services/students.service.ts`, `student-access.service.ts`, `student-update.service.ts`
- `src/modules/students/repositories/students.repository.ts`
- `src/modules/students/guards/`
- `src/modules/students/dto/create-student.dto.ts`, `get-students-query.dto.ts`, `update-student.dto.ts`
- `src/common/pipes/non-empty-body.pipe.ts`
- `src/constant/swagger/students/update-student.swagger.ts`

Self-check questions: [review-fixes-quiz.md](review-fixes-quiz.md).
