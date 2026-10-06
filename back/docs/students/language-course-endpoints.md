# Language Course Endpoints

A language course links a student, a teacher and one language, and holds the goals, teacher comments and five skill levels. A student can learn several languages with several teachers; a teacher can have one course per language with the same student.

Access rules and guards are described in [student-endpoints.md](student-endpoints.md#access-rules).

## Routes

| Method | Route | Roles | Access guard |
|---|---|---|---|
| `POST` | `/students/:studentId/courses` | teacher | `ManagedStudentGuard` |
| `GET` | `/students/:studentId/available-course-languages` | teacher | `ManagedStudentGuard` |
| `GET` | `/students/:studentId/courses` | teacher, student | `StudentAccessGuard` |
| `GET` | `/students/:studentId/courses/:courseId` | teacher, student | `StudentAccessGuard` |

## Create Course

```txt
POST /students/:studentId/courses
{ language, learningGoal?, specialGoal?, comments?, grammarLevel?, vocabularyLevel?,
  speakingLevel?, readingLevel?, listeningLevel? }  ->  201 { id }
```

```mermaid
flowchart TD
  Request["POST /students/:studentId/courses"] --> Guards["JwtAccessGuard + RolesGuard (teacher)"]
  Guards --> Access["ManagedStudentGuard: student belongs to caller? else 404 STUDENT_NOT_FOUND"]
  Access --> Service["StudentLanguageCoursesService.createStudentLanguageCourse()"]
  Service --> Duplicate["course for student + caller + language exists? 409 STUDENT_LANGUAGE_COURSE_ALREADY_EXISTS"]
  Duplicate --> Insert["StudentLanguageCoursesRepository.createStudentLanguageCourse()"]
  Insert --> Response["201 { id }"]
```

- `teacherId` always comes from the caller, never from the body.
- Only `language` is required. `learningGoal` is the `LearningGoal` enum; any other goal goes in `specialGoal` (free text). Levels use the `LanguageLevel` enum (`a0` … `c2`, e.g. `b1_plus`).
- The unique constraint `(student_id, teacher_id, language)` backs up the duplicate check.

## Available Languages

```txt
GET /students/:studentId/available-course-languages  ->  200 ["german", "french", ...]
```

Languages in which the caller can still create a course for this student; `[]` when every language is taken. The frontend uses it to fill the create form's language select.

```mermaid
flowchart TD
  Request["GET /students/:studentId/available-course-languages"] --> Guards["JwtAccessGuard + RolesGuard (teacher)"]
  Guards --> Access["ManagedStudentGuard: student belongs to caller? else 404 STUDENT_NOT_FOUND"]
  Access --> Service["StudentLanguageCoursesService.getAvailableCourseLanguages()"]
  Service --> Taken["repository.getTeacherStudentCourseLanguages(): languages of the caller's courses with this student"]
  Taken --> Filter["Object.values(Language) minus taken"]
  Filter --> Response["200 Language[]"]
```

The repository returns only the taken languages (`language` column only); deciding what is available is the service's job.

## List Courses

```txt
GET /students/:studentId/courses?language=english  ->  200 [{ id, language, learningGoal }]
```

| Caller | Courses returned | Repository method |
|---|---|---|
| the student themselves | all their courses, from every teacher | `getStudentLanguageCourseCards({ studentId, language })` |
| a teacher | only the courses they teach to this student | `getTeacherStudentLanguageCourseCards({ studentId, teacherId, language })` |

Newest first, no pagination. `language` is optional (`GetStudentLanguageCoursesQueryDto`, validated with `@IsEnum(Language)`, `400` otherwise). The controller passes `null` when it is missing, and the repository's `languageFilter()` adds `language = $1` to the `where` only when it is set.

## Course Details

```txt
GET /students/:studentId/courses/:courseId  ->  200 { id, language, learningGoal, specialGoal, …levels, comments? }
```

```mermaid
flowchart TD
  Request["GET /students/:studentId/courses/:courseId"] --> Guards["JwtAccessGuard + RolesGuard + StudentAccessGuard"]
  Guards --> Service["StudentLanguageCoursesService.getStudentLanguageCourse()"]
  Service --> Self{"caller is the student?"}
  Self -- yes --> StudentView["getStudentLanguageCourseStudentView(): course of this student, no comments"]
  Self -- no --> Details["getStudentLanguageCourseDetails(): course of this student taught by caller, with comments"]
  StudentView --> Found{"found?"}
  Details --> Found
  Found -- no --> NotFound["404 STUDENT_LANGUAGE_COURSE_NOT_FOUND"]
  Found -- yes --> Response["200 course"]
```

`comments` are the teacher's private notes: the student's query never selects them.

## Files

- `src/modules/students/controllers/students.controller.ts`
- `src/modules/students/services/student-language-courses.service.ts`
- `src/modules/students/repositories/student-language-courses.repository.ts`
- `src/modules/students/dto/create-student-language-course.dto.ts`
- `src/modules/students/dto/get-student-language-courses-query.dto.ts`
- `src/modules/students/constants/repository/student-language-course-select-fields.constant.ts`
- `src/modules/students/constants/repository/student-language-course-language-select-fields.constant.ts`
- `src/constant/swagger/students/get-available-course-languages.swagger.ts`
