import { Card } from "@/modules/common/components";
import { TEXTS } from "@/modules/common/constants";
import { getTeacherComments } from "../../utils";
import { CourseDocumentsSection } from "../course-documents-section/course-documents-section";
import { StudentCourseDetailsHeader } from "../student-course-details-header/student-course-details-header";
import { StudentCourseDetailsSection } from "../student-course-details-section/student-course-details-section";
import { StudentCourseLevelsList } from "../student-course-levels-list/student-course-levels-list";
import { StudentCourseTextSection } from "../student-course-text-section/student-course-text-section";
import { studentCourseDetailsCardStyles } from "./style";
import type { StudentCourseDetailsCardProps } from "./types";

export const StudentCourseDetailsCard = ({
  course,
  studentId,
}: StudentCourseDetailsCardProps) => (
  <Card className={studentCourseDetailsCardStyles.root}>
    <StudentCourseDetailsHeader
      language={course.language}
      learningGoals={course.learningGoals}
    />
    <StudentCourseTextSection
      text={course.specialGoal}
      title={TEXTS.COURSES.SPECIAL_GOAL}
    />
    <StudentCourseDetailsSection title={TEXTS.COURSES.LEVELS_TITLE}>
      <StudentCourseLevelsList levels={course} />
    </StudentCourseDetailsSection>
    <StudentCourseTextSection
      text={getTeacherComments(course)}
      title={TEXTS.COURSES.COMMENTS}
    />
    <CourseDocumentsSection
      course={{ courseId: course.id, studentId }}
      documents={course.documents}
    />
  </Card>
);
