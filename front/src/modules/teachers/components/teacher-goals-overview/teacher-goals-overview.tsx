import { TEXTS } from "@/modules/common/constants";
import { getTeacherGoalsPageServer } from "../../api";
import { TEACHERS_CONFIG } from "../../teachers.config";
import { TeacherGoalStatus } from "../../teachers.enums";
import { getGoalsPageKey } from "../../utils";
import { AddTeacherGoalPanel } from "../add-teacher-goal-panel/add-teacher-goal-panel";
import { TeacherGoalStatusFilter } from "../teacher-goal-status-filter/teacher-goal-status-filter";
import { TeacherGoalsList } from "../teacher-goals-list/teacher-goals-list";
import { TeacherGoalsListError } from "../teacher-goals-list-error/teacher-goals-list-error";
import { teacherGoalsOverviewStyles } from "./style";
import type { TeacherGoalsOverviewProps } from "./types";

export const TeacherGoalsOverview = async ({
  status,
}: TeacherGoalsOverviewProps) => {
  const firstPage = await getTeacherGoalsPageServer({
    limit: TEACHERS_CONFIG.pagination.pageSize,
    offset: 0,
    status,
  });

  return (
    <div className={teacherGoalsOverviewStyles.root}>
      <div className={teacherGoalsOverviewStyles.header}>
        <h1 className={teacherGoalsOverviewStyles.title}>
          {TEXTS.GOALS.TITLE}
        </h1>
        {firstPage.ok && (
          <p className={teacherGoalsOverviewStyles.description}>
            {TEXTS.GOALS.DESCRIPTION(firstPage.data.maxActive)}
          </p>
        )}
      </div>
      <TeacherGoalStatusFilter status={status} />
      {firstPage.ok ? (
        <>
          {status !== TeacherGoalStatus.Completed &&
            firstPage.data.activeTotal < firstPage.data.maxActive && (
              <AddTeacherGoalPanel />
            )}
          <TeacherGoalsList
            firstPage={firstPage.data}
            key={getGoalsPageKey(status, firstPage.data)}
            status={status}
          />
        </>
      ) : (
        <TeacherGoalsListError />
      )}
    </div>
  );
};
