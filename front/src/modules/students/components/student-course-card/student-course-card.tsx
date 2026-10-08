import Link from "next/link";
import { Card } from "@/modules/common/components";
import { STUDENTS_CONFIG } from "../../students.config";
import { formatLearningGoals } from "../../utils";
import { studentCourseCardStyles } from "./style";
import type { StudentCourseCardProps } from "./types";

const { languages } = STUDENTS_CONFIG.courseLabels;

export const StudentCourseCard = ({
  course: { language, learningGoals },
  href,
}: StudentCourseCardProps) => (
  <Link className={studentCourseCardStyles.link} href={href}>
    <Card className={studentCourseCardStyles.root}>
      <h3 className={studentCourseCardStyles.language}>
        {languages[language]}
      </h3>
      <p className={studentCourseCardStyles.goal}>
        {formatLearningGoals(learningGoals)}
      </p>
    </Card>
  </Link>
);
