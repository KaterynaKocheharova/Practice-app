# Entities

## Current Tables

```mermaid
erDiagram
  USERS {
    uuid id PK
    varchar name
    varchar email UK
    text password_hash
    varchar auth_provider
    text google_id UK
    user_role role
    user_status status
    timestamptz created_at
    timestamptz updated_at
  }

  AUTH_SESSIONS {
    uuid id PK
    uuid user_id FK
    text hashed_refresh_token
    timestamptz expires_at
    timestamptz revoked_at
    uuid replaced_by FK
    timestamptz created_at
    timestamptz updated_at
  }

  VERIFICATION_LINKS {
    uuid id PK
    uuid user_id FK
    text email
    verification_link_purpose purpose
    text hashed_token
    timestamptz expires_at
    timestamptz used_at
    timestamptz revoked_at
    timestamptz created_at
    timestamptz updated_at
  }

  TEACHERS {
    uuid user_id PK, FK
  }

  STUDENTS {
    uuid user_id PK, FK
    uuid teacher_id FK
    text_array hobbies
    learning_goal learning_goal
    text special_goal
    varchar job
    integer age
  }

  USERS ||--o| TEACHERS : "user may be teacher"
  USERS ||--o| STUDENTS : "user may be student"
  USERS ||--o{ AUTH_SESSIONS : "user has auth sessions"
  USERS ||--o{ VERIFICATION_LINKS : "user has verification links"
  AUTH_SESSIONS ||--o| AUTH_SESSIONS : "session may replace session"
  TEACHERS ||--o{ STUDENTS : "teacher has students"
```

## Indexes

- `users.id`: primary key index.
- `users.email`: unique index.
- `users.google_id`: unique index.
- `auth_sessions.id`: primary key index.
- `auth_sessions.user_id`: indexed foreign key to `users.id`.
- `auth_sessions.replaced_by`: foreign key to `auth_sessions.id`.
- `verification_links.id`: primary key index.
- `verification_links.user_id, verification_links.purpose`: composite index for revoking previous unused links.
- `verification_links.expires_at`: indexed for cleanup.
- `teachers.user_id`: primary key index and foreign key to `users.id`.
- `students.user_id`: primary key index and foreign key to `users.id`.
- `students.teacher_id`: indexed foreign key to `teachers.user_id`.

## Notes

- `students.teacher_id` uses `onDelete: set null`.
- `auth_sessions.user_id` uses `onDelete: cascade`.
- `verification_links.user_id` uses `onDelete: cascade`.
- Refresh tokens are stored only as hashes in `auth_sessions.hashed_refresh_token`.
- Verification tokens are stored only as hashes in `verification_links.hashed_token`.
- Student creation is still service-guarded: `StudentsService.createStudent()` checks that the teacher exists before insert.
