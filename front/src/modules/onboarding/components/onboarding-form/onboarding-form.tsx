"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { UserRole } from "@/modules/auth/auth.enums";
import {
  Button,
  FormErrorMessage,
  TextField,
} from "@/modules/common/components";
import { APP_ROUTES, ERRORS, TEXTS } from "@/modules/common/constants";
import { useServerAction } from "@/modules/common/hooks";
import { StudentProfileFields } from "@/modules/students/components/student-profile-fields/student-profile-fields";
import { completeOnboardingAction } from "../../actions/onboarding-actions";
import { ONBOARDING_CONFIG } from "../../onboarding.config";
import { OnboardingErrorCode } from "../../onboarding.enums";
import {
  onboardingFormSchema,
  toOnboardingFormDefaultValues,
  type OnboardingFormValues,
} from "../../schemas";
import { toCompleteOnboardingRequest } from "../../utils";
import { OnboardingRoleField } from "../onboarding-role-field/onboarding-role-field";
import { onboardingFormStyles } from "./style";
import type { OnboardingFormProps } from "./types";

const { fieldIds, fields, inputTypes } = ONBOARDING_CONFIG.form;

export const OnboardingForm = ({ name }: OnboardingFormProps) => {
  const router = useRouter();
  const { isPending, run: completeOnboarding } = useServerAction(
    completeOnboardingAction,
  );
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    setError,
  } = useForm<OnboardingFormValues>({
    defaultValues: toOnboardingFormDefaultValues(name),
    resolver: zodResolver(onboardingFormSchema),
  });
  const role = useWatch({ control, name: fields.Role });

  const handleValidSubmit = async (values: OnboardingFormValues) => {
    const result = await completeOnboarding(toCompleteOnboardingRequest(values));

    if (result.ok || result.errorCode === OnboardingErrorCode.AlreadyCompleted) {
      router.replace(APP_ROUTES.ROOT);
      return;
    }

    setError(fields.Root, { message: ERRORS.ONBOARDING.COMPLETE_FAILED });
    toast.error(ERRORS.ONBOARDING.COMPLETE_FAILED);
  };

  return (
    <form
      className={onboardingFormStyles.form}
      noValidate
      onSubmit={handleSubmit(handleValidSubmit)}
    >
      <TextField
        errorId={fieldIds.NameError}
        errorMessage={errors.name?.message}
        id={fieldIds.Name}
        label={TEXTS.ONBOARDING.FULL_NAME}
        placeholder={TEXTS.ONBOARDING.FULL_NAME_PLACEHOLDER}
        required
        type={inputTypes.name}
        {...register(fields.Name)}
      />

      <OnboardingRoleField
        errorId={fieldIds.RoleError}
        errorMessage={errors.role?.message}
        inputProps={register(fields.Role)}
      />

      {role === UserRole.Student && (
        <section className={onboardingFormStyles.studentDetails}>
          <h2 className={onboardingFormStyles.studentDetailsTitle}>
            {TEXTS.ONBOARDING.STUDENT_DETAILS}
          </h2>
          <StudentProfileFields
            errorMessages={{
              birthDate: errors.birthDate?.message,
              hobbies: errors.hobbies?.message,
              job: errors.job?.message,
            }}
            inputProps={{
              birthDate: register(fields.BirthDate),
              hobbies: register(fields.Hobbies),
              job: register(fields.Job),
            }}
          />
        </section>
      )}

      <FormErrorMessage message={errors[fields.Root]?.message} />

      <Button
        className={onboardingFormStyles.submit}
        disabled={isPending}
        type="submit"
      >
        {isPending ? TEXTS.ONBOARDING.COMPLETING : TEXTS.ONBOARDING.COMPLETE}
      </Button>
    </form>
  );
};
