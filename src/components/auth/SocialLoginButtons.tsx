"use client";

import Link from "next/link";
import { useState } from "react";

import { GoogleIcon, KakaoLoginIcon, NaverLoginIcon } from "@/icons";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import type { OAuthIntent, OAuthProvider } from "@/lib/auth/oauth";
import type { AuthAudience } from "@/lib/auth/redirect";
import { startOAuthLogin } from "@/lib/auth/startOAuthLogin";
import { cn } from "@/lib/utils/cn";
import type { TermsAgreementInput } from "@/types/terms";

interface SocialLoginButtonsBaseProps {
  className?: string;
  audience?: AuthAudience;
  disabled?: boolean;
  onError?: (message: string) => void;
}

interface SocialLoginButtonsOAuthProps extends SocialLoginButtonsBaseProps {
  intent: OAuthIntent;
  agreements?: TermsAgreementInput[];
}

interface SocialLoginButtonsNavigateProps extends SocialLoginButtonsBaseProps {
  hrefForProvider: (provider: OAuthProvider) => string;
}

type SocialLoginButtonsProps = SocialLoginButtonsOAuthProps | SocialLoginButtonsNavigateProps;

const isNavigateSocialLoginButtons = (
  props: SocialLoginButtonsProps,
): props is SocialLoginButtonsNavigateProps => {
  return "hrefForProvider" in props;
};

const SOCIAL_PROVIDERS: {
  provider: OAuthProvider;
  label: string;
  className: string;
  icon: typeof GoogleIcon;
  iconClassName: string;
}[] = [
  {
    provider: "google",
    label: "Google로 로그인",
    className: "bg-social-google-background",
    icon: GoogleIcon,
    iconClassName: "size-20 md:size-24",
  },
  {
    provider: "kakao",
    label: "카카오로 로그인",
    className: "bg-social-kakao-background",
    icon: KakaoLoginIcon,
    iconClassName: "size-22 md:size-28",
  },
  {
    provider: "naver",
    label: "네이버로 로그인",
    className: "bg-social-naver-background",
    icon: NaverLoginIcon,
    iconClassName: "size-20 md:size-24",
  },
];

/**
 * SNS 간편 로그인 버튼 그룹.
 * OAuth 모드에서는 Provider 인가 URL로 이동한 뒤 `/oauth/{provider}/callback`에서 code를 교환합니다.
 * 이동 모드에서는 소셜 회원가입 페이지 등 내부 경로로 연결합니다.
 */
const SocialLoginButtons = (props: SocialLoginButtonsProps) => {
  const { className, audience = "customer", disabled = false, onError } = props;
  const [isPending, setIsPending] = useState(false);

  const handleSocialLogin = async (provider: OAuthProvider) => {
    if (isPending || disabled || isNavigateSocialLoginButtons(props)) return;

    onError?.("");
    setIsPending(true);

    try {
      await startOAuthLogin(provider, audience, {
        intent: props.intent,
        ...(props.agreements ? { agreements: props.agreements } : {}),
      });
    } catch (err) {
      onError?.(getApiErrorMessage(err));
      setIsPending(false);
    }
  };

  return (
    <div className={cn("flex items-center gap-24 md:gap-32", className)}>
      {SOCIAL_PROVIDERS.map(
        ({ provider, label, className: buttonClassName, icon: Icon, iconClassName }) => {
          const itemClassName = cn(
            "flex size-54 shrink-0 items-center justify-center rounded-full md:size-72",
            "disabled:cursor-not-allowed disabled:opacity-60",
            buttonClassName,
          );

          if (isNavigateSocialLoginButtons(props)) {
            return (
              <Link
                key={provider}
                href={props.hrefForProvider(provider)}
                aria-label={label}
                className={itemClassName}
              >
                <Icon className={iconClassName} aria-hidden="true" />
              </Link>
            );
          }

          return (
            <button
              key={provider}
              type="button"
              aria-label={label}
              disabled={disabled || isPending}
              onClick={() => {
                void handleSocialLogin(provider);
              }}
              className={itemClassName}
            >
              <Icon className={iconClassName} aria-hidden="true" />
            </button>
          );
        },
      )}
    </div>
  );
};

export default SocialLoginButtons;
