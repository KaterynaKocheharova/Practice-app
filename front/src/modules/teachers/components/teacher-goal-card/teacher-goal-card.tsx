import { Card } from "@/modules/common/components";
import { TEXTS } from "@/modules/common/constants";
import { formatGoalDate } from "../../utils";
import { TeacherGoalActions } from "../teacher-goal-actions/teacher-goal-actions";
import { teacherGoalCardStyles } from "./style";
import type { TeacherGoalCardProps } from "./types";

export const TeacherGoalCard = ({ goal }: TeacherGoalCardProps) => {
  const { attemptCount, completedAt, createdAt, details, title } = goal;
  const isCompleted = completedAt !== null;

  return (
    <Card className={teacherGoalCardStyles.root}>
      <div className={teacherGoalCardStyles.content}>
        <div className={teacherGoalCardStyles.header}>
          <h2 className={teacherGoalCardStyles.title}>{title}</h2>
          <span className={teacherGoalCardStyles.status(isCompleted)}>
            {isCompleted ? TEXTS.GOALS.COMPLETED : TEXTS.GOALS.ACTIVE}
          </span>
        </div>
        {details && <p className={teacherGoalCardStyles.details}>{details}</p>}
        <p className={teacherGoalCardStyles.meta}>
          {isCompleted
            ? TEXTS.GOALS.COMPLETED_ON(formatGoalDate(completedAt))
            : TEXTS.GOALS.CREATED_ON(formatGoalDate(createdAt))}{" "}
          · {TEXTS.GOALS.ATTEMPT_COUNT(attemptCount)}
        </p>
      </div>
      <TeacherGoalActions goal={goal} />
    </Card>
  );
};
