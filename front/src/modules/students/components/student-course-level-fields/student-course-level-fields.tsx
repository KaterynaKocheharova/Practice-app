import { SelectField } from "@/modules/common/components";
import { TEXTS } from "@/modules/common/constants";
import { toSelectOptions } from "@/modules/common/utils";
import { STUDENTS_CONFIG } from "../../students.config";
import { studentCourseLevelFieldsStyles } from "./style";
import type { StudentCourseLevelFieldsProps } from "./types";

const { courseLabels, courseSkillFieldIds, courseSkills } = STUDENTS_CONFIG;
const LEVEL_OPTIONS = toSelectOptions(courseLabels.levels);

export const StudentCourseLevelFields = ({
  errors,
  register,
}: StudentCourseLevelFieldsProps) => (
  <fieldset className={studentCourseLevelFieldsStyles.root}>
    <legend className={studentCourseLevelFieldsStyles.legend}>
      {TEXTS.COURSES.LEVELS_TITLE}
    </legend>
    <div className={studentCourseLevelFieldsStyles.fields}>
      {courseSkills.map((skill) => (
        <SelectField
          errorId={courseSkillFieldIds[skill].error}
          errorMessage={errors[skill]?.message}
          id={courseSkillFieldIds[skill].input}
          key={skill}
          label={courseLabels.skills[skill]}
          optionalLabel={TEXTS.COURSES.OPTIONAL}
          options={LEVEL_OPTIONS}
          placeholder={TEXTS.COURSES.LEVEL_PLACEHOLDER}
          {...register(skill)}
        />
      ))}
    </div>
  </fieldset>
);
