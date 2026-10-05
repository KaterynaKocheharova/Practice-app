import { Card } from "@/modules/common/components";
import { StudentHobbies } from "../student-hobbies/student-hobbies";
import { studentCardStyles } from "./style";
import type { StudentCardProps } from "./types";

export const StudentCard = ({
  student: { hobbies, job, name },
}: StudentCardProps) => (
  <Card className={studentCardStyles.root}>
    <h2 className={studentCardStyles.name}>{name}</h2>
    {job && <p className={studentCardStyles.job}>{job}</p>}
    {hobbies && hobbies.length > 0 && <StudentHobbies hobbies={hobbies} />}
  </Card>
);
