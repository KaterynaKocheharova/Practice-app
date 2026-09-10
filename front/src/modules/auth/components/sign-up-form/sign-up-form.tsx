"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { useSignUp } from "@/modules/auth/hooks";
import { UserRole } from "@/modules/auth/types";
import { ApiError } from "@/modules/common/api";
import {
  Button,
  FormErrorMessage,
  Input,
  Label,
  PasswordField,
} from "@/modules/common/components";
import { APP_ROUTES, ERRORS, TEXTS } from "@/modules/common/constants";
import { AuthFooterLink } from "../auth-footer-link/auth-footer-link";
import { GoogleSignUpOAuthButton } from "../google-oauth-button/google-sign-up-oauth-button";
import { SignUpRoleField } from "../sign-up-role-field/sign-up-role-field";
import {
  signUpFormAutoComplete,
  signUpFormFieldIds,
  signUpFormFields,
  signUpFormInputTypes,
} from "./constants";
import { signUpSchema, type SignUpFormValues } from "./schema";
import { signUpFormStyles } from "./style";

export const SignUpForm = () => {
  const { mutateAsync: signUp, isPending } = useSignUp();
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
    name: signUpFormFields.role,
  });

  const handleValidSubmit = async (values: SignUpFormValues) => {
    try {
      await signUp(values);
      toast.success(TEXTS.AUTH.VERIFICATION_EMAIL_SENT);
      reset({
        role: UserRole.Teacher,
      });
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : ERRORS.AUTH.SIGN_UP_FAILED;
      setError(signUpFormFields.root, { message });
      toast.error(message);
    }
  };

  return (
    <>
      <form
        className={signUpFormStyles.form}
        noValidate
        onSubmit={handleSubmit(handleValidSubmit)}
      >
        <div className={signUpFormStyles.field}>
          <Label htmlFor={signUpFormFieldIds.name}>{TEXTS.AUTH.FULL_NAME}</Label>
          <Input
            aria-describedby={
              errors.name ? signUpFormFieldIds.nameError : undefined
            }
            aria-invalid={Boolean(errors.name)}
            autoComplete={signUpFormAutoComplete.name}
            id={signUpFormFieldIds.name}
            placeholder={TEXTS.AUTH.FULL_NAME_PLACEHOLDER}
            type={signUpFormInputTypes.name}
            {...register(signUpFormFields.name)}
          />
          <FormErrorMessage
            id={signUpFormFieldIds.nameError}
            message={errors.name?.message}
          />
        </div>

        <div className={signUpFormStyles.field}>
          <Label htmlFor={signUpFormFieldIds.email}>{TEXTS.AUTH.EMAIL}</Label>
          <Input
            aria-describedby={
              errors.email ? signUpFormFieldIds.emailError : undefined
            }
            aria-invalid={Boolean(errors.email)}
            autoComplete={signUpFormAutoComplete.email}
            id={signUpFormFieldIds.email}
            placeholder={TEXTS.AUTH.EMAIL_PLACEHOLDER}
            type={signUpFormInputTypes.email}
            {...register(signUpFormFields.email)}
          />
          <FormErrorMessage
            id={signUpFormFieldIds.emailError}
            message={errors.email?.message}
          />
        </div>

        <PasswordField
          aria-describedby={
            errors.password ? signUpFormFieldIds.passwordError : undefined
          }
          aria-invalid={Boolean(errors.password)}
          autoComplete={signUpFormAutoComplete.password}
          errorId={signUpFormFieldIds.passwordError}
          errorMessage={errors.password?.message}
          id={signUpFormFieldIds.password}
          label={TEXTS.AUTH.PASSWORD}
          placeholder={TEXTS.AUTH.PASSWORD_PLACEHOLDER}
          {...register(signUpFormFields.password)}
        />

        <SignUpRoleField
          errorId={signUpFormFieldIds.roleError}
          errorMessage={errors.role?.message}
          inputProps={register(signUpFormFields.role)}
        />

        <FormErrorMessage message={errors[signUpFormFields.root]?.message} />

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
