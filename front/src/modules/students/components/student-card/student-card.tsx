import Link from "next/link";
import { Card } from "@/modules/common/components";
import { APP_ROUTES } from "@/modules/common/constants";
import { StudentHobbies } from "../student-hobbies/student-hobbies";
import { studentCardStyles } from "./style";
import type { StudentCardProps } from "./types";

export const StudentCard = ({
  student: { hobbies, id, job, name },
}: StudentCardProps) => (
  <Link
    className={studentCardStyles.link}
    href={APP_ROUTES.STUDENT_DETAILS(id)}
  >
    <Card className={studentCardStyles.root}>
      <h2 className={studentCardStyles.name}>{name}</h2>
      {job && <p className={studentCardStyles.job}>{job}</p>}
      {hobbies && hobbies.length > 0 && <StudentHobbies hobbies={hobbies} />}
    </Card>
  </Link>
);
