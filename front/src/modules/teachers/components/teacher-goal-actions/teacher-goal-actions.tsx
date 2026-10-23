import { CompleteTeacherGoalButton } from "../complete-teacher-goal-button/complete-teacher-goal-button";
import { DeleteTeacherGoalButton } from "../delete-teacher-goal-button/delete-teacher-goal-button";
import { MarkTeacherGoalAttemptButton } from "../mark-teacher-goal-attempt-button/mark-teacher-goal-attempt-button";
import { teacherGoalActionsStyles } from "./style";
import type { TeacherGoalActionsProps } from "./types";

export const TeacherGoalActions = ({
  goal: { completedAt, id, progressCheckDue, title },
}: TeacherGoalActionsProps) => {
  const canMarkOrComplete = completedAt === null && !progressCheckDue;

  return (
    <div className={teacherGoalActionsStyles.root}>
      {canMarkOrComplete && (
        <>
          <MarkTeacherGoalAttemptButton goalId={id} title={title} />
          <CompleteTeacherGoalButton goalId={id} title={title} />
        </>
      )}
      <DeleteTeacherGoalButton goalId={id} title={title} />
    </div>
  );
};
