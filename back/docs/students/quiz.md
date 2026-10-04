# Students Feature Quiz

Self-check questions about the students feature. Each answer reflects the current code; see [student-endpoints.md](student-endpoints.md) and [language-course-endpoints.md](language-course-endpoints.md) for the full flows.

## 1. What happens to a `GET /students/:studentId` request from start to finish?

Guards run in order:

1. `JwtAccessGuard` reads the `accessToken` cookie, verifies the JWT, loads the user, checks the email matches the token and the status is `active`, then sets `request.user = { id, name, email, avatarUrl, role }`.
2. `RolesGuard` allows `teacher` or `student` (`@Roles`), otherwise `403 FORBIDDEN`.
3. `StudentAccessGuard` parses `:studentId` as a UUID (`400` if invalid) and calls `StudentAccessService.ensureStudentIsAccessible()`. It allows the student themselves, or a teacher the student belongs to. Otherwise `404 STUDENT_NOT_FOUND`.

Then `StudentsService.getStudentDetails()` calls `StudentsRepository.getStudentDetailsById()`. Everyone who passes gets the same `{ id, name, email, birthDate, job, hobbies, status }`. Only course details differ by viewer.

## 2. Why does `createManagedStudent()` insert the user and the student profile in one transaction?

The two inserts must be all-or-nothing. Without the transaction, a failed profile insert leaves an orphan `users` row: a managed student no list or guard can reach. A retry then fails with `409 USER_WITH_EMAIL_ALREADY_EXISTS` if an email was given, or creates a duplicate orphan if not. The user is inserted first because `students.user_id` is both the primary key and a foreign key to `users.id`.

## 3. When does a student belong to a teacher?

When the teacher created them (`students.created_by_teacher_id`) **or** has a course with them in any language (`student_language_courses.teacher_id`). The rule lives in `StudentsRepository.belongsToTeacher()`. The course part is there because a student can learn several languages with several teachers, and teachers who didn't create a student can still teach them.

## 4. What is the difference between `ManagedStudentGuard` and `StudentAccessGuard`?

`ManagedStudentGuard` allows only a teacher the student belongs to. `StudentAccessGuard` also allows the student themselves. Creating a course is a teacher-only write: `teacherId` comes from the caller, so a student must not pass. Reading courses is something the student legitimately needs, so the `GET` routes use `StudentAccessGuard`.

## 5. Why do denials return `404 STUDENT_NOT_FOUND` instead of `403`?

To prevent id enumeration. With `403`, a caller could tell "this id exists but isn't yours" apart from "no such student" and probe which ids exist. Returning the same `404` for both hides that. `403` is used only by `RolesGuard` for a wrong role, which reveals nothing about a specific student.

## 6. Why can't the ownership query in `ensureStudentIsManagedByTeacher()` be skipped?

`getManagedStudentId()` looks for a row where `user_id = studentId` **and** the student belongs to the teacher; the returned id only serves as yes or no. The `studentId` in the URL is chosen by the client, while ownership is known only to the database. Without the query, any teacher could reach any student by changing the URL.

## 7. What stops a teacher from creating a second course in the same language for the same student?

`StudentLanguageCoursesService.ensureCourseDoesNotExist()` checks for an existing `(student, teacher, language)` course and returns `409 STUDENT_LANGUAGE_COURSE_ALREADY_EXISTS`. The unique constraint `student_language_courses_student_teacher_language_unique` backs it up. If two requests race past the check, the second insert fails and `@HandleDatabaseError()` maps it to `409 DATABASE_UNIQUE_CONSTRAINT`.

## 8. How does the student list's `search` work?

It is one SQL query: the student must belong to the teacher, **and** their name or email must start with the text, case-insensitive (`users.name ILIKE 'an%' OR users.email ILIKE 'an%'`). Students without an email match by name only. The two checks are one `OR`, not run in sequence.

## 9. Why are there separate repository methods for the student's and the teacher's course lists?

The old single method took `teacherId: string | null`, where `null` silently meant "every teacher's courses". A bug passing `null` for a teacher would leak other teachers' courses with no compile error. Now `getStudentLanguageCourseCards(studentId)` returns all courses for the student's own view, and `getTeacherStudentLanguageCourseCards({ studentId, teacherId })` requires a `teacherId`. Each has a fixed `where`, and the service picks one with `isStudentSelf()`. The single-course pair works the same way.

## 10. When is a teacher's `teachers` row created?

When the teacher account becomes active, in the same transaction as the user change, through `UsersRepository.ensureRoleProfile()` (`ON CONFLICT DO NOTHING`):

- email verification: `activateUserById()`
- Google sign-up: `createGoogleAuthUser()`
- Google link or sign-in: `updateGoogleAuthUserById()`

Without the transaction, an active teacher could end up without the row and get `400 TEACHER_NOT_FOUND` on every student endpoint, with no verification step left to fix it. With it, a failure rolls back the activation and the user can retry. Migration `backfill_teachers` covered teachers created earlier.

## 11. What happens when the owner of a managed student's email signs in with Google?

`GoogleOAuthService.linkGoogleProfile()` finds the managed user by email and rejects with `409 USER_WITH_EMAIL_ALREADY_EXISTS`. Without this check, Google linking would attach the Google id and set the account `active`, letting someone take over a teacher-created account and bypass the future invite flow. Email sign-up also fails (`409 DATABASE_UNIQUE_CONSTRAINT`), and verify-signup rejects `managed` users.

## 12. What happens when a non-teacher creates a student with `POST /students`?

The request succeeds: the route has no `@Roles`, and `RolesGuard` allows routes without role metadata. `StudentsService.createStudent()` skips the teacher check and stores `created_by_teacher_id = null`. No teacher can reach that student: "belongs to" needs a creator or a course, and creating a course needs `ManagedStudentGuard`. Only the student themselves can open it, once activated by the future invite flow.
