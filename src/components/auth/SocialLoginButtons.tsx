import { GoogleIcon, KakaoLoginIcon, NaverLoginIcon } from "@/icons";
import { cn } from "@/lib/utils/cn";

type SocialProvider = "google" | "kakao" | "naver";

interface SocialLoginButtonsProps {
  className?: string;
}

const SOCIAL_PROVIDERS: {
  provider: SocialProvider;
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
 * 실제 OAuth 연동 전까지 UI만 제공합니다.
 */
const SocialLoginButtons = ({ className }: SocialLoginButtonsProps) => {
  return (
    <div className={cn("flex items-center gap-24 md:gap-32", className)}>
      {SOCIAL_PROVIDERS.map(
        ({ provider, label, className: buttonClassName, icon: Icon, iconClassName }) => (
          <button
            key={provider}
            type="button"
            aria-label={`${label} (준비 중)`}
            title="준비 중"
            disabled
            className={cn(
              "flex size-54 shrink-0 items-center justify-center rounded-full md:size-72",
              "cursor-not-allowed opacity-90",
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
