# Student Courses Q&A

**1. Why does a student's `/courses` page need no student-specific endpoint?**
A student's user id is their student id, and `StudentAccessGuard` lets a student read their own data. `/courses` calls `GET /students/:currentUser.id/courses`. 

**2. What makes the student details and courses requests run in parallel?**
The page starts both reads before awaiting `requireRoleServer`, so they run alongside `/users/me`. `StudentDetails` and `StudentCoursesList` call the same `cache()`-wrapped helpers and reuse those requests instead of sending new ones.

**3. Why is the selected language in the URL, not React state?**
It survives reloads, links can be shared, and the server page passes it down as one prop. `router.replace` keeps filter changes out of browser history.

**4. What does `keepPreviousData` do when the filter changes?**
The new language is a new query key. While it loads, the previous list is shown as placeholder data (dimmed, `isPlaceholderData`) instead of the skeleton.

**5. How does a student not receive the teacher's comments?**
The service checks `isStudentSelf()` and calls `getStudentLanguageCourseStudentView()`, whose projection has no `comments`, so they are never read from the database.
