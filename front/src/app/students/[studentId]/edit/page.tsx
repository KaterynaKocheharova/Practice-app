import {
  BackLink,
  Card,
  Container,
  Section,
} from "@/modules/common/components";
import { requireStudentEditorServer } from "@/modules/students/api/require-student-editor-server";
import {
  EditStudentForm,
  StudentsPageHeader,
} from "@/modules/students/components";
import { getStudentEditPageContent } from "@/modules/students/utils";
import { editStudentPageStyles } from "./style";
import type { EditStudentPageProps } from "./types";

/** Shared by the creating teacher and the student editing their own profile. */
const EditStudentPage = async ({ params }: EditStudentPageProps) => {
  const { studentId } = await params;
  const { currentUser, student } = await requireStudentEditorServer(studentId);
  const { backLabel, returnHref, title } = getStudentEditPageContent(
    currentUser.role,
    studentId,
  );

  return (
    <main className={editStudentPageStyles.main}>
      <Section className={editStudentPageStyles.section}>
        <Container className={editStudentPageStyles.container}>
          <BackLink href={returnHref} label={backLabel} />
          <Card className={editStudentPageStyles.card}>
            <StudentsPageHeader title={title} />
            <EditStudentForm
              returnHref={returnHref}
              student={student}
            />
          </Card>
        </Container>
      </Section>
    </main>
  );
};

export default EditStudentPage;
