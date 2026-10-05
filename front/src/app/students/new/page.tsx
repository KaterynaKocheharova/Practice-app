import { UserRole } from "@/modules/auth/auth.enums";
import { requireRoleServer } from "@/modules/auth/api/require-role-server";
import { Card, Container, Section } from "@/modules/common/components";
import { TEXTS } from "@/modules/common/constants";
import {
  CreateStudentForm,
  StudentsPageHeader,
} from "@/modules/students/components";
import { newStudentPageStyles } from "./style";

const NewStudentPage = async () => {
  await requireRoleServer(UserRole.Teacher);

  return (
    <main className={newStudentPageStyles.main}>
      <Section className={newStudentPageStyles.section}>
        <Container className={newStudentPageStyles.container}>
          <Card className={newStudentPageStyles.card}>
            <StudentsPageHeader title={TEXTS.STUDENTS.NEW_STUDENT_TITLE} />
            <CreateStudentForm />
          </Card>
        </Container>
      </Section>
    </main>
  );
};

export default NewStudentPage;
