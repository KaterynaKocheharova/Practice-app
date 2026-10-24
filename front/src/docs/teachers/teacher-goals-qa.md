# Teacher Goals Q&A

Short self-check answers; full flows are in [teacher-goals.md](teacher-goals.md). Backend answers are in [teacher-goals-quiz.md](../../../../back/docs/teachers/teacher-goals-quiz.md).

**1. Which actions does an active goal show when `progressCheckDue` is true?**
`TeacherGoalProgressCheck` (Better / Same / Worse) and Delete. Mark addressed and Complete are hidden; `DeleteTeacherGoalButton` is outside both conditions, so every card has it.

**2. How does a card get its new `attemptCount` after a mark, when the endpoint returns `204`?**
The server action calls `refresh()`, the `/goals` page re-renders and fetches the list again, and the changed `getGoalsPageKey` value remounts `TeacherGoalsList` with the new first page.

**3. Why does `TeacherGoalsList` need a `key` at all?**
`useTeacherGoalsPages` copies `firstPage.items` into `useState`, which uses its initial value only on mount. With the same key, React re-renders with new props but keeps the old state; a new key unmounts the list and mounts a fresh one from the new `firstPage`.

**4. Would a lazy initializer `useState(() => firstPage.items)` fix stale state?**
No. It also runs only on mount; it only avoids recomputing an expensive initial value on every render.

**5. What does the key cover?**
The status, `total`, and each first-page goal's id, mark count, check flag and `completedAt`. A remount drops pages added with "Load more", and a goal loaded from a later page doesn't change the key, so its card can stay stale after a mark.
