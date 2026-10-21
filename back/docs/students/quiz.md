# Students Feature Quiz

Self-check questions about the students feature. Each answer reflects the current code; see [student-endpoints.md](student-endpoints.md) and [language-course-endpoints.md](language-course-endpoints.md) for the full flows.

## 1. What happens to a `GET /students/:studentId` request from start to finish?

Guards run in order:

1. `JwtAccessGuard` reads the `accessToken` cookie, verifies the JWT, loads the user, checks the email matches the token and the status is `active` (`onboarding` gets `403 ONBOARDING_REQUIRED`), then sets `request.user = { id, name, email, avatarUrl, role }`.
2. `RolesGuard` allows `teacher` or `student` (`@Roles`), otherwise `403 FORBIDDEN`.


## 2. Why does `createManagedStudent()` insert the user and the student profile in one transaction?

The two inserts must be all-or-nothing. Without the transaction, a failed profile insert leaves an orphan `users` row: a managed student no list or guard can reach. Managed students have no email, so nothing unique blocks a retry: it would create a duplicate orphan. The user is inserted first because `students.user_id` is both the primary key and a foreign key to `users.id`.

## 3. When does a student belong to a teacher?

When the teacher created them (`students.created_by_teacher_id`) **or** has a course with them in any language (`student_language_courses.teacher_id`). The rule lives in `StudentsRepository.belongsToTeacher()`. The course part is there because a student can learn several languages with several teachers, and teachers who didn't create a student can still teach them.

## 4. When does an endpoint need a separate ownership check instead of a condition in its query?

Only when the query has no `WHERE` to carry the condition: an insert, or a side effect outside the database. Creating a course is an insert, so the service first calls `StudentsRepository.getTeacherStudentId()`. Reads, updates and deletes put the caller's condition (`teacher_id = caller`, `student_id = caller`, `added_by_user_id = caller`) straight into their query, so no guard or precheck is needed there.

## 5. Why do denials return `404 STUDENT_NOT_FOUND` instead of `403`?

To prevent id enumeration. With `403`, a caller could tell "this id exists but isn't yours" apart from "no such student" and probe which ids exist. Returning the same `404` for both hides that. `403` is used only by `RolesGuard` for a wrong role, which reveals nothing about a specific student.

## 6. Why can't the ownership lookup before creating a course be skipped?

`StudentLanguageCoursesService.ensureTeacherStudentExists()` calls `getTeacherStudentId()`, which looks for a row where `user_id = studentId` **and** the student belongs to the teacher; the returned id only serves as yes or no. The `studentId` in the URL is chosen by the client and the insert has no `WHERE`. Without the lookup, any teacher could open a course for any student, and that course would then make the student belong to them.

## 7. What stops a teacher from creating a second course in the same language for the same student?

`StudentLanguageCoursesService.ensureCourseDoesNotExist()` checks for an existing `(student, teacher, language)` course and returns `409 STUDENT_LANGUAGE_COURSE_ALREADY_EXISTS`. The unique constraint `student_language_courses_student_teacher_language_unique` backs it up. If two requests race past the check, the second insert fails and `@HandleDatabaseError()` maps it to `409 DATABASE_UNIQUE_CONSTRAINT`.

## 8. How does the student list's `search` work?

It is one SQL query: the student must belong to the teacher, **and** their name or email must start with the text, case-insensitive (`users.name ILIKE 'an%' OR users.email ILIKE 'an%'`). Students without an email match by name only. The two checks are one `OR`, not run in sequence.

## 9. Why are there separate repository methods for the student's and the teacher's course lists?

The old single method took `teacherId: string | null`, where `null` silently meant "every teacher's courses". A bug passing `null` for a teacher would leak other teachers' courses with no compile error. Now `getStudentLanguageCourseCards(studentId)` returns all courses for the student's own view, and `getTeacherStudentLanguageCourseCards({ studentId, teacherId })` requires a `teacherId`. Each has a fixed `where`, and the service picks one with `isStudentSelf()`. The single-course pair works the same way.

## 10. When is a teacher's `teachers` row created?

When onboarding sets the role to `teacher`: `OnboardingRepository.completeTeacherOnboarding()` activates the user and inserts the `teachers` row in one transaction. A first Google sign-in (`createGoogleAuthUser()`) creates no row, because the user has no role yet. Later Google sign-ins and linking (`updateGoogleAuthUserById()`) also run `UsersRepository.ensureRoleProfile()` (`ON CONFLICT DO NOTHING`) as a safety net.

Without the transaction, an active teacher could end up without the row and get `400 TEACHER_NOT_FOUND` on every student endpoint, and onboarding could not be repeated to fix it (`409 ONBOARDING_ALREADY_COMPLETED`). With it, a failure rolls back the activation and the user can retry. Migration `backfill_teachers` covered teachers created earlier.

## 11. What happens when the owner of a managed student's email signs in with Google?

`GoogleOAuthService.linkGoogleProfile()` finds the managed user by email and rejects with `409 USER_WITH_EMAIL_ALREADY_EXISTS`. Without this check, Google linking would attach the Google id and set the account `active`, letting someone take over a teacher-created account and bypass the future invite flow. The frontend shows `/invite-pending` for this error. (Students created today have no email, so this only affects older managed rows that still have one.)

## 12. What happens when a non-teacher creates a student with `POST /students`?

`RolesGuard` rejects it with `403 FORBIDDEN`: the route has `@Roles(UserRole.Teacher)`. Behind it, `StudentsService.createStudent()` also checks that the caller has a `teachers` row (`400 TEACHER_NOT_FOUND` otherwise) and always stores the caller as `created_by_teacher_id`. A user who has not finished onboarding gets `403 ONBOARDING_REQUIRED` from `JwtAccessGuard` before `RolesGuard` runs.
