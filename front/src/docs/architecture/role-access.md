# Role Access

Each signed-in role has its own landing route and its own set of pages. Access is decided on the server, per page.

## Landing Routes

`AUTH_CONFIG.roleHomeRoutes` (`src/modules/auth/auth.config.ts`) maps each role to its landing route:

| Role | Landing route |
| --- | --- |
| `teacher` | `/students` |
| `student` | `/courses` (their own courses, see `../students/student-courses.md`) |

Where the map is used:

- `src/app/page.tsx`: `/` redirects signed-in users to their landing route, users without a role yet to `/onboarding`, and everyone else to `/sign-in`.
- The Google callback route redirects to `/` after the code exchange.
- The header and sidebar brand link points to `/`.

## Users Without a Role

A new Google user has `role: null` until onboarding is done (`CurrentUser.role` is `UserRole | null`). The backend still answers `/users/me` for them but rejects every other endpoint with `403 ONBOARDING_REQUIRED`, so the guards send them to `/onboarding` first. See `../onboarding/onboarding.md`.

## Page Guard

`requireRoleServer(...roles)` (`src/modules/auth/api/require-role-server.ts`, `server-only`) is awaited by each protected page before it renders; teacher pages start their data reads just before it so they don't wait for `/users/me` (see `api-requests.md`). It returns an `OnboardedUser` (role always set) and accepts one or more allowed roles:

| Page | Allowed roles |
| --- | --- |
| `src/app/students/page.tsx` | `teacher` |
| `src/app/students/new/page.tsx` | `teacher` |
| `src/app/students/[studentId]/page.tsx` | `teacher` |
| `src/app/students/[studentId]/edit/page.tsx` | `teacher`, `student` (through `requireStudentEditorServer`) |
| `src/app/students/[studentId]/courses/new/page.tsx` | `teacher` |
| `src/app/students/[studentId]/courses/[courseId]/page.tsx` | `teacher` |
| `src/app/students/[studentId]/courses/[courseId]/edit/page.tsx` | `teacher` |
| `src/app/courses/page.tsx` | `student` |
| `src/app/courses/[courseId]/page.tsx` | `student` |

Student pages use the user returned by the guard: `currentUser.id` is the student id they load courses for.

The student edit page adds a second check, `requireStudentEditorServer`: a student may only open their own edit page, and anyone whose `isEditable` is `false` is redirected back. See `../students/student-editing.md`.

```mermaid
flowchart TD
  Page[Protected page] --> Guard["requireRoleServer(role)"]
  Guard --> Me["getCurrentUserServer() → GET /users/me with forwarded cookies"]
  Me -->|null| SignIn["redirect /sign-in"]
  Me -->|role null| Onboarding["redirect /onboarding"]
  Me -->|other role| Home["redirect roleHomeRoutes[user.role]"]
  Me -->|matching role| Render[Render page]
```

The guard only controls page access. The backend enforces the same rules on its endpoints: `GET /students`, `POST /students`, course creation and available languages are teacher-only (and only for the teacher's own students). A student's details and courses are readable by that student or their teacher; everyone else gets `404`. Editing a student is allowed to the creating teacher while the student is managed, and to the student once they have their own account; course editing only to the course's teacher.

## Header Navigation

`COMMON_CONFIG.header.primaryNavLinks` gives each link a `roles` list. `Header` filters the list with `getPrimaryNavLinks(role)` (`src/modules/common/utils/get-primary-nav-links.ts`) and passes the result to `HeaderDesktopNav` and `Sidebar`:

- teacher → "Students"
- student → "Courses"
- signed out, or while logging out → no primary links
