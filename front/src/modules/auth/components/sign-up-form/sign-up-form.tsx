"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { AUTH_CONFIG } from "@/modules/auth/auth.config";
import { AuthErrorCode, UserRole } from "@/modules/auth/auth.enums";
import { signUpAction } from "@/modules/auth/actions/auth-actions";
import {
  Button,
  FormErrorMessage,
  Input,
  Label,
  PasswordField,
} from "@/modules/common/components";
import { APP_ROUTES, ERRORS, TEXTS } from "@/modules/common/constants";
import { useServerAction } from "@/modules/common/hooks";
import { AuthFooterLink } from "../auth-footer-link/auth-footer-link";
import { GoogleSignUpOAuthButton } from "../google-oauth-button/google-sign-up-oauth-button";
import { SignUpRoleField } from "../sign-up-role-field/sign-up-role-field";
import { signUpSchema, type SignUpFormValues } from "./schema";
import { signUpFormStyles } from "./style";
import type { SignUpFormProps } from "./types";

export const SignUpForm = ({ googleOAuthUrl }: SignUpFormProps) => {
  const { autoComplete, fieldIds, fields, inputTypes } =
    AUTH_CONFIG.forms.signUp;
  const { isPending, run: signUp } = useServerAction(signUpAction);
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    reset,
    setError,
  } = useForm<SignUpFormValues>({
    defaultValues: {
      role: UserRole.Teacher,
    },
    resolver: zodResolver(signUpSchema),
  });
  const selectedRole = useWatch({
    control,
    name: fields.role,
  });

  const handleValidSubmit = async (values: SignUpFormValues) => {
    const result = await signUp(values);

    if (!result.ok) {
      const message =
        result.errorCode === AuthErrorCode.EmailAlreadyExists
          ? ERRORS.AUTH.EMAIL_ALREADY_EXISTS
          : ERRORS.AUTH.SIGN_UP_FAILED;
      setError(fields.root, { message });
      toast.error(message);
      return;
    }

    toast.success(TEXTS.AUTH.VERIFICATION_EMAIL_SENT);
    reset({
      role: UserRole.Teacher,
    });
  };

  return (
    <>
      <form
        className={signUpFormStyles.form}
        noValidate
        onSubmit={handleSubmit(handleValidSubmit)}
      >
        <div className={signUpFormStyles.field}>
          <Label htmlFor={fieldIds.name}>{TEXTS.AUTH.FULL_NAME}</Label>
          <Input
            aria-describedby={errors.name ? fieldIds.nameError : undefined}
            aria-invalid={Boolean(errors.name)}
            autoComplete={autoComplete.name}
            id={fieldIds.name}
            placeholder={TEXTS.AUTH.FULL_NAME_PLACEHOLDER}
            type={inputTypes.name}
            {...register(fields.name)}
          />
          <FormErrorMessage
            id={fieldIds.nameError}
            message={errors.name?.message}
          />
        </div>

        <div className={signUpFormStyles.field}>
          <Label htmlFor={fieldIds.email}>{TEXTS.AUTH.EMAIL}</Label>
          <Input
            aria-describedby={errors.email ? fieldIds.emailError : undefined}
            aria-invalid={Boolean(errors.email)}
            autoComplete={autoComplete.email}
            id={fieldIds.email}
            placeholder={TEXTS.AUTH.EMAIL_PLACEHOLDER}
            type={inputTypes.email}
            {...register(fields.email)}
          />
          <FormErrorMessage
            id={fieldIds.emailError}
            message={errors.email?.message}
          />
        </div>

        <PasswordField
          aria-describedby={errors.password ? fieldIds.passwordError : undefined}
          aria-invalid={Boolean(errors.password)}
          autoComplete={autoComplete.password}
          errorId={fieldIds.passwordError}
          errorMessage={errors.password?.message}
          id={fieldIds.password}
          label={TEXTS.AUTH.PASSWORD}
          placeholder={TEXTS.AUTH.PASSWORD_PLACEHOLDER}
          {...register(fields.password)}
        />

        <SignUpRoleField
          errorId={fieldIds.roleError}
          errorMessage={errors.role?.message}
          inputProps={register(fields.role)}
        />

        <FormErrorMessage message={errors[fields.root]?.message} />

        <Button
          className={signUpFormStyles.submit}
          disabled={isPending}
          type="submit"
        >
          {isPending
            ? TEXTS.AUTH.REQUEST_VERIFICATION_LINK
            : TEXTS.AUTH.CREATE_ACCOUNT}
        </Button>
      </form>

      <div className={signUpFormStyles.oauth}>
        <GoogleSignUpOAuthButton
          disabled={isPending}
          oauthUrl={googleOAuthUrl}
          role={selectedRole ?? UserRole.Teacher}
        />
      </div>

      <AuthFooterLink
        href={APP_ROUTES.SIGN_IN}
        label={TEXTS.AUTH.SIGN_IN}
        prompt={TEXTS.AUTH.SIGN_IN_PROMPT}
      />
    </>
  );
};
