import { Card } from "@/modules/common/components";
import { TEXTS } from "@/modules/common/constants";
import { formatGoalDate } from "../../utils";
import { DeleteTeacherGoalButton } from "../delete-teacher-goal-button/delete-teacher-goal-button";
import { teacherGoalCardStyles } from "./style";
import type { TeacherGoalCardProps } from "./types";

export const TeacherGoalCard = ({
  goal: { attemptCount, completedAt, createdAt, details, id, title },
}: TeacherGoalCardProps) => {
  const isCompleted = completedAt !== null;

  return (
    <Card className={teacherGoalCardStyles.root}>
      <div className={teacherGoalCardStyles.header}>
        <h2 className={teacherGoalCardStyles.title}>{title}</h2>
        <span className={teacherGoalCardStyles.status(isCompleted)}>
          {isCompleted ? TEXTS.GOALS.COMPLETED : TEXTS.GOALS.ACTIVE}
        </span>
      </div>
      {details && <p className={teacherGoalCardStyles.details}>{details}</p>}
      <div className={teacherGoalCardStyles.footer}>
        <p className={teacherGoalCardStyles.meta}>
          {TEXTS.GOALS.CREATED_ON(formatGoalDate(createdAt))} ·{" "}
          {TEXTS.GOALS.ATTEMPT_COUNT(attemptCount)}
        </p>
        <DeleteTeacherGoalButton goalId={id} title={title} />
      </div>
    </Card>
  );
};
