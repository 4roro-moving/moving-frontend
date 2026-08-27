"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import AccountSuspensionNotice from "@/components/auth/AccountSuspensionNotice";
import AuthHeader from "@/components/auth/AuthHeader";
import SocialLoginButtons from "@/components/auth/SocialLoginButtons";
import Button from "@/components/common/Button/Button";
import FormField from "@/components/common/FormField/FormField";
import Input from "@/components/common/Input/Input";
import PasswordInput from "@/components/common/Input/PasswordInput";
import { Text, getTextVariantClass } from "@/components/common/Text";
import Toast from "@/components/common/Toast/Toast";
import { useLoginMutation } from "@/hooks/auth/useLoginMutation";
import { resolveAuthUserImage } from "@/lib/api/profile";
import {
  getAccountSuspensionReason,
  getLoginErrorMessage,
  isAccountSuspended,
  isSuspensionAppealAvailable,
} from "@/lib/auth/getLoginErrorMessage";
import { consumePasswordChangedToast } from "@/lib/auth/passwordChangedToast";
import { clearProfileCompleted } from "@/lib/auth/profileCompleted";
import {
  clearSuspensionAppealSession,
  markSuspensionAppealSession,
} from "@/lib/auth/suspensionAppealSession";
import {
  audienceToLoginRole,
  getLoginRedirectParam,
  getPostAuthRedirectPath,
  getRoleHomePath,
  type AuthAudience,
} from "@/lib/auth/redirect";
import { APP_ROUTES } from "@/lib/constants/appRoutes";
import { loginSchema, type LoginFormValues } from "@/lib/schemas/loginSchema";
import { cn } from "@/lib/utils/cn";
import { useAuthStore } from "@/stores/useAuthStore";

interface LoginFormProps {
  audience?: AuthAudience;
}

const LoginForm = ({ audience = "customer" }: LoginFormProps) => {
  const t = useTranslations("auth");
  const loginErrorCopy = {
    roleMismatchCustomer: t("roleMismatchCustomer"),
    roleMismatchMover: t("roleMismatchMover"),
    accountSuspended: t("accountSuspended"),
    suspensionReasonPrefix: t("suspensionReasonLabel"),
    fallback: t("requestFailed"),
  };
  const router = useRouter();
  const { mutateAsync: login, isPending } = useLoginMutation();
  const establishSession = useAuthStore((state) => state.establishSession);
  const setPostAuthRedirectPath = useAuthStore((state) => state.setPostAuthRedirectPath);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [suspensionReason, setSuspensionReason] = useState<string | null>(null);
  const [isSuspended, setIsSuspended] = useState(false);
  const [isAppealAvailable, setIsAppealAvailable] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    // setState는 effect 본문 동기 호출이 아니라 콜백으로 미룸 (react-hooks/set-state-in-effect)
    const timerId = window.setTimeout(() => {
      setToastMessage(consumePasswordChangedToast());
    }, 0);
    return () => {
      window.clearTimeout(timerId);
    };
  }, []);

  const signUpHref = audience === "mover" ? APP_ROUTES.MOVER_SIGN_UP : APP_ROUTES.SIGN_UP;

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null);
    setSuspensionReason(null);
    setIsSuspended(false);
    setIsAppealAvailable(false);

    try {
      const role = audienceToLoginRole(audience);
      const result = await login({ ...values, role });

      clearSuspensionAppealSession();
      // 이전 계정 Soft UX 힌트 제거 후 status로 다시 저장
      clearProfileCompleted();

      const nextPath = await getPostAuthRedirectPath({
        audience,
        returnPath: getLoginRedirectParam(),
        fallbackPath: getRoleHomePath(result.user.role),
      });

      setPostAuthRedirectPath(nextPath);
      establishSession(await resolveAuthUserImage(result.user));
    } catch (error) {
      setSuspensionReason(getAccountSuspensionReason(error) ?? null);
      setIsSuspended(isAccountSuspended(error));
      setIsAppealAvailable(isSuspensionAppealAvailable(error));
      setSubmitError(getLoginErrorMessage(error, audience, loginErrorCopy));
    }
  });

  return (
    <div className="flex w-full flex-col items-center gap-40 md:gap-48">
      {toastMessage ? <Toast onClose={() => setToastMessage(null)}>{toastMessage}</Toast> : null}
      <AuthHeader audience={audience} />

      <div className="flex w-full flex-col items-center gap-48 md:gap-24">
        <form className="flex w-full flex-col gap-32 md:gap-56" onSubmit={onSubmit} noValidate>
          <div className="flex w-full flex-col gap-16 md:gap-32">
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

            <FormField label={t("password")} labelFor="password" variant="auth">
              <PasswordInput
                id="password"
                size="md"
                autoComplete="current-password"
                placeholder={t("passwordPlaceholder")}
                error={errors.password?.message}
                {...register("password")}
              />
            </FormField>
          </div>

          {isSuspended ? (
            <AccountSuspensionNotice
              reason={suspensionReason ?? t("suspensionReasonUnavailable")}
              onAppealClick={
                isAppealAvailable
                  ? () => {
                      markSuspensionAppealSession();
                      router.push(APP_ROUTES.INQUIRIES.ROOT);
                    }
                  : undefined
              }
            />
          ) : submitError ? (
            <Text as="p" variant="md-medium" className="text-text-error" role="alert">
              {submitError}
            </Text>
          ) : null}

          <Button
            type="submit"
            variant="solid"
            size="auth"
            fullWidth
            disabled={!isValid || isSubmitting || isPending}
          >
            {t("login")}
          </Button>
        </form>

        <p className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
          <Text
            as="span"
            variant={{ base: "xs-regular", md: "xl-regular" }}
            className="text-text-description"
          >
            {t("notMember")}
          </Text>
          <Link
            href={signUpHref}
            className={cn(
              getTextVariantClass({ base: "link-xs", md: "link-xl" }),
              "text-text-brand",
            )}
          >
            {t("signUpWithEmail")}
          </Link>
        </p>
      </div>

      <div className="flex flex-col items-center gap-24 md:gap-32">
        <Text
          as="p"
          variant={{ base: "xs-regular", md: "xl-regular" }}
          className="text-text-description"
        >
          {t("socialLogin")}
        </Text>
        <SocialLoginButtons
          audience={audience}
          intent="login"
          onError={(error) => {
            if (typeof error === "string") {
              setSuspensionReason(null);
              setIsAppealAvailable(false);
              setSubmitError(error);
              return;
            }

            setSuspensionReason(getAccountSuspensionReason(error) ?? null);
            setIsAppealAvailable(isSuspensionAppealAvailable(error));
            setSubmitError(getLoginErrorMessage(error, audience, loginErrorCopy));
          }}
        />
      </div>
    </div>
  );
};

export default LoginForm;
