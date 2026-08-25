# Entities

## Current Tables

```mermaid
erDiagram
  USERS {
    uuid id PK
    varchar name
    varchar email UK
    text password_hash
    user_role role
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
  TEACHERS ||--o{ STUDENTS : "teacher has students"
```

## Indexes

- `users.id`: primary key index.
- `users.email`: unique index.
- `teachers.user_id`: primary key index and foreign key to `users.id`.
- `students.user_id`: primary key index and foreign key to `users.id`.
- `students.teacher_id`: indexed foreign key to `teachers.user_id`.

## Notes

- `students.teacher_id` uses `onDelete: set null`.
- Student creation is still service-guarded: `StudentsService.createStudent()` checks that the teacher exists before insert.
