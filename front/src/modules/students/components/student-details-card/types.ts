import type { ReactNode } from "react";
import type { StudentDetails } from "../../types";

export interface StudentDetailsCardProps {
  action?: ReactNode;
  student: StudentDetails;
}
