"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { GoogleIcon, KakaoLoginIcon, NaverLoginIcon } from "@/icons";
import type { OAuthIntent, OAuthProvider } from "@/lib/auth/oauth";
import type { AuthAudience } from "@/lib/auth/redirect";
import { startOAuthLogin } from "@/lib/auth/startOAuthLogin";
import { cn } from "@/lib/utils/cn";
import type { TermsAgreementInput } from "@/types/terms";

interface SocialLoginButtonsBaseProps {
  className?: string;
  audience?: AuthAudience;
  disabled?: boolean;
  /** 비활성 클릭 시 `onError`로 전달할 안내. 없으면 클릭을 무시합니다. */
  disabledMessage?: string;
  describedBy?: string;
  /** 초기화 메시지 문자열 또는 OAuth 시작 중 발생한 원본 오류를 전달합니다. */
  onError?: (error: unknown) => void;
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
  className: string;
  icon: typeof GoogleIcon;
  iconClassName: string;
}[] = [
  {
    provider: "google",
    className: "bg-social-google-background",
    icon: GoogleIcon,
    iconClassName: "size-20 md:size-24",
  },
  {
    provider: "kakao",
    className: "bg-social-kakao-background",
    icon: KakaoLoginIcon,
    iconClassName: "size-22 md:size-28",
  },
  {
    provider: "naver",
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
  const t = useTranslations("auth");
  const {
    className,
    audience = "customer",
    disabled = false,
    disabledMessage,
    describedBy,
    onError,
  } = props;
  const [isPending, setIsPending] = useState(false);
  const isDisabled = disabled || isPending;

  const handleSocialLogin = async (provider: OAuthProvider) => {
    if (isDisabled || isNavigateSocialLoginButtons(props)) return;

    onError?.("");
    setIsPending(true);

    try {
      await startOAuthLogin(provider, audience, {
        intent: props.intent,
        ...(props.agreements ? { agreements: props.agreements } : {}),
      });
    } catch (err) {
      onError?.(err);
      setIsPending(false);
    }
  };

  const isSignUpAction = isNavigateSocialLoginButtons(props) || props.intent === "signup";

  return (
    <div className={cn("flex items-center gap-24 md:gap-32", className)}>
      {SOCIAL_PROVIDERS.map(
        ({ provider, className: buttonClassName, icon: Icon, iconClassName }) => {
          const itemClassName = cn(
            "flex size-54 shrink-0 items-center justify-center rounded-full md:size-72",
            isDisabled && "cursor-not-allowed opacity-60",
            buttonClassName,
          );
          const providerName = t(`providers.${provider}`);
          const ariaLabel = isSignUpAction
            ? t("socialSignUpWithProvider", { provider: providerName })
            : t("socialLoginWithProvider", { provider: providerName });

          if (isNavigateSocialLoginButtons(props)) {
            return (
              <Link
                key={provider}
                href={props.hrefForProvider(provider)}
                aria-label={ariaLabel}
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
              aria-label={ariaLabel}
              aria-disabled={isDisabled || undefined}
              aria-describedby={isDisabled ? describedBy : undefined}
              onClick={() => {
                if (isPending) return;
                if (disabled) {
                  if (disabledMessage) onError?.(disabledMessage);
                  return;
                }
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
