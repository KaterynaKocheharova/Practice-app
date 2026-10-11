import { Plus } from "lucide-react";
import { ButtonLink } from "@/modules/common/components";
import { APP_ROUTES, TEXTS } from "@/modules/common/constants";
import { getStudentsPageServer } from "../../api";
import { STUDENTS_CONFIG } from "../../students.config";
import { StudentsList } from "../students-list/students-list";
import { StudentsListError } from "../students-list-error/students-list-error";
import { StudentsPageHeader } from "../students-page-header/students-page-header";
import { studentsOverviewStyles } from "./style";

export const StudentsOverview = async () => {
  const firstPage = await getStudentsPageServer({
    limit: STUDENTS_CONFIG.pagination.pageSize,
    offset: 0,
  });

  return (
    <div className={studentsOverviewStyles.root}>
      <StudentsPageHeader
        action={
          <ButtonLink href={APP_ROUTES.STUDENTS_NEW}>
            <Plus
              aria-hidden="true"
              className={studentsOverviewStyles.addIcon}
            />
            {TEXTS.STUDENTS.ADD_STUDENT}
          </ButtonLink>
        }
        title={TEXTS.STUDENTS.TITLE}
      />
      {firstPage.ok ? (
        <StudentsList firstPage={firstPage.data} />
      ) : (
        <StudentsListError />
      )}
    </div>
  );
};
