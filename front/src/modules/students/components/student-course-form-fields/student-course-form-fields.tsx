import { SelectField, TextareaField } from "@/modules/common/components";
import { TEXTS } from "@/modules/common/constants";
import { toSelectOptions } from "@/modules/common/utils";
import { STUDENTS_CONFIG } from "../../students.config";
import { StudentCourseLevelFields } from "../student-course-level-fields/student-course-level-fields";
import { studentCourseFormFieldsStyles } from "./style";
import type { StudentCourseFormFieldsProps } from "./types";

const { courseLabels, forms } = STUDENTS_CONFIG;
const { fieldIds, fields } = forms.studentCourse;
const LEARNING_GOAL_OPTIONS = toSelectOptions(courseLabels.learningGoals);

/**
 * The course fields shared by the create and edit forms. The language is
 * chosen only on create, so it comes in as a slot.
 */
export const StudentCourseFormFields = ({
  errors,
  languageField,
  register,
}: StudentCourseFormFieldsProps) => (
  <div className={studentCourseFormFieldsStyles.fields}>
    {languageField}

    <SelectField
      errorId={fieldIds.LearningGoalError}
      errorMessage={errors.learningGoal?.message}
      id={fieldIds.LearningGoal}
      label={TEXTS.COURSES.LEARNING_GOAL}
      optionalLabel={TEXTS.COURSES.OPTIONAL}
      options={LEARNING_GOAL_OPTIONS}
      placeholder={TEXTS.COURSES.NOT_SET}
      {...register(fields.LearningGoal)}
    />

    <div className={studentCourseFormFieldsStyles.wideField}>
      <TextareaField
        errorId={fieldIds.SpecialGoalError}
        errorMessage={errors.specialGoal?.message}
        id={fieldIds.SpecialGoal}
        label={TEXTS.COURSES.SPECIAL_GOAL}
        optionalLabel={TEXTS.COURSES.OPTIONAL}
        placeholder={TEXTS.COURSES.SPECIAL_GOAL_PLACEHOLDER}
        {...register(fields.SpecialGoal)}
      />
    </div>

    <StudentCourseLevelFields errors={errors} register={register} />

    <div className={studentCourseFormFieldsStyles.wideField}>
      <TextareaField
        errorId={fieldIds.CommentsError}
        errorMessage={errors.comments?.message}
        id={fieldIds.Comments}
        label={TEXTS.COURSES.COMMENTS}
        optionalLabel={TEXTS.COURSES.OPTIONAL}
        placeholder={TEXTS.COURSES.COMMENTS_PLACEHOLDER}
        {...register(fields.Comments)}
      />
    </div>
  </div>
);
