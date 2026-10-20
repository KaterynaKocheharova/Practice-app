import { UserRole } from "@/modules/auth/auth.enums";
import { requireRoleServer } from "@/modules/auth/api/require-role-server";
import { Container, Section } from "@/modules/common/components";
import { getTeacherGoalsPageServer } from "@/modules/teachers/api";
import { TeacherGoalsOverview } from "@/modules/teachers/components";
import { TEACHERS_CONFIG } from "@/modules/teachers/teachers.config";
import { goalsPageStyles } from "./style";

const GoalsPage = async () => {
  void getTeacherGoalsPageServer({
    limit: TEACHERS_CONFIG.pagination.pageSize,
    offset: 0,
  });

  await requireRoleServer(UserRole.Teacher);

  return (
    <main className={goalsPageStyles.main}>
      <Section className={goalsPageStyles.section}>
        <Container>
          <TeacherGoalsOverview />
        </Container>
      </Section>
    </main>
  );
};

export default GoalsPage;
