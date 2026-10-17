import { UserRole } from "@/modules/auth/auth.enums";
import { requireRoleServer } from "@/modules/auth/api/require-role-server";
import { Container, Section } from "@/modules/common/components";
import {
  getStudentCoursesServer,
  getStudentServer,
} from "@/modules/students/api";
import { StudentProfile } from "@/modules/students/components";
import { parseCourseLanguage } from "@/modules/students/utils";
import { studentPageStyles } from "./style";
import type { StudentPageProps } from "./types";

const StudentPage = async ({ params, searchParams }: StudentPageProps) => {
  const [{ studentId }, { language }] = await Promise.all([
    params,
    searchParams,
  ]);
  const courseLanguage = parseCourseLanguage(language);

  void getStudentServer(studentId);
  void getStudentCoursesServer({ language: courseLanguage, studentId });

  await requireRoleServer(UserRole.Teacher);

  return (
    <main className={studentPageStyles.main}>
      <Section className={studentPageStyles.section}>
        <Container>
          <StudentProfile language={courseLanguage} studentId={studentId} />
        </Container>
      </Section>
    </main>
  );
};

export default StudentPage;
