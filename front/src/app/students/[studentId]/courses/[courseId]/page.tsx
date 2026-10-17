import { UserRole } from "@/modules/auth/auth.enums";
import { requireRoleServer } from "@/modules/auth/api/require-role-server";
import { BackLink, Container, Section } from "@/modules/common/components";
import { APP_ROUTES, TEXTS } from "@/modules/common/constants";
import { getStudentCourseServer } from "@/modules/students/api";
import {
  EditStudentLink,
  StudentCourseDetails,
} from "@/modules/students/components";
import { studentCoursePageStyles } from "./style";
import type { StudentCoursePageProps } from "./types";

const StudentCoursePage = async ({ params }: StudentCoursePageProps) => {
  const { courseId, studentId } = await params;

  void getStudentCourseServer({ courseId, studentId });

  await requireRoleServer(UserRole.Teacher);

  return (
    <main className={studentCoursePageStyles.main}>
      <Section className={studentCoursePageStyles.section}>
        <Container className={studentCoursePageStyles.container}>
          <div className={studentCoursePageStyles.toolbar}>
            <BackLink
              href={APP_ROUTES.STUDENT_DETAILS(studentId)}
              label={TEXTS.COURSES.BACK_TO_STUDENT}
            />
            <EditStudentLink
              href={APP_ROUTES.STUDENT_COURSE_EDIT(studentId, courseId)}
              label={TEXTS.COURSES.EDIT_COURSE}
            />
          </div>
          <StudentCourseDetails courseId={courseId} studentId={studentId} />
        </Container>
      </Section>
    </main>
  );
};

export default StudentCoursePage;
