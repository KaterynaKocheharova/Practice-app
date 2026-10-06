import { UserRole } from "@/modules/auth/auth.enums";
import { requireRoleServer } from "@/modules/auth/api/require-role-server";
import {
  BackLink,
  Card,
  Container,
  Section,
} from "@/modules/common/components";
import { APP_ROUTES, TEXTS } from "@/modules/common/constants";
import {
  CreateStudentCourseForm,
  StudentsPageHeader,
} from "@/modules/students/components";
import { newStudentCoursePageStyles } from "./style";
import type { NewStudentCoursePageProps } from "./types";

const NewStudentCoursePage = async ({ params }: NewStudentCoursePageProps) => {
  await requireRoleServer(UserRole.Teacher);

  const { studentId } = await params;

  return (
    <main className={newStudentCoursePageStyles.main}>
      <Section className={newStudentCoursePageStyles.section}>
        <Container className={newStudentCoursePageStyles.container}>
          <BackLink
            href={APP_ROUTES.STUDENT_DETAILS(studentId)}
            label={TEXTS.COURSES.BACK_TO_STUDENT}
          />
          <Card className={newStudentCoursePageStyles.card}>
            <StudentsPageHeader title={TEXTS.COURSES.NEW_COURSE_TITLE} />
            <CreateStudentCourseForm studentId={studentId} />
          </Card>
        </Container>
      </Section>
    </main>
  );
};

export default NewStudentCoursePage;
