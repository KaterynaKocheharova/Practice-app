import { Card } from "@/modules/common/components";
import { TEXTS } from "@/modules/common/constants";
import { StudentHobbies } from "../student-hobbies/student-hobbies";
import { studentDetailsCardStyles } from "./style";
import type { StudentDetailsCardProps } from "./types";

export const StudentDetailsCard = ({
  action,
  student: { birthDate, email, hobbies, job, name },
}: StudentDetailsCardProps) => {
  const fields = [
    { label: TEXTS.STUDENTS.EMAIL, value: email },
    { label: TEXTS.STUDENTS.BIRTH_DATE, value: birthDate },
    { label: TEXTS.STUDENTS.JOB, value: job },
  ];

  return (
    <Card
      aria-label={TEXTS.STUDENTS.STUDENT_DETAILS_LABEL}
      className={studentDetailsCardStyles.root}
    >
      <div className={studentDetailsCardStyles.header}>
        <h1 className={studentDetailsCardStyles.name}>{name}</h1>
        {action}
      </div>
      <dl className={studentDetailsCardStyles.fields}>
        {fields.map(({ label, value }) => (
          <div className={studentDetailsCardStyles.field} key={label}>
            <dt className={studentDetailsCardStyles.label}>{label}</dt>
            <dd className={studentDetailsCardStyles.value}>
              {value ?? TEXTS.COURSES.NOT_SET}
            </dd>
          </div>
        ))}
      </dl>
      {hobbies && hobbies.length > 0 && <StudentHobbies hobbies={hobbies} />}
    </Card>
  );
};
