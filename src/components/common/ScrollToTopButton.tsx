"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Text } from "@/components/common/Text";
import { APP_ROUTES } from "@/lib/constants/appRoutes";
import { cn } from "@/lib/utils/cn";

/** Auth/프로필 등에서 쓰는 공식 컬러 캐릭터 */
const CHARACTER_SRC = "/images/profile-character.png";

/** 이 스크롤 위치(px) 이상이면 버튼 노출 (300~500 구간) */
const SCROLL_SHOW_THRESHOLD_PX = 400;

/** 로그인·회원가입·프로필·인증 화면 — Scroll To Top 미노출 */
const SCROLL_TO_TOP_HIDDEN_PATHS = new Set<string>([
  APP_ROUTES.LOGIN,
  APP_ROUTES.SIGN_UP,
  APP_ROUTES.MOVER_LOGIN,
  APP_ROUTES.MOVER_SIGN_UP,
  APP_ROUTES.PROFILE,
  APP_ROUTES.PROFILE_EDIT,
  APP_ROUTES.MOVER_PROFILE,
]);

function shouldHideScrollToTop(pathname: string): boolean {
  if (pathname.startsWith("/oauth/")) {
    return true;
  }
  return SCROLL_TO_TOP_HIDDEN_PATHS.has(pathname);
}

/** 기사 상세(`/movers/:id`) — Mobile sticky CTA와 겹침 방지 */
function isMoverDetailPath(pathname: string): boolean {
  if (pathname === APP_ROUTES.MOVERS.ROOT || pathname === APP_ROUTES.MOVERS.FAVORITES) {
    return false;
  }
  return pathname.startsWith(`${APP_ROUTES.MOVERS.ROOT}/`);
}

/**
 * 공통 Scroll To Top (캐릭터 + TOP)
 * AppShell에서 1회 마운트 — 짧은 페이지·제외 경로에서는 자연스럽게 숨김
 * // 2026.08.03 정슬기 - [추가]
 */
export default function ScrollToTopButton() {
  const pathname = usePathname();
  const [scrolledPastThreshold, setScrolledPastThreshold] = useState(false);
  const hiddenByRoute = shouldHideScrollToTop(pathname);
  const raiseForStickyCta = isMoverDetailPath(pathname);
  const show = !hiddenByRoute && scrolledPastThreshold;

  useEffect(() => {
    if (hiddenByRoute) {
      return;
    }

    const updateVisibility = () => {
      setScrolledPastThreshold(window.scrollY >= SCROLL_SHOW_THRESHOLD_PX);
    };

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    return () => {
      window.removeEventListener("scroll", updateVisibility);
    };
  }, [pathname, hiddenByRoute]);

  if (hiddenByRoute) {
    return null;
  }

  return (
    <button
      type="button"
      aria-label="맨 위로"
      aria-hidden={!show}
      tabIndex={show ? 0 : -1}
      onClick={() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
      className={cn(
        "bg-background-surface shadow-toast rounded-20 fixed z-30 flex size-64 flex-col items-center justify-center gap-2",
        // Mobile 16~20 / Desktop 24~32 + Safe Area
        "right-[max(1rem,env(safe-area-inset-right))] md:right-[max(1.5rem,env(safe-area-inset-right))] lg:right-[max(2rem,env(safe-area-inset-right))]",
        raiseForStickyCta
          ? "bottom-[calc(7rem+env(safe-area-inset-bottom))] lg:bottom-[max(1.5rem,env(safe-area-inset-bottom))]"
          : "bottom-[max(1rem,env(safe-area-inset-bottom))] md:bottom-[max(1.5rem,env(safe-area-inset-bottom))] lg:bottom-[max(2rem,env(safe-area-inset-bottom))]",
        "transition-[opacity,transform,box-shadow] duration-200 ease-out",
        "hover:shadow-notification hover:-translate-y-4",
        "active:translate-y-0 active:scale-95",
        "focus-visible:ring-border-brand focus-visible:ring-2 focus-visible:outline-none",
        show
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-8 opacity-0",
      )}
    >
      <Image
        src={CHARACTER_SRC}
        alt=""
        width={40}
        height={40}
        className="size-40 object-contain"
        aria-hidden="true"
      />
      <Text as="span" variant="xs-medium" className="text-text-muted leading-none tracking-wide">
        TOP
      </Text>
    </button>
  );
}
