# Student Editing Q&A

**1. Who may edit a student's profile?**
The creating teacher while the student is `managed` (email included); the student themselves once not managed, except the email. Everyone else, including a candidate who just lost the right, gets `404 STUDENT_NOT_FOUND`.

**2. How does the frontend decide to show "Edit student"?**
From the backend's `isEditable` on `GET /students/:id`, so the edit rule lives only on the backend. `status` alone cannot tell which teacher created the student.

**3. Why are emptied fields sent as `null`, not omitted?**
In `PATCH`, an omitted field is kept and `null` clears it; `""` fails validation. Hidden fields (student's email, course language) are omitted, never `null`.

**4. Why does course `PATCH` have no access guard?**
`JwtAccessGuard` and `RolesGuard` apply to the controller; access is checked by the `UPDATE … WHERE id, student_id, teacher_id` itself. No row means `404`, in one atomic step.
