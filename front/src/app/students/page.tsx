import { UserRole } from "@/modules/auth/auth.enums";
import { requireRoleServer } from "@/modules/auth/api/require-role-server";
import { Container, Section } from "@/modules/common/components";
import { StudentsOverview } from "@/modules/students/components";
import { studentsPageStyles } from "./style";

const StudentsPage = async () => {
  await requireRoleServer(UserRole.Teacher);

  return (
    <main className={studentsPageStyles.main}>
      <Section className={studentsPageStyles.section}>
        <Container>
          <StudentsOverview />
        </Container>
      </Section>
    </main>
  );
};

export default StudentsPage;
