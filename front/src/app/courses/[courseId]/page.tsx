import { UserRole } from "@/modules/auth/auth.enums";
import { requireRoleServer } from "@/modules/auth/api/require-role-server";
import { BackLink, Container, Section } from "@/modules/common/components";
import { APP_ROUTES, TEXTS } from "@/modules/common/constants";
import { StudentCourseDetails } from "@/modules/students/components";
import { coursePageStyles } from "./style";
import type { CoursePageProps } from "./types";

const CoursePage = async ({ params }: CoursePageProps) => {
  const [currentUser, { courseId }] = await Promise.all([
    requireRoleServer(UserRole.Student),
    params,
  ]);

  return (
    <main className={coursePageStyles.main}>
      <Section className={coursePageStyles.section}>
        <Container className={coursePageStyles.container}>
          <BackLink
            href={APP_ROUTES.COURSES}
            label={TEXTS.COURSES.BACK_TO_COURSES}
          />
          <StudentCourseDetails
            courseId={courseId}
            studentId={currentUser.id}
          />
        </Container>
      </Section>
    </main>
  );
};

export default CoursePage;
