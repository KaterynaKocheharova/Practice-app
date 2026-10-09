"use client";

import { Plus, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/modules/common/components";
import { TEXTS } from "@/modules/common/constants";
import { STUDENTS_CONFIG } from "../../students.config";
import { AddCourseLinkForm } from "../add-course-link-form/add-course-link-form";
import { UploadCourseDocumentForm } from "../upload-course-document-form/upload-course-document-form";
import { addCourseDocumentPanelStyles } from "./style";
import type { AddCourseDocumentPanelProps } from "./types";

const { fieldIds } = STUDENTS_CONFIG.forms.courseDocument;
const { DOCUMENTS } = TEXTS.COURSES;

/** The add forms stay hidden until the user asks for them; a successful add closes them. */
export const AddCourseDocumentPanel = ({
  course,
}: AddCourseDocumentPanelProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const close = () => setIsOpen(false);
  const ToggleIcon = isOpen ? X : Plus;

  return (
    <div className={addCourseDocumentPanelStyles.root}>
      <Button
        aria-controls={fieldIds.AddPanel}
        aria-expanded={isOpen}
        className={addCourseDocumentPanelStyles.toggle}
        onClick={() => setIsOpen((wasOpen) => !wasOpen)}
        size="sm"
        variant="ghost"
      >
        <ToggleIcon aria-hidden className={addCourseDocumentPanelStyles.icon} />
        {isOpen ? DOCUMENTS.CANCEL_ADD : DOCUMENTS.ADD_DOCUMENT}
      </Button>
      {isOpen && (
        <div
          className={addCourseDocumentPanelStyles.forms}
          id={fieldIds.AddPanel}
        >
          <UploadCourseDocumentForm course={course} onAdded={close} />
          <AddCourseLinkForm course={course} onAdded={close} />
        </div>
      )}
    </div>
  );
};
