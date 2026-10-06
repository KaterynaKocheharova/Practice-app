import { UserRole } from "@/modules/auth/auth.enums";
import { requireRoleServer } from "@/modules/auth/api/require-role-server";
import { Container, Section } from "@/modules/common/components";
import { TEXTS } from "@/modules/common/constants";
import { StudentCourses } from "@/modules/students/components";
import { StudentsHeadingLevel } from "@/modules/students/students.enums";
import { parseCourseLanguage } from "@/modules/students/utils";
import { coursesPageStyles } from "./style";
import type { CoursesPageProps } from "./types";

/** A student's own courses: their user id is their student id. */
const CoursesPage = async ({ searchParams }: CoursesPageProps) => {
  const [currentUser, { language }] = await Promise.all([
    requireRoleServer(UserRole.Student),
    searchParams,
  ]);

  return (
    <main className={coursesPageStyles.main}>
      <Section className={coursesPageStyles.section}>
        <Container>
          <StudentCourses
            language={parseCourseLanguage(language)}
            studentId={currentUser.id}
            title={TEXTS.COURSES.TITLE}
            titleLevel={StudentsHeadingLevel.H1}
            viewerRole={UserRole.Student}
          />
        </Container>
      </Section>
    </main>
  );
};

export default CoursesPage;
