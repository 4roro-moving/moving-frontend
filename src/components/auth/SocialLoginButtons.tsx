"use client";
import { GoogleIcon, KakaoLoginIcon, NaverLoginIcon } from "@/icons";
import { startOAuthLogin } from "@/lib/auth/startOAuthLogin";
import type { AuthAudience } from "@/lib/auth/redirect";
import type { OAuthProvider } from "@/lib/auth/oauth";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { cn } from "@/lib/utils/cn";
import { useState } from "react";

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

const SocialLoginButtons = ({
  className,
  audience = "customer",
  onError,
}: SocialLoginButtonsProps) => {
  const [isPending, setIsPending] = useState(false);

  const handleSocialLogin = async (provider: OAuthProvider) => {
    if (isPending) return;
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
