import type { UserRole } from "@/modules/auth/auth.enums";
import type { GetStudentCoursesRequest } from "../../types";

export interface StudentCoursesListProps extends GetStudentCoursesRequest {
  viewerRole: UserRole;
}
