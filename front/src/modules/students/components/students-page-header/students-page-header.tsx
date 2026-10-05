import { studentsPageHeaderStyles } from "./style";
import type { StudentsPageHeaderProps } from "./types";

export const StudentsPageHeader = ({
  action,
  title,
}: StudentsPageHeaderProps) => (
  <div className={studentsPageHeaderStyles.root}>
    <h1 className={studentsPageHeaderStyles.title}>{title}</h1>
    {action}
  </div>
);
