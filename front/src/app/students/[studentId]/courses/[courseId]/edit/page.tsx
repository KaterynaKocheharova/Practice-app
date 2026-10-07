import { UserRole } from "@/modules/auth/auth.enums";
import { requireRoleServer } from "@/modules/auth/api/require-role-server";
import {
  BackLink,
  Card,
  Container,
  Section,
} from "@/modules/common/components";
import { APP_ROUTES, TEXTS } from "@/modules/common/constants";
import { EditStudentCourse } from "@/modules/students/components";
import { editStudentCoursePageStyles } from "./style";
import type { EditStudentCoursePageProps } from "./types";

const EditStudentCoursePage = async ({
  params,
}: EditStudentCoursePageProps) => {
  await requireRoleServer(UserRole.Teacher);

  const { courseId, studentId } = await params;

  return (
    <main className={editStudentCoursePageStyles.main}>
      <Section className={editStudentCoursePageStyles.section}>
        <Container className={editStudentCoursePageStyles.container}>
          <BackLink
            href={APP_ROUTES.STUDENT_COURSE_DETAILS(studentId, courseId)}
            label={TEXTS.COURSES.BACK_TO_COURSE}
          />
          <Card className={editStudentCoursePageStyles.card}>
            <EditStudentCourse courseId={courseId} studentId={studentId} />
          </Card>
        </Container>
      </Section>
    </main>
  );
};

export default EditStudentCoursePage;
