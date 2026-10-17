import { UserRole } from "@/modules/auth/auth.enums";
import { requireRoleServer } from "@/modules/auth/api/require-role-server";
import { Container, Section } from "@/modules/common/components";
import { getStudentsPageServer } from "@/modules/students/api";
import { StudentsOverview } from "@/modules/students/components";
import { STUDENTS_CONFIG } from "@/modules/students/students.config";
import { studentsPageStyles } from "./style";

const StudentsPage = async () => {
  void getStudentsPageServer({
    limit: STUDENTS_CONFIG.pagination.pageSize,
    offset: 0,
  });

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
