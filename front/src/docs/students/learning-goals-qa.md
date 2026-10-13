# Learning Goals Q&A

**1. Why an enum array column instead of a goals table?**
No join or aggregation on reads, create/update stay single statements, and courses are never searched by goal. A table pays off only for cross-course goal filtering or per-goal data.

**2. Where is "at least one goal" enforced on the backend, and why not only in the DTO?**
`@ArrayNotEmpty()` in both DTOs (clean `400`) and the `cardinality(learning_goals) >= 1` check plus `NOT NULL`. The DTO covers only HTTP requests; the constraint holds for migrations, scripts and manual SQL too.

**3. Why does update use `@ValidateIf(value !== undefined)` instead of `@IsOptional()`?**
`@IsOptional()` also skips `null`, which would reach the database. `@ValidateIf` skips only a missing field, so `null` fails `@IsArray()` with `400`: optional, but not nullable.

**4. What does `learningGoals: ["grammar"]` do to a course with `["conversation", "business"]`?**
Replaces the whole set with `{grammar}`. The frontend therefore always sends every ticked goal.

**5. Who may change a course's goals?**
Only the teacher who runs the course. Another teacher gets `404` (the `UPDATE … WHERE id, student_id, teacher_id` matches nothing); a student gets `403` from the teacher-only role check.

**6. Why add the column nullable and set `NOT NULL` after the backfill?**
`ADD COLUMN … NOT NULL` without a default fails on a table with rows, and the generated SQL dropped `learning_goal` without copying it. Order: add nullable → backfill → `NOT NULL` → drop old column → check.