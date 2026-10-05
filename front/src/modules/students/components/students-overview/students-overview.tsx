import { Plus } from "lucide-react";
import { ButtonLink } from "@/modules/common/components";
import { APP_ROUTES, TEXTS } from "@/modules/common/constants";
import { StudentsList } from "../students-list/students-list";
import { StudentsPageHeader } from "../students-page-header/students-page-header";
import { studentsOverviewStyles } from "./style";

export const StudentsOverview = () => (
  <div className={studentsOverviewStyles.root}>
    <StudentsPageHeader
      action={
        <ButtonLink href={APP_ROUTES.STUDENTS_NEW}>
          <Plus aria-hidden="true" className={studentsOverviewStyles.addIcon} />
          {TEXTS.STUDENTS.ADD_STUDENT}
        </ButtonLink>
      }
      title={TEXTS.STUDENTS.TITLE}
    />
    <StudentsList />
  </div>
);
