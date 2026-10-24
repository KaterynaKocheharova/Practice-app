# Teacher Goals Quiz

Short self-check answers; full flows are in [teacher-goal-endpoints.md](teacher-goal-endpoints.md). Frontend answers are in [teacher-goals-qa.md](../../../front/src/docs/teachers/teacher-goals-qa.md).

**1. Why does `hasActiveGoalCapacity` run `SELECT … FOR UPDATE` on the teacher row before counting active goals?**
It takes a lock on that one row until the transaction ends, so two creates for the same teacher run one after the other: the second waits, then counts after the first one's insert. Without it, a double-click could make both count 2 active goals and insert a 4th. The teacher row is locked because the new goal doesn't exist yet, and other teachers' rows are never affected.

**2. What does a transaction waiting on that lock actually do?**
Its code pauses on the `await` of the `FOR UPDATE` query, because Postgres doesn't answer until the lock is released; only then does it run the count. The wait happens in the database: plain `SELECT`s are never blocked, and Node keeps serving other requests.

**3. Why does `updateTeacherGoal` call `getTeacherGoalId` after the update returns nothing?**
An empty update result means either the teacher has no goal with that id (`404 TEACHER_GOAL_NOT_FOUND`, which also hides other teachers' goals) or the goal already has an attempt (`409 TEACHER_GOAL_HAS_ATTEMPTS`). The lookup tells them apart and runs only on failure, so the success path stays a single atomic query.

**4. How does each listed goal get its `attemptCount`?**
`getTeacherGoalCards` adds a subquery (`$count` on `teacher_goal_attempts` where `teacher_goal_id` equals the outer goal's id) to the select, so it is one query that returns one row per goal. A goal with no attempts gets `0`, and the subquery is an index-only scan on `teacher_goal_attempts_goal_id_created_at_idx`.

**5. Why does `title` use `@ValidateIf(v => v !== undefined)` while `details` uses `@IsOptional()`?**
`@IsOptional()` skips validation for both `undefined` and `null`, so `details: null` passes and clears the nullable column. `@ValidateIf` skips only `undefined`, so `title: null` fails `@IsString()` with `400` because the column is `NOT NULL`. A missing field is dropped by Drizzle's `.set()`, so it is never overwritten.

**6. What stops a teacher from reading, editing or deleting another teacher's goal?**
Every query filters by the teacher id from the access token (`@CurrentUser()`), never from the request, together with the goal id (`teacherGoalMatch`, `teacherGoalsFilter`). Another teacher's goal looks missing and returns `404 TEACHER_GOAL_NOT_FOUND`. `RolesGuard` lets only teachers reach these queries.

**7. A teacher has 2 active goals and 1 completed one. Can they create a new goal?**
Yes. Only goals with `completedAt` null count toward `MAX_ACTIVE_PER_TEACHER` (3); completed goals are unlimited, which is why the list stays paginated. The check runs only on create, so a future "reopen goal" flow must repeat it.

**8. What happens to attempts and progress checks when a goal is deleted?**
Postgres deletes them in the same statement through `onDelete: cascade` on their `teacher_goal_id` foreign keys. It's a hard delete with no recovery, so the frontend asks for confirmation first.

**9. Which goals does the list return without `status`?**
All of the teacher's goals, active and completed: a missing `status` becomes `null`, `statusFilter` returns `undefined`, and `and()` ignores it. `total` uses the same filter, and `teacherId` always stays in it, so the list never includes other teachers' goals.

**10. Why is the "no attempts" check inside the `UPDATE` instead of fetching the attempt count in the service first?**
Checking first and updating in a second query leaves a gap where a mark could be added in between, and the goal would be edited after its first mark. `NOT EXISTS` makes Postgres check for attempts at the moment it updates the row. It isn't a lock;

**11. What does `addTeacherGoalAttempt` do before it inserts a mark?**
In one transaction, `lockTeacherGoalState` locks the goal row by goal id and teacher id (no row → `404 TEACHER_GOAL_NOT_FOUND`) and reads `completedAt`, `attemptCount` and `progressCheckDue`. `activeGoalBlocker` then returns `409 TEACHER_GOAL_ALREADY_COMPLETED` or `409 TEACHER_GOAL_PROGRESS_CHECK_PENDING`; only if neither applies is one `teacher_goal_attempts` row inserted (`204`).

**12. Why does `lockTeacherGoalState` read the state in a second statement after the `FOR UPDATE`?**
At Read Committed each statement has its own snapshot, and the subqueries of a `FOR UPDATE` that waited still see the data from before the wait. The new statement sees what the other transaction committed, so a double click at the 4th mark gets `409 PROGRESS_CHECK_PENDING` instead of slipping a 6th mark past the check.

**13. When is `progressCheckDue` true?**
When `attemptCount > 0`, `attemptCount % 5 = 0` and no progress check exists with `attemptNumber = attemptCount`. Without `> 0`, every new goal would be due, because `0 % 5 = 0`.

**14. Why isn't `attemptCount % 5 = 0` enough on its own?**
Answering a check adds no attempt, so the count stays at 5 after the answer. The `NOT EXISTS` on `teacher_goal_progress_checks` is what turns the flag off; without it the card would stay stuck on the question.

**15. What does the CHECK constraint `attempt_number > 0 AND attempt_number % 5 = 0` allow?**
`%` is the remainder after division, so only 5, 10, 15… pass. It is the database backstop for the rule above; with the unique index on `(teacher_goal_id, attempt_number)` each multiple of 5 has at most one check per goal.

**16. What does `completeTeacherGoal` check before setting `completedAt`?**
The same `activeGoalBlocker` as a mark: not already completed and no progress check pending. Attempts are not required, so a goal with 0 marks can be completed. This is also why a completed goal never has a check due.

**17. Why does the CHECK constraint use `sql.raw(String(PROGRESS_CHECK_INTERVAL))`?**
A normal `${value}` becomes a query parameter (`$1`), but a constraint is fixed SQL text saved in the migration, so `sql.raw` writes the literal `5` into it. It is safe only because the value comes from config, never user input; changing the interval needs a new migration.
