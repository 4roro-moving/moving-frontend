"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import AuthHeader from "@/components/auth/AuthHeader";
import SignUpTermsField from "@/components/auth/SignUpTermsField";
import SocialLoginButtons from "@/components/auth/SocialLoginButtons";
import Button from "@/components/common/Button/Button";
import FormField from "@/components/common/FormField/FormField";
import Input from "@/components/common/Input/Input";
import PasswordInput from "@/components/common/Input/PasswordInput";
import { Text, getTextVariantClass } from "@/components/common/Text";
import { useSignUpMoverMutation } from "@/hooks/auth/useSignUpMoverMutation";
import { useSignUpMutation } from "@/hooks/auth/useSignUpMutation";
import { useSignUpTerms } from "@/hooks/auth/useSignUpTerms";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { getProfilePath, getSocialSignUpPath, type AuthAudience } from "@/lib/auth/redirect";
import { hasRequiredTermsAgreed } from "@/lib/auth/termsAgreement";
import { APP_ROUTES } from "@/lib/constants/appRoutes";
import { createSignUpSchema, type SignUpFormValues } from "@/lib/schemas/signUpSchema";
import { cn } from "@/lib/utils/cn";
import { useAuthStore } from "@/stores/useAuthStore";

interface SignUpFormProps {
  audience?: AuthAudience;
}

const SignUpForm = ({ audience = "customer" }: SignUpFormProps) => {
  const t = useTranslations("auth");
  const schema = useMemo(
    () =>
      createSignUpSchema({
        nameRequired: t("validation.nameRequired"),
        nameMaxLength: t("validation.nameMaxLength"),
        emailRequired: t("validation.emailRequired"),
        emailInvalid: t("validation.emailInvalid"),
        phoneRequired: t("validation.phoneRequired"),
        phoneInvalid: t("validation.phoneInvalid"),
        passwordRequired: t("validation.passwordRequired"),
        passwordMinLength: t("validation.passwordMinLength"),
        passwordConfirmRequired: t("validation.passwordConfirmRequired"),
        passwordMismatch: t("validation.passwordMismatch"),
      }),
    [t],
  );

  const customerSignUp = useSignUpMutation();
  const moverSignUp = useSignUpMoverMutation();
  const { mutateAsync: signUp, isPending } = audience === "mover" ? moverSignUp : customerSignUp;
  const setPostAuthRedirectPath = useAuthStore((state) => state.setPostAuthRedirectPath);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    signUpTerms,
    agreementsById,
    agreements,
    canAgree,
    hasRequiredTerms,
    isTermsLoading,
    isTermsError,
    handleTermsCheckedChange,
  } = useSignUpTerms(audience);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      passwordConfirm: "",
    },
  });

  const loginHref = audience === "mover" ? APP_ROUTES.MOVER_LOGIN : APP_ROUTES.LOGIN;

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null);

    if (!hasRequiredTerms) {
      setSubmitError(t("termsRequiredLoadFailed"));
      return;
    }

    if (!hasRequiredTermsAgreed(signUpTerms, agreementsById)) {
      setSubmitError(t("termsRequiredAgreement"));
      return;
    }

    try {
      setPostAuthRedirectPath(getProfilePath(audience));
      await signUp({
        email: values.email,
        password: values.password,
        name: values.name,
        phone: values.phone,
        agreements,
      });
    } catch (error) {
      useAuthStore.getState().consumePostAuthRedirectPath();
      setSubmitError(getApiErrorMessage(error));
    }
  });

  return (
    <div className="flex w-full flex-col items-center gap-40 md:gap-48">
      <AuthHeader audience={audience} mode="signup" />

      <div className="flex w-full flex-col items-center gap-48 md:gap-24">
        <form className="flex w-full flex-col gap-32 md:gap-56" onSubmit={onSubmit} noValidate>
          <div className="flex w-full flex-col gap-16 md:gap-32">
            <FormField label={t("name")} labelFor="name" variant="auth">
              <Input
                id="name"
                size="md"
                type="text"
                autoComplete="name"
                placeholder={t("namePlaceholder")}
                error={errors.name?.message}
                maxLength={50}
                {...register("name")}
              />
            </FormField>

            <FormField label={t("email")} labelFor="email" variant="auth">
              <Input
                id="email"
                size="md"
                type="email"
                autoComplete="email"
                placeholder={t("emailPlaceholder")}
                error={errors.email?.message}
                {...register("email")}
              />
            </FormField>

            <FormField label={t("phone")} labelFor="phone" variant="auth">
              <Input
                id="phone"
                size="md"
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                placeholder={t("phonePlaceholder")}
                numericOnly
                stripLeadingZeros={false}
                error={errors.phone?.message}
                {...register("phone")}
              />
            </FormField>

            <FormField label={t("password")} labelFor="password" variant="auth">
              <PasswordInput
                id="password"
                size="md"
                autoComplete="new-password"
                placeholder={t("passwordPlaceholder")}
                error={errors.password?.message}
                {...register("password")}
              />
            </FormField>

            <FormField label={t("passwordConfirm")} labelFor="passwordConfirm" variant="auth">
              <PasswordInput
                id="passwordConfirm"
                size="md"
                autoComplete="new-password"
                placeholder={t("passwordConfirmPlaceholder")}
                error={errors.passwordConfirm?.message}
                {...register("passwordConfirm")}
              />
            </FormField>

            <SignUpTermsField
              terms={signUpTerms}
              checkedById={agreementsById}
              onCheckedChange={handleTermsCheckedChange}
              isLoading={isTermsLoading}
            />
          </div>

          {isTermsError ? (
            <Text as="p" variant="md-medium" className="text-text-error" role="alert">
              {t("termsLoadFailed")}
            </Text>
          ) : null}

          {!isTermsLoading && !isTermsError && !hasRequiredTerms ? (
            <Text as="p" variant="md-medium" className="text-text-error" role="alert">
              {t("termsRequiredLoadFailed")}
            </Text>
          ) : null}

          {submitError ? (
            <Text as="p" variant="md-medium" className="text-text-error" role="alert">
              {submitError}
            </Text>
          ) : null}

          <Button
            type="submit"
            variant="solid"
            size="auth"
            fullWidth
            disabled={!isValid || !canAgree || isSubmitting || isPending}
          >
            {t("start")}
          </Button>
        </form>

        <p className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
          <Text
            as="span"
            variant={{ base: "xs-regular", md: "xl-regular" }}
            className="text-text-description"
          >
            {t("alreadyMember")}
          </Text>
          <Link
            href={loginHref}
            className={cn(
              getTextVariantClass({ base: "link-xs", md: "link-xl" }),
              "text-text-brand",
            )}
          >
            {t("login")}
          </Link>
        </p>
      </div>

      <div className="flex flex-col items-center gap-24 md:gap-32">
        <div className="flex flex-col items-center gap-8">
          <Text
            as="p"
            variant={{ base: "xs-regular", md: "xl-regular" }}
            className="text-text-description"
          >
            {t("socialSignUp")}
          </Text>
          <Text
            as="p"
            variant={{ base: "xs-regular", md: "md-regular" }}
            className="text-text-description text-center"
          >
            {t("socialSignUpTermsHint")}
          </Text>
        </div>
        <SocialLoginButtons
          audience={audience}
          hrefForProvider={() => getSocialSignUpPath(audience)}
        />
      </div>
    </div>
  );
};

export default SignUpForm;
