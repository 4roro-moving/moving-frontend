"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";

import AuthHeader from "@/components/auth/AuthHeader";
import SignUpTermsField from "@/components/auth/SignUpTermsField";
import SocialLoginButtons from "@/components/auth/SocialLoginButtons";
import { Text, getTextVariantClass } from "@/components/common/Text";
import Toast from "@/components/common/Toast/Toast";
import { useSignUpTerms } from "@/hooks/auth/useSignUpTerms";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { consumeOAuthNeedSignUpToast } from "@/lib/auth/oauthNeedSignUpToast";
import type { AuthAudience } from "@/lib/auth/redirect";
import { APP_ROUTES } from "@/lib/constants/appRoutes";
import { cn } from "@/lib/utils/cn";

interface SocialSignUpFormProps {
  audience?: AuthAudience;
}

const REQUIRED_TERMS_AGREE_MESSAGE = "필수 약관에 동의해 주세요.";

const SocialSignUpForm = ({ audience = "customer" }: SocialSignUpFormProps) => {
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
  const termsHint = isTermsError
    ? "약관을 불러오지 못해 소셜 가입을 진행할 수 없습니다."
    : !isTermsLoading && !canAgree
      ? "필수 약관에 동의한 뒤 가입할 수 있습니다."
      : null;

  const loginHref = audience === "mover" ? APP_ROUTES.MOVER_LOGIN : APP_ROUTES.LOGIN;
  const localSignUpHref = audience === "mover" ? APP_ROUTES.MOVER_SIGN_UP : APP_ROUTES.SIGN_UP;

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      setToastMessage(consumeOAuthNeedSignUpToast());
    }, 0);
    return () => {
      window.clearTimeout(timerId);
    };
  }, []);

  const visibleSubmitError =
    canAgree && submitError === REQUIRED_TERMS_AGREE_MESSAGE ? null : submitError;

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
              약관을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
            </Text>
          ) : null}

          {!isTermsLoading && !isTermsError && !hasRequiredTerms ? (
            <Text as="p" variant="md-medium" className="text-text-error" role="alert">
              가입에 필요한 약관을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
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
              이미 무빙 회원이신가요?
            </Text>
            <Link
              href={loginHref}
              className={cn(
                getTextVariantClass({ base: "link-xs", md: "link-xl" }),
                "text-text-brand",
              )}
            >
              로그인
            </Link>
          </p>
          <p className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
            <Text
              as="span"
              variant={{ base: "xs-regular", md: "xl-regular" }}
              className="text-text-description"
            >
              이메일로 가입하시겠어요?
            </Text>
            <Link
              href={localSignUpHref}
              className={cn(
                getTextVariantClass({ base: "link-xs", md: "link-xl" }),
                "text-text-brand",
              )}
            >
              이메일로 회원가입하기
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
          SNS 계정으로 간편 가입하기
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
          disabledMessage={!canAgree && hasRequiredTerms ? REQUIRED_TERMS_AGREE_MESSAGE : undefined}
          describedBy={termsHint ? termsHintId : undefined}
          agreements={agreements}
          onError={(error) => {
            setSubmitError(typeof error === "string" ? error : getApiErrorMessage(error));
          }}
        />
      </div>
    </div>
  );
};

export default SocialSignUpForm;
