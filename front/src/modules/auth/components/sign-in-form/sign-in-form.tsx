"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useSignIn } from "@/modules/auth/hooks";
import {
  Button,
  FormErrorMessage,
  Input,
  Label,
  PasswordField,
} from "@/modules/common/components";
import { APP_ROUTES, ERRORS, TEXTS } from "@/modules/common/constants";
import { ApiError } from "@/modules/common/api";
import { AuthFooterLink } from "../auth-footer-link/auth-footer-link";
import { GoogleSignInOAuthButton } from "../google-oauth-button/google-sign-in-oauth-button";
import {
  signInFormAutoComplete,
  signInFormFieldIds,
  signInFormFields,
  signInFormInputTypes,
} from "./constants";
import { signInSchema, type SignInFormValues } from "./schema";
import { signInFormStyles } from "./style";

export const SignInForm = () => {
  const { mutateAsync: signin, isPending } = useSignIn();
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
    setError,
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
  });

  const handleValidSubmit = async (values: SignInFormValues) => {
    try {
      await signin(values);
      toast.success(TEXTS.AUTH.VERIFICATION_EMAIL_SENT);
      reset();
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : ERRORS.AUTH.SIGN_IN_FAILED;
      setError(signInFormFields.root, { message });
      toast.error(message);
    }
  };

  return (
    <>
      <form
        className={signInFormStyles.form}
        noValidate
        onSubmit={handleSubmit(handleValidSubmit)}
      >
        <div className={signInFormStyles.field}>
          <Label htmlFor={signInFormFieldIds.email}>{TEXTS.AUTH.EMAIL}</Label>
          <Input
            aria-describedby={
              errors.email ? signInFormFieldIds.emailError : undefined
            }
            aria-invalid={Boolean(errors.email)}
            autoComplete={signInFormAutoComplete.email}
            id={signInFormFieldIds.email}
            placeholder={TEXTS.AUTH.EMAIL_PLACEHOLDER}
            type={signInFormInputTypes.email}
            {...register(signInFormFields.email)}
          />
          <FormErrorMessage
            id={signInFormFieldIds.emailError}
            message={errors.email?.message}
          />
        </div>

        <PasswordField
          aria-describedby={
            errors.password ? signInFormFieldIds.passwordError : undefined
          }
          aria-invalid={Boolean(errors.password)}
          autoComplete={signInFormAutoComplete.password}
          errorId={signInFormFieldIds.passwordError}
          errorMessage={errors.password?.message}
          id={signInFormFieldIds.password}
          label={TEXTS.AUTH.PASSWORD}
          placeholder={TEXTS.AUTH.PASSWORD_PLACEHOLDER}
          {...register(signInFormFields.password)}
        />

        <FormErrorMessage message={errors[signInFormFields.root]?.message} />

        <Button
          className={signInFormStyles.submit}
          disabled={isPending}
          type="submit"
        >
          {isPending ? TEXTS.AUTH.REQUEST_VERIFICATION_LINK : TEXTS.AUTH.SIGN_IN}
        </Button>
      </form>

      <div className={signInFormStyles.oauth}>
        <GoogleSignInOAuthButton disabled={isPending} />
      </div>

      <AuthFooterLink
        href={APP_ROUTES.SIGN_UP}
        label={TEXTS.AUTH.SIGN_UP}
        prompt={TEXTS.AUTH.SIGN_UP_PROMPT}
      />
    </>
  );
};
