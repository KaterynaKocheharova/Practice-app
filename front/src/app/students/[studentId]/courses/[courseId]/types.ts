export interface StudentCoursePageProps {
  params: Promise<{
    courseId: string;
    studentId: string;
  }>;
}
