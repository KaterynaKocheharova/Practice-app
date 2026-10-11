# Student Editing

Teachers and students can edit a student profile; teachers can edit the courses they teach. The backend decides who may edit a student and reports it as `isEditable` on `GET /students/:studentId`. The frontend only shows or hides edit entry points and guards the edit page from that flag.

## Who Can Edit

| What | Editor | Rule |
| --- | --- | --- |
| Student profile | the teacher who created the student | only while the student is **managed** (no own account yet), email included |
| Student profile | the student themselves | only once they have their own account; **not** the email |
| Course | the teacher who teaches it | the language cannot be changed |

## Routes

| Route | Roles | Guard | Composes |
| --- | --- | --- | --- |
| `/students/[studentId]/edit` | teacher, student | `requireStudentEditorServer` | `EditStudentForm` with server-loaded student |
| `/students/[studentId]/courses/[courseId]/edit` | teacher | `requireRoleServer(Teacher)` | `EditStudentCourse` → `EditStudentCourseForm` |

Entry points use `EditStudentLink` (pencil `ButtonLink`):

- `StudentDetails` (teacher's student page) shows "Edit student" only when `student.isEditable`.
- The teacher's course page shows "Edit course".
- `/courses` shows "Edit profile", pointing to the student's own edit page.

## Edit Student Page Guard

The student edit page loads data on the server, so a viewer who may not edit never sees the form.

```mermaid
flowchart TD
  Page["students/[studentId]/edit/page.tsx"] --> Guard["requireStudentEditorServer(studentId)"]
  Guard --> Role["requireRoleServer(Teacher, Student)"]
  Role -->|student opening another id| Own["redirect to their own edit page"]
  Role --> Load["getStudentServer → serverApiRequest → GET /students/:id"]
  Load -->|404 / 400| NotFound["notFound()"]
  Load -->|other failure| Throw["throw → error boundary"]
  Load -->|isEditable false| Back["redirect: teacher → student page, student → /courses"]
  Load -->|isEditable true| Form["render EditStudentForm"]
```

- `getStudentEditPageContent(role, studentId)` picks the title, back label and return link for both the guard redirect and the page.
- `serverApiRequest` (`src/modules/common/api/server-api-request.ts`, `server-only`) forwards the request cookies and returns `{ ok, data }` or `{ ok: false, status, errorCode }`. `getCurrentUserServer` uses the same helper.
- The course edit page has no server data guard: `EditStudentCourse` (Server Component) loads the course and shows `StudentResourceError` for a missing one. The backend only lets the course's teacher update it.

## Saving

```mermaid
sequenceDiagram
  participant Form as EditStudentForm / EditStudentCourseForm
  participant Hook as useServerAction
  participant Action as updateStudentAction / updateStudentCourseAction (server)
  participant BE as Backend

  Form->>Form: zod validation (shared schema)
  Form->>Hook: run(ids, toUpdate…Request(values))
  Hook->>Action: server action call
  Action->>BE: PATCH /students/:id  or  PATCH /students/:id/courses/:courseId
  BE-->>Action: 200 { id }
  Action->>Action: refresh()
  Action-->>Form: { ok: true } or { ok: false, errorCode }
  Form->>Form: toast, router.push(return page)
```

- **Prefill:** `toStudentFormValues` / `toStudentCourseFormValues` turn `null` into `""` for inputs; hobbies are joined with `", "`.
- **Requests send every editable field.** Emptied fields become `null`, which clears them on the backend.
  - `toUpdateManagedStudentRequest` (teacher) includes `email`.
  - `toUpdateStudentProfileRequest` (student) leaves `email` out; `StudentFormFields` hides the email input (`isEmailEditable={false}`).
  - `toUpdateStudentCourseRequest` never sends `language`.
- **Shared with create:** `StudentFormFields`, `StudentCourseFormFields` and the schemas in `src/modules/students/schemas/` (`studentFormSchema`, `studentCourseFormSchema`) are used by both the create and edit forms. The create course form passes its `StudentCourseLanguageField` through `languageField`; the edit form has none.
- **Fresh data:** there is no client cache. A successful action calls `refresh()`, and the page it navigates to is rendered on the server from current backend data.

## Errors

| Case | Shown |
| --- | --- |
| `409 USER_WITH_EMAIL_ALREADY_EXISTS` | error on the email field + toast |
| `403 STUDENT_NOT_EDITABLE` (e.g. the student activated their account meanwhile) | `ERRORS.STUDENTS.NOT_EDITABLE` |
| any other student update failure | `ERRORS.STUDENTS.UPDATE_FAILED` |
| any course update failure | `ERRORS.COURSES.UPDATE_FAILED` |

All messages are frontend-owned (`ERRORS`), never backend text.
