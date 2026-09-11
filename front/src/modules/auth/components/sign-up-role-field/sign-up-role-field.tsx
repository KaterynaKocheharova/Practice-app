import { AUTH_CONFIG } from "@/modules/auth/auth.config";
import { FormErrorMessage } from "@/modules/common/components";
import { TEXTS } from "@/modules/common/constants";
import { signUpRoleFieldStyles } from "./style";
import type { SignUpRoleFieldProps } from "./types";

export const SignUpRoleField = ({
  errorId,
  errorMessage,
  inputProps,
}: SignUpRoleFieldProps) => (
  <fieldset
    aria-describedby={errorMessage ? errorId : undefined}
    className={signUpRoleFieldStyles.root}
  >
    <legend className={signUpRoleFieldStyles.legend}>{TEXTS.AUTH.ROLE}</legend>
    <div className={signUpRoleFieldStyles.options}>
      {AUTH_CONFIG.roleField.options.map(({ label, value }) => {
        const optionId = `${AUTH_CONFIG.roleField.fieldIds.role}-${value}`;

        return (
          <label className={signUpRoleFieldStyles.option} key={value}>
            <input
              className={signUpRoleFieldStyles.radio}
              id={optionId}
              type="radio"
              value={value}
              {...inputProps}
            />
            <span className={signUpRoleFieldStyles.optionLabel}>{label}</span>
          </label>
        );
      })}
    </div>
    <FormErrorMessage id={errorId} message={errorMessage} />
  </fieldset>
);
