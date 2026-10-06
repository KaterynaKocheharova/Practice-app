import Link from "next/link";
import { Card } from "@/modules/common/components";
import { STUDENTS_CONFIG } from "../../students.config";
import { studentCourseCardStyles } from "./style";
import type { StudentCourseCardProps } from "./types";

const { languages, learningGoals } = STUDENTS_CONFIG.courseLabels;

export const StudentCourseCard = ({
  course: { language, learningGoal },
  href,
}: StudentCourseCardProps) => (
  <Link className={studentCourseCardStyles.link} href={href}>
    <Card className={studentCourseCardStyles.root}>
      <h3 className={studentCourseCardStyles.language}>
        {languages[language]}
      </h3>
      {learningGoal && (
        <p className={studentCourseCardStyles.goal}>
          {learningGoals[learningGoal]}
        </p>
      )}
    </Card>
  </Link>
);
