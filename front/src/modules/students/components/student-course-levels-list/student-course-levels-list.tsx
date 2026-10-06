import { TEXTS } from "@/modules/common/constants";
import { STUDENTS_CONFIG } from "../../students.config";
import { studentCourseLevelsListStyles } from "./style";
import type { StudentCourseLevelsListProps } from "./types";

const { courseLabels, courseSkills } = STUDENTS_CONFIG;

export const StudentCourseLevelsList = ({
  levels,
}: StudentCourseLevelsListProps) => (
  <dl className={studentCourseLevelsListStyles.root}>
    {courseSkills.map((skill) => {
      const level = levels[skill];

      return (
        <div className={studentCourseLevelsListStyles.item} key={skill}>
          <dt className={studentCourseLevelsListStyles.label}>
            {courseLabels.skills[skill]}
          </dt>
          <dd className={studentCourseLevelsListStyles.value}>
            {level ? courseLabels.levels[level] : TEXTS.COURSES.NOT_SET}
          </dd>
        </div>
      );
    })}
  </dl>
);
