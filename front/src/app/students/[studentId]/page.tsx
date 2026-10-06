import { UserRole } from "@/modules/auth/auth.enums";
import { requireRoleServer } from "@/modules/auth/api/require-role-server";
import { Container, Section } from "@/modules/common/components";
import { StudentProfile } from "@/modules/students/components";
import { parseCourseLanguage } from "@/modules/students/utils";
import { studentPageStyles } from "./style";
import type { StudentPageProps } from "./types";

const StudentPage = async ({ params, searchParams }: StudentPageProps) => {
  await requireRoleServer(UserRole.Teacher);

  const [{ studentId }, { language }] = await Promise.all([
    params,
    searchParams,
  ]);

  return (
    <main className={studentPageStyles.main}>
      <Section className={studentPageStyles.section}>
        <Container>
          <StudentProfile
            language={parseCourseLanguage(language)}
            studentId={studentId}
          />
        </Container>
      </Section>
    </main>
  );
};

export default StudentPage;
