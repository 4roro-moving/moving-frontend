"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useEffect, useId, useState } from "react";

import AuthHeader from "@/components/auth/AuthHeader";
import SignUpTermsField from "@/components/auth/SignUpTermsField";
import SocialLoginButtons from "@/components/auth/SocialLoginButtons";
import { Text, getTextVariantClass } from "@/components/common/Text";
import Toast from "@/components/common/Toast/Toast";
import { useSignUpTerms } from "@/hooks/auth/useSignUpTerms";
import { consumeOAuthNeedSignUpToast } from "@/lib/auth/oauthNeedSignUpToast";
import type { AuthAudience } from "@/lib/auth/redirect";
import { APP_ROUTES } from "@/lib/constants/appRoutes";
import { cn } from "@/lib/utils/cn";

interface SocialSignUpFormProps {
  audience?: AuthAudience;
}

const SocialSignUpForm = ({ audience = "customer" }: SocialSignUpFormProps) => {
  const t = useTranslations("auth");
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
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const termsHintId = useId();
  const requiredTermsAgreeMessage = t("termsRequiredAgreement");
  const termsHint = isTermsError
    ? t("socialTermsUnavailable")
    : !isTermsLoading && !canAgree
      ? t("socialTermsRequiredHint")
      : null;

  const loginHref = audience === "mover" ? APP_ROUTES.MOVER_LOGIN : APP_ROUTES.LOGIN;
  const localSignUpHref = audience === "mover" ? APP_ROUTES.MOVER_SIGN_UP : APP_ROUTES.SIGN_UP;

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      const reason = consumeOAuthNeedSignUpToast();
      if (reason === "need-signup") {
        setToastMessage(t("oauthNeedSignUpToast"));
      } else if (reason === "terms-required") {
        setToastMessage(t("oauthTermsRequiredToast"));
      }
    }, 0);
    return () => {
      window.clearTimeout(timerId);
    };
  }, [t]);

  const visibleSubmitError =
    canAgree && submitError === requiredTermsAgreeMessage ? null : submitError;

  return (
    <div className="flex w-full flex-col items-center gap-40 md:gap-48">
      {toastMessage ? <Toast onClose={() => setToastMessage(null)}>{toastMessage}</Toast> : null}
      <AuthHeader audience={audience} mode="social-signup" />

      <div className="flex w-full flex-col items-center gap-48 md:gap-24">
        <div className="flex w-full flex-col gap-32 md:gap-56">
          <SignUpTermsField
            terms={signUpTerms}
            checkedById={agreementsById}
            onCheckedChange={handleTermsCheckedChange}
            isLoading={isTermsLoading}
          />

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

          {visibleSubmitError ? (
            <Text as="p" variant="md-medium" className="text-text-error" role="alert">
              {visibleSubmitError}
            </Text>
          ) : null}
        </div>

        <div className="flex flex-col items-center gap-8">
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
          <p className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
            <Text
              as="span"
              variant={{ base: "xs-regular", md: "xl-regular" }}
              className="text-text-description"
            >
              {t("preferEmailSignUp")}
            </Text>
            <Link
              href={localSignUpHref}
              className={cn(
                getTextVariantClass({ base: "link-xs", md: "link-xl" }),
                "text-text-brand",
              )}
            >
              {t("signUpWithEmail")}
            </Link>
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-24 md:gap-32">
        <Text
          as="p"
          variant={{ base: "xs-regular", md: "xl-regular" }}
          className="text-text-description"
        >
          {t("socialSignUp")}
        </Text>
        {termsHint ? (
          <p id={termsHintId} className="sr-only">
            {termsHint}
          </p>
        ) : null}
        <SocialLoginButtons
          audience={audience}
          intent="signup"
          disabled={!canAgree}
          disabledMessage={!canAgree && hasRequiredTerms ? requiredTermsAgreeMessage : undefined}
          describedBy={termsHint ? termsHintId : undefined}
          agreements={agreements}
          onError={setSubmitError}
        />
      </div>
    </div>
  );
};

export default SocialSignUpForm;
