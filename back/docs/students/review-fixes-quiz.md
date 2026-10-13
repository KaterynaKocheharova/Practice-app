# Review Fixes Quiz

Short self-check answers on the full-stack review fixes (backend part). Full flows are in [student-endpoints.md](student-endpoints.md), [course-document-endpoints.md](course-document-endpoints.md), [media-assets.md](../media-assets/media-assets.md) and [migrations.md](../db/migrations.md). Frontend answers: `front/src/docs/students/review-fixes-qa.md`.

**1. Before the fix, what did typing `_` into the student search return?**
The pattern became `_%` ("one character, then anything"), so it matched every student with a non-empty name or email. That is effectively all of them, but still only the teacher's own students (`belongsToTeacher()`), so nothing leaked. Now `escapeLikePattern()` turns `_` into a literal underscore.

**2. How could a teacher stop someone from ever registering with their own email?**
`POST /students` saved a `managed` user with any email the teacher typed, unverified, and `users.email` is unique. When the real owner signed up, `SignupService` called `createUser` and got `409 DATABASE_UNIQUE_CONSTRAINT`; Google sign-up was refused too. Now `CreateStudentDto` and `UpdateStudentDto` have no `email`.

**3. The DTOs already lowercase emails, so why the unique index on `lower(email)`?**
The DTO is a check in the code and only runs where someone called it. The index is a check in the database and runs on every save, whichever code made it, so `John@x.com` and `john@x.com` can never both exist.

**4. Why is it an index and not a unique constraint?**
A Postgres `UNIQUE` constraint covers plain columns only. Uniqueness on an expression like `lower(email)` needs a unique index.
