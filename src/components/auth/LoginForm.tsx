"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import SocialLoginButtons from "@/components/auth/SocialLoginButtons";
import Button from "@/components/common/Button/Button";
import Input from "@/components/common/Input/Input";
import PasswordInput from "@/components/common/Input/PasswordInput";
import { Text, getTextVariantClass } from "@/components/common/Text";
import { useLoginMutation } from "@/hooks/auth/useLoginMutation";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { getCustomerProfileStatus } from "@/lib/api/profile";
import { resolvePostLoginPath } from "@/lib/auth/redirect";
import { APP_ROUTES } from "@/lib/constants/appRoutes";
import { loginSchema, type LoginFormValues } from "@/lib/schemas/loginSchema";
import { cn } from "@/lib/utils/cn";
import { useAuthStore } from "@/stores/useAuthStore";

const fieldLabelClass = cn(
  getTextVariantClass({ base: "md-regular", md: "xl-regular" }),
  "text-text-secondary",
);

const getRedirectParam = () => {
  if (typeof window === "undefined") return null;
  return new URLSearchParams(window.location.search).get("redirect");
};

const LoginForm = () => {
  const router = useRouter();
  const { mutateAsync: login, isPending } = useLoginMutation();
  const isLogin = useAuthStore((state) => state.isAuthenticated);
  const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const [submitError, setSubmitError] = useState<string | null>(null);

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
    if (!hasHydrated || isCheckingAuth || !isLogin || isSubmitting || isPending) return;
    router.replace(APP_ROUTES.MOVERS.ROOT);
  }, [hasHydrated, isLogin, isCheckingAuth, isSubmitting, isPending, router]);

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null);

    try {
      await login(values);
      const status = await getCustomerProfileStatus();
      const nextPath = resolvePostLoginPath({
        isProfileCompleted: status.isProfileCompleted,
        returnPath: getRedirectParam(),
      });
      router.replace(nextPath);
    } catch (error) {
      setSubmitError(getApiErrorMessage(error));
    }
  });

  return (
    <div className="flex w-full flex-col items-center gap-40 md:gap-48">
      <header className="flex w-full flex-col items-center gap-0 md:gap-8">
        <div className="flex h-104 w-full items-center justify-center py-20 md:h-auto">
          <Link href="/" aria-label="무빙 홈으로 이동">
            <Image
              src="/icons/moving-logo-text.svg"
              alt="무빙"
              width={112}
              height={44}
              priority
              className="h-44 w-auto md:h-[55px] md:w-[107px]"
            />
          </Link>
        </div>

        <p className="flex items-center justify-center gap-4 md:gap-8">
          <Text
            as="span"
            variant={{ base: "xs-regular", md: "xl-regular" }}
            className="text-text-description"
          >
            기사님이신가요?
          </Text>
          <Link
            href={APP_ROUTES.MOVER_LOGIN}
            className={cn(
              getTextVariantClass({ base: "link-xs", md: "link-xl" }),
              "text-text-brand",
            )}
          >
            기사님 전용 페이지
          </Link>
        </p>
      </header>

      <div className="flex w-full flex-col items-center gap-48 md:gap-24">
        <form className="flex w-full flex-col gap-32 md:gap-56" onSubmit={onSubmit} noValidate>
          <div className="flex w-full flex-col gap-16 md:gap-32">
            <div className="flex w-full flex-col gap-8 md:gap-16">
              <label htmlFor="email" className={fieldLabelClass}>
                이메일
              </label>
              <Input
                id="email"
                size="md"
                type="email"
                autoComplete="email"
                placeholder="이메일을 입력해 주세요"
                error={errors.email?.message}
                {...register("email")}
              />
            </div>

            <div className="flex w-full flex-col gap-8 md:gap-16">
              <label htmlFor="password" className={fieldLabelClass}>
                비밀번호
              </label>
              <PasswordInput
                id="password"
                size="md"
                autoComplete="current-password"
                placeholder="비밀번호를 입력해 주세요"
                error={errors.password?.message}
                {...register("password")}
              />
            </div>
          </div>

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
            href={APP_ROUTES.SIGN_UP}
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
          SNS 계정으로 간편 가입하기
        </Text>
        <SocialLoginButtons />
      </div>
    </div>
  );
};

export default LoginForm;
