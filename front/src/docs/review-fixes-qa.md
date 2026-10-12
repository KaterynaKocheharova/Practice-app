# Review Fixes Q&A

Short self-check answers on the full-stack review fixes (frontend part). Full flows are in [api-requests.md](api-requests.md), [students.md](students.md) and [course-documents.md](course-documents.md). Backend answers: `back/docs/students/review-fixes-quiz.md`.

**1. A server action gets `studentId = ".."`. Why could it reach the wrong backend endpoint?**
`encodeURIComponent` leaves `..` unchanged, and `new URL()` reads a `..` segment as "go up one folder": `students/../auth/logout` becomes `/auth/logout`. `%2E%2E` collapses the same way. `createServerApiUrl` now returns `null` for any path with a `.`/`..` segment.