import { Plus } from "lucide-react";
import { UserRole } from "@/modules/auth/auth.enums";
import { BackLink, ButtonLink } from "@/modules/common/components";
import { APP_ROUTES, TEXTS } from "@/modules/common/constants";
import { StudentsHeadingLevel } from "../../students.enums";
import { StudentCourses } from "../student-courses/student-courses";
import { StudentDetails } from "../student-details/student-details";
import { studentProfileStyles } from "./style";
import type { StudentProfileProps } from "./types";

/** The teacher's view of one student; details and courses load in parallel. */
export const StudentProfile = ({
  language,
  studentId,
}: StudentProfileProps) => (
  <div className={studentProfileStyles.root}>
    <BackLink
      href={APP_ROUTES.STUDENTS}
      label={TEXTS.STUDENTS.BACK_TO_STUDENTS}
    />
    <StudentDetails studentId={studentId} />
    <StudentCourses
      action={
        <ButtonLink href={APP_ROUTES.STUDENT_COURSE_NEW(studentId)}>
          <Plus aria-hidden="true" className={studentProfileStyles.addIcon} />
          {TEXTS.COURSES.CREATE_COURSE}
        </ButtonLink>
      }
      language={language}
      studentId={studentId}
      title={TEXTS.COURSES.TITLE}
      titleLevel={StudentsHeadingLevel.H2}
      viewerRole={UserRole.Teacher}
    />
  </div>
);
