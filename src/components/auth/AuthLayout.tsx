import Image from "next/image";
import { type ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

interface AuthLayoutProps {
  children: ReactNode;
  /** 태블릿·데스크톱 우측 하단 마스코트 표시 여부 */
  showMascot?: boolean;
  className?: string;
}

/**
 * 로그인·회원가입·프로필 작성 등 Auth 화면 공통 레이아웃.
 * Mobile: 흰 배경 + 가로 margin / Tablet·Desktop: 브랜드 배경 + 흰 카드 + 마스코트
 */
const AuthLayout = ({ children, showMascot = true, className }: AuthLayoutProps) => {
  return (
    <div
      className={cn(
        "bg-background-surface relative flex w-full flex-1 flex-col items-center",
        "md:bg-background-brand",
        "pt-auth-top-gap-mobile pb-auth-bottom-gap-mobile px-margin-mobile",
        "md:pt-auth-top-gap-tablet md:pb-auth-bottom-gap-tablet md:px-0",
        "lg:pt-auth-top-gap-desktop lg:pb-auth-bottom-gap-desktop",
        className,
      )}
    >
      <div
        className={cn(
          "relative z-10 flex w-full flex-col items-center",
          "md:bg-background-surface md:max-w-auth-container-tablet md:rounded-auth-container",
          "md:px-auth-container-padding-x-tablet md:py-auth-container-padding-y-tablet",
          "lg:max-w-auth-container-desktop",
          "lg:px-auth-container-padding-x-desktop lg:py-auth-container-padding-y-desktop",
        )}
      >
        {children}
      </div>

      {showMascot ? (
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute right-0 bottom-0 z-0 hidden overflow-hidden md:block",
            "h-auth-mascot-height-tablet w-auth-mascot-width-tablet",
            "lg:h-auth-mascot-height-desktop lg:w-auth-mascot-width-desktop",
          )}
        >
          <Image
            src="/images/profile-character.png"
            alt=""
            fill
            sizes="(min-width: 1024px) 382px, 240px"
            className="object-contain object-bottom"
            priority
          />
        </div>
      ) : null}
    </div>
  );
};

export default AuthLayout;
