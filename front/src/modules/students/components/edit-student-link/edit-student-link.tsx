import { Pencil } from "lucide-react";
import { ButtonLink } from "@/modules/common/components";
import { editStudentLinkStyles } from "./style";
import type { EditStudentLinkProps } from "./types";

/** Entry point to the student and course edit pages. */
export const EditStudentLink = ({ href, label }: EditStudentLinkProps) => (
  <ButtonLink href={href} variant="secondary">
    <Pencil aria-hidden="true" className={editStudentLinkStyles.icon} />
    {label}
  </ButtonLink>
);
