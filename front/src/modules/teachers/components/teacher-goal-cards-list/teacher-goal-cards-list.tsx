import { TEXTS } from "@/modules/common/constants";
import { TeacherGoalCard } from "../teacher-goal-card/teacher-goal-card";
import { teacherGoalCardsListStyles } from "./style";
import type { TeacherGoalCardsListProps } from "./types";

export const TeacherGoalCardsList = ({ goals }: TeacherGoalCardsListProps) => (
  <ul
    aria-label={TEXTS.GOALS.LIST_LABEL}
    className={teacherGoalCardsListStyles.root}
  >
    {goals.map((goal) => (
      <li key={goal.id}>
        <TeacherGoalCard goal={goal} />
      </li>
    ))}
  </ul>
);
