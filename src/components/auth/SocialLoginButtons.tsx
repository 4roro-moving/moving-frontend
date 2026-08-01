"use client";

import { useState } from "react";

import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import type { OAuthProvider } from "@/lib/auth/oauth";
import type { AuthAudience } from "@/lib/auth/redirect";
import { startOAuthLogin } from "@/lib/auth/startOAuthLogin";
import { GoogleIcon, KakaoLoginIcon, NaverLoginIcon } from "@/icons";
import { cn } from "@/lib/utils/cn";

interface SocialLoginButtonsProps {
  className?: string;
  audience?: AuthAudience;
  onError?: (message: string) => void;
}

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
 * Provider 인가 URL로 이동한 뒤 `/oauth/{provider}/callback`에서 code를 교환합니다.
 */
const SocialLoginButtons = ({
  className,
  audience = "customer",
  onError,
}: SocialLoginButtonsProps) => {
  const [isPending, setIsPending] = useState(false);

  const handleSocialLogin = async (provider: OAuthProvider) => {
    if (isPending) return;

    onError?.("");
    setIsPending(true);

    try {
      await startOAuthLogin(provider, audience);
    } catch (err) {
      onError?.(getApiErrorMessage(err));
      setIsPending(false);
    }
  };

  return (
    <div className={cn("flex items-center gap-24 md:gap-32", className)}>
      {SOCIAL_PROVIDERS.map(
        ({ provider, label, className: buttonClassName, icon: Icon, iconClassName }) => (
          <button
            key={provider}
            type="button"
            aria-label={label}
            disabled={isPending}
            onClick={() => {
              void handleSocialLogin(provider);
            }}
            className={cn(
              "flex size-54 shrink-0 items-center justify-center rounded-full md:size-72",
              "disabled:cursor-not-allowed disabled:opacity-60",
              buttonClassName,
            )}
          >
            <Icon className={iconClassName} aria-hidden="true" />
          </button>
        ),
      )}
    </div>
  );
};

export default SocialLoginButtons;
