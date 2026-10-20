"use client";

import { Plus, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/modules/common/components";
import { TEXTS } from "@/modules/common/constants";
import { TEACHERS_CONFIG } from "../../teachers.config";
import { CreateTeacherGoalForm } from "../create-teacher-goal-form/create-teacher-goal-form";
import { addTeacherGoalPanelStyles } from "./style";

const { fieldIds } = TEACHERS_CONFIG.forms.goal;

export const AddTeacherGoalPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const ToggleIcon = isOpen ? X : Plus;

  return (
    <div className={addTeacherGoalPanelStyles.root}>
      <Button
        aria-controls={fieldIds.AddPanel}
        aria-expanded={isOpen}
        className={addTeacherGoalPanelStyles.toggle}
        onClick={() => setIsOpen((wasOpen) => !wasOpen)}
        size="sm"
        variant="ghost"
      >
        <ToggleIcon aria-hidden className={addTeacherGoalPanelStyles.icon} />
        {isOpen ? TEXTS.GOALS.CANCEL : TEXTS.GOALS.ADD_GOAL}
      </Button>
      {isOpen && (
        <div id={fieldIds.AddPanel}>
          <CreateTeacherGoalForm onAdded={() => setIsOpen(false)} />
        </div>
      )}
    </div>
  );
};
