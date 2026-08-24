"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
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
import { getAccountSuspensionReason, getLoginErrorMessage } from "@/lib/auth/getLoginErrorMessage";
import { consumePasswordChangedToast } from "@/lib/auth/passwordChangedToast";
import { clearProfileCompleted } from "@/lib/auth/profileCompleted";
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
  const { mutateAsync: login, isPending } = useLoginMutation();
  const establishSession = useAuthStore((state) => state.establishSession);
  const setPostAuthRedirectPath = useAuthStore((state) => state.setPostAuthRedirectPath);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [suspensionReason, setSuspensionReason] = useState<string | null>(null);
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

    try {
      const role = audienceToLoginRole(audience);
      const result = await login({ ...values, role });

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
      setSubmitError(getLoginErrorMessage(error, audience));
    }
  });

  return (
    <div className="flex w-full flex-col items-center gap-40 md:gap-48">
      {toastMessage ? <Toast onClose={() => setToastMessage(null)}>{toastMessage}</Toast> : null}
      <AuthHeader audience={audience} />

      <div className="flex w-full flex-col items-center gap-48 md:gap-24">
        <form className="flex w-full flex-col gap-32 md:gap-56" onSubmit={onSubmit} noValidate>
          <div className="flex w-full flex-col gap-16 md:gap-32">
            <FormField label="이메일" labelFor="email" variant="auth">
              <Input
                id="email"
                size="md"
                type="email"
                autoComplete="email"
                placeholder="이메일을 입력해 주세요"
                error={errors.email?.message}
                {...register("email")}
              />
            </FormField>

            <FormField label="비밀번호" labelFor="password" variant="auth">
              <PasswordInput
                id="password"
                size="md"
                autoComplete="current-password"
                placeholder="비밀번호를 입력해 주세요"
                error={errors.password?.message}
                {...register("password")}
              />
            </FormField>
          </div>

          {suspensionReason ? (
            <AccountSuspensionNotice reason={suspensionReason} />
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
            로그인
          </Button>
        </form>

        <p className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
          <Text
            as="span"
            variant={{ base: "xs-regular", md: "xl-regular" }}
            className="text-text-description"
          >
            아직 무빙 회원이 아니신가요?
          </Text>
          <Link
            href={signUpHref}
            className={cn(
              getTextVariantClass({ base: "link-xs", md: "link-xl" }),
              "text-text-brand",
            )}
          >
            이메일로 회원가입하기
          </Link>
        </p>
      </div>

      <div className="flex flex-col items-center gap-24 md:gap-32">
        <Text
          as="p"
          variant={{ base: "xs-regular", md: "xl-regular" }}
          className="text-text-description"
        >
          SNS로 로그인
        </Text>
        <SocialLoginButtons
          audience={audience}
          intent="login"
          onError={(message) => {
            setSuspensionReason(null);
            setSubmitError(message);
          }}
        />
      </div>
    </div>
  );
};

export default LoginForm;
