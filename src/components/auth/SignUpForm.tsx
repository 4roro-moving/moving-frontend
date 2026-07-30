"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import AuthHeader from "@/components/auth/AuthHeader";
import SocialLoginButtons from "@/components/auth/SocialLoginButtons";
import Button from "@/components/common/Button/Button";
import FormField from "@/components/common/FormField/FormField";
import Input from "@/components/common/Input/Input";
import PasswordInput from "@/components/common/Input/PasswordInput";
import { Text, getTextVariantClass } from "@/components/common/Text";
import { useSignUpMutation } from "@/hooks/auth/useSignUpMutation";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { getPostAuthRedirectPath } from "@/lib/auth/redirect";
import { APP_ROUTES } from "@/lib/constants/appRoutes";
import { signUpSchema, type SignUpFormValues } from "@/lib/schemas/signUpSchema";
import { cn } from "@/lib/utils/cn";

const SignUpForm = () => {
  const router = useRouter();
  const { mutateAsync: signUp, isPending } = useSignUpMutation();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      passwordConfirm: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null);

    try {
      await signUp({
        email: values.email,
        password: values.password,
        name: values.name,
        phone: values.phone,
      });
    } catch (error) {
      setSubmitError(getApiErrorMessage(error));
      return;
    }

    router.replace(
      await getPostAuthRedirectPath({
        returnPath: null,
        fallbackPath: APP_ROUTES.PROFILE,
      }),
    );
  });

  return (
    <div className="flex w-full flex-col items-center gap-40 md:gap-48">
      <AuthHeader />

      <div className="flex w-full flex-col items-center gap-48 md:gap-24">
        <form className="flex w-full flex-col gap-32 md:gap-56" onSubmit={onSubmit} noValidate>
          <div className="flex w-full flex-col gap-16 md:gap-32">
            <FormField label="이름" labelFor="name" variant="auth">
              <Input
                id="name"
                size="md"
                type="text"
                autoComplete="name"
                placeholder="성함을 입력해 주세요"
                error={errors.name?.message}
                {...register("name")}
              />
            </FormField>

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

            <FormField label="전화번호" labelFor="phone" variant="auth">
              <Input
                id="phone"
                size="md"
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                placeholder="숫자만 입력해 주세요"
                numericOnly
                stripLeadingZeros={false}
                error={errors.phone?.message}
                {...register("phone")}
              />
            </FormField>

            <FormField label="비밀번호" labelFor="password" variant="auth">
              <PasswordInput
                id="password"
                size="md"
                autoComplete="new-password"
                placeholder="비밀번호를 입력해 주세요"
                error={errors.password?.message}
                {...register("password")}
              />
            </FormField>

            <FormField label="비밀번호 확인" labelFor="passwordConfirm" variant="auth">
              <PasswordInput
                id="passwordConfirm"
                size="md"
                autoComplete="new-password"
                placeholder="비밀번호를 다시 한번 입력해 주세요"
                error={errors.passwordConfirm?.message}
                {...register("passwordConfirm")}
              />
            </FormField>
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
            시작하기
          </Button>
        </form>

        <p className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
          <Text
            as="span"
            variant={{ base: "xs-regular", md: "xl-regular" }}
            className="text-text-description"
          >
            이미 무빙 회원이신가요?
          </Text>
          <Link
            href={APP_ROUTES.LOGIN}
            className={cn(
              getTextVariantClass({ base: "link-xs", md: "link-xl" }),
              "text-text-brand",
            )}
          >
            로그인
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

export default SignUpForm;
