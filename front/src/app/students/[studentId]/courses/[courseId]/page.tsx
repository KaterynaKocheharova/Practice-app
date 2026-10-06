import { UserRole } from "@/modules/auth/auth.enums";
import { requireRoleServer } from "@/modules/auth/api/require-role-server";
import { BackLink, Container, Section } from "@/modules/common/components";
import { APP_ROUTES, TEXTS } from "@/modules/common/constants";
import { StudentCourseDetails } from "@/modules/students/components";
import { studentCoursePageStyles } from "./style";
import type { StudentCoursePageProps } from "./types";

const StudentCoursePage = async ({ params }: StudentCoursePageProps) => {
  await requireRoleServer(UserRole.Teacher);

  const { courseId, studentId } = await params;

  return (
    <main className={studentCoursePageStyles.main}>
      <Section className={studentCoursePageStyles.section}>
        <Container className={studentCoursePageStyles.container}>
          <BackLink
            href={APP_ROUTES.STUDENT_DETAILS(studentId)}
            label={TEXTS.COURSES.BACK_TO_STUDENT}
          />
          <StudentCourseDetails courseId={courseId} studentId={studentId} />
        </Container>
      </Section>
    </main>
  );
};

export default StudentCoursePage;
