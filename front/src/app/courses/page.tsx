import { UserRole } from "@/modules/auth/auth.enums";
import { requireRoleServer } from "@/modules/auth/api/require-role-server";
import { Container, Section } from "@/modules/common/components";
import { TEXTS } from "@/modules/common/constants";
import { coursesPageStyles } from "./style";

const CoursesPage = async () => {
  await requireRoleServer(UserRole.Student);

  return (
    <main className={coursesPageStyles.main}>
      <Section className={coursesPageStyles.section}>
        <Container>
          <h1 className={coursesPageStyles.title}>{TEXTS.COURSES.TITLE}</h1>
        </Container>
      </Section>
    </main>
  );
};

export default CoursesPage;
