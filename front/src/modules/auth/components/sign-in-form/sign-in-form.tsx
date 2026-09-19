"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { AUTH_CONFIG } from "@/modules/auth/auth.config";
import { useSignIn } from "@/modules/auth/hooks";
import {
  Button,
  FormErrorMessage,
  Input,
  Label,
  PasswordField,
} from "@/modules/common/components";
import { APP_ROUTES, ERRORS, TEXTS } from "@/modules/common/constants";
import { AuthFooterLink } from "../auth-footer-link/auth-footer-link";
import { GoogleSignInOAuthButton } from "../google-oauth-button/google-sign-in-oauth-button";
import { signInSchema, type SignInFormValues } from "./schema";
import { signInFormStyles } from "./style";

export const SignInForm = () => {
  const { autoComplete, fieldIds, fields, inputTypes } =
    AUTH_CONFIG.forms.signIn;
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
    } catch {
      const message = ERRORS.AUTH.SIGN_IN_FAILED;
      setError(fields.root, { message });
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

        <FormErrorMessage message={errors[fields.root]?.message} />

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
