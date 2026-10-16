import { FormErrorMessage } from "@/modules/common/components";
import { TEXTS } from "@/modules/common/constants";
import { ONBOARDING_CONFIG } from "../../onboarding.config";
import { onboardingRoleFieldStyles } from "./style";
import type { OnboardingRoleFieldProps } from "./types";

const { fieldIds } = ONBOARDING_CONFIG.form;

export const OnboardingRoleField = ({
  errorId,
  errorMessage,
  inputProps,
}: OnboardingRoleFieldProps) => (
  <fieldset
    aria-describedby={errorMessage ? errorId : undefined}
    className={onboardingRoleFieldStyles.root}
  >
    <legend className={onboardingRoleFieldStyles.legend}>
      {TEXTS.ONBOARDING.ROLE}
    </legend>
    <div className={onboardingRoleFieldStyles.options}>
      {ONBOARDING_CONFIG.roleOptions.map(({ label, value }) => (
        <label className={onboardingRoleFieldStyles.option} key={value}>
          <input
            className={onboardingRoleFieldStyles.radio}
            id={`${fieldIds.Role}-${value}`}
            type="radio"
            value={value}
            {...inputProps}
          />
          <span className={onboardingRoleFieldStyles.optionLabel}>{label}</span>
        </label>
      ))}
    </div>
    <FormErrorMessage id={errorId} message={errorMessage} />
  </fieldset>
);
