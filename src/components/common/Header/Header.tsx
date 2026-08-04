"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

import NotificationTrigger from "@/components/common/Header/notification";
import ProfileMenuTrigger, {
  type ProfileMenuItem,
} from "@/components/common/Header/ProfileMenuTrigger";
import { Text } from "@/components/common/Text";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { CloseIcon, MenuIcon } from "@/icons";
import type { AuthRole } from "@/lib/auth/role";
import { loadRole } from "@/lib/auth/role";
import { getLoginRedirectPath } from "@/lib/auth/session";
import { APP_ROUTES } from "@/lib/constants/appRoutes";
import { MEDIA_QUERY } from "@/lib/constants/breakpoints";
import { cn } from "@/lib/utils/cn";
import { useAuthStore } from "@/stores/useAuthStore";

const LOGGED_OUT_LINKS = [
  {
    label: "기사님 찾기",
    href: APP_ROUTES.MOVERS.ROOT,
  },
];

const CUSTOMER_LOGGED_IN_LINKS = [
  {
    label: "견적 요청",
    href: APP_ROUTES.ESTIMATE_REQUEST,
  },
  {
    label: "기사님 찾기",
    href: APP_ROUTES.MOVERS.ROOT,
  },
  {
    label: "내 견적 관리",
    href: APP_ROUTES.ESTIMATES.ROOT,
  },
];

const MOVER_LOGGED_IN_LINKS = [
  {
    label: "받은 요청",
    href: APP_ROUTES.MOVER_ESTIMATES.ROOT,
  },
  {
    label: "내 견적 관리",
    href: APP_ROUTES.MOVER_ESTIMATES.SENT,
  },
];

const CUSTOMER_PROFILE_MENU_ITEMS: ProfileMenuItem[] = [
  {
    type: "link",
    label: "프로필 수정",
    href: APP_ROUTES.PROFILE_EDIT,
  },
  {
    type: "link",
    label: "찜한 기사님",
    href: APP_ROUTES.MOVERS.FAVORITES,
  },
  {
    type: "link",
    label: "이사 리뷰",
    href: APP_ROUTES.REVIEWS.WRITABLE,
  },
  {
    type: "action",
    label: "로그아웃",
    action: "logout",
  },
];

const MOVER_PROFILE_MENU_ITEMS: ProfileMenuItem[] = [
  {
    type: "link",
    label: "프로필",
    href: APP_ROUTES.MOVER_PROFILE,
  },
  {
    type: "action",
    label: "로그아웃",
    action: "logout",
  },
];

/**
 * GNB 메뉴 활성 여부.
 * 찜한 기사님(`/movers/favorites`)은 프로필 메뉴 항목이므로
 * 기사님 찾기 활성 상태에서 제외합니다.
 */
function isNavLinkActive(pathname: string, href: string): boolean {
  if (pathname === href) {
    return true;
  }

  if (!pathname.startsWith(`${href}/`)) {
    return false;
  }

  if (href === APP_ROUTES.MOVERS.ROOT) {
    const favoritesPath = APP_ROUTES.MOVERS.FAVORITES;

    if (pathname === favoritesPath || pathname.startsWith(`${favoritesPath}/`)) {
      return false;
    }
  }

  return true;
}

export interface HeaderProps {
  /** Server에서 refresh 쿠키로 전달. hydrate 전 깜빡임 방지용 */
  isLogin?: boolean;
  /** Server에서 nickname 쿠키로 전달. hydrate 전 이름 표시용 */
  initialNickname?: string | null;
  /** Server에서 role 쿠키로 전달. hydrate 전 nav 분기용 */
  initialRole?: AuthRole | null;
}

const Header = ({
  isLogin: initialIsLogin,
  initialNickname = null,
  initialRole = null,
}: HeaderProps) => {
  const pathname = usePathname();
  const mobileMenuId = useId();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLElement>(null);

  const user = useAuthStore((state) => state.user);
  const displayName = useAuthStore((state) => state.displayName);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // hydrate 전·checkAuth 중: SSR refresh 쿠키 힌트 유지
  // checkAuth 완료 후: 실제 세션(access) 기준
  const isLogin = !hasHydrated || isCheckingAuth ? Boolean(initialIsLogin) : isAuthenticated;

  const resolvedRole: AuthRole | null =
    user?.role ?? (!hasHydrated || isCheckingAuth ? initialRole : loadRole());

  const navLinks = !isLogin
    ? LOGGED_OUT_LINKS
    : resolvedRole === "MOVER"
      ? MOVER_LOGGED_IN_LINKS
      : CUSTOMER_LOGGED_IN_LINKS;

  const profileMenuItems =
    resolvedRole === "MOVER" ? MOVER_PROFILE_MENU_ITEMS : CUSTOMER_PROFILE_MENU_ITEMS;

  // hydrate/checkAuth 전·SSR 비로그인 힌트면 스켈레톤
  const showAuthSkeleton = (!hasHydrated || isCheckingAuth) && !initialIsLogin;

  const nickname = user?.name ?? displayName ?? initialNickname ?? "닉네임";

  useFocusTrap({
    containerRef: mobileMenuRef,
    enabled: isMobileMenuOpen,
    onEscape: () => setIsMobileMenuOpen(false),
  });

  useEffect(() => {
    if (!isMobileMenuOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobileMenuOpen]);

  // xl 브레이크포인트 진입 시 모바일 메뉴를 닫아 focus trap·scroll lock 해제
  useEffect(() => {
    const mediaQuery = window.matchMedia(MEDIA_QUERY.xl);

    const handleBreakpointChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        setIsMobileMenuOpen(false);
      }
    };

    mediaQuery.addEventListener("change", handleBreakpointChange);

    return () => {
      mediaQuery.removeEventListener("change", handleBreakpointChange);
    };
  }, []);

  return (
    <header className="border-border-subtle bg-background-surface relative z-40 w-full max-w-full border-b">
      {/* Desktop 고정 GNB padding은 xl+ — Tablet에서 과도한 padding으로 가로 스크롤이 생기는 문제 방지 */}
      {/* overflow-x-hidden을 header 전체에 두면 알림·프로필 드롭다운이 잘리므로 좌측 nav 영역에만 적용 */}
      <div className="h-gnb-height-mobile md:h-gnb-height-tablet xl:h-gnb-height-desktop px-margin-mobile md:px-margin-tablet xl:px-gnb-padding-x-desktop flex w-full max-w-full items-center justify-between gap-12 py-16 xl:py-26">
        <div className="flex min-w-0 flex-1 items-center gap-24 overflow-x-hidden xl:gap-80">
          <Link href="/" className="shrink-0">
            {isLogin ? (
              <>
                <Image
                  src="/icons/moving-logo-icon.svg"
                  alt="무빙"
                  width={32}
                  height={32}
                  priority
                  className="md:hidden"
                />
                <Image
                  src="/icons/logo_full.svg"
                  alt="무빙"
                  width={116}
                  height={44}
                  priority
                  className="hidden h-[34px] w-[88px] object-contain md:block xl:h-[44px] xl:w-[116px]"
                />
              </>
            ) : (
              <Image
                src="/icons/logo_full.svg"
                alt="무빙"
                width={116}
                height={44}
                priority
                className="h-[34px] w-[88px] object-contain xl:h-[44px] xl:w-[116px]"
              />
            )}
          </Link>

          {/* Mobile은 햄버거 전까지 링크 숨김 — 좁은 폭에서 GNB 가로 스크롤 방지 */}
          <nav aria-label="주요 메뉴" className="hidden min-w-0 xl:block">
            <ul className="flex items-center xl:gap-40">
              {navLinks.map((link) => {
                const isActive = isNavLinkActive(pathname, link.href);

                return (
                  <li key={link.label} className="shrink-0">
                    <Link
                      href={link.href}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "transition-colors",
                        isActive
                          ? "text-nav-text-active"
                          : "text-nav-text-default hover:text-nav-text-active",
                      )}
                    >
                      <Text variant="2lg-bold">{link.label}</Text>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {showAuthSkeleton ? (
          <div className="flex shrink-0 items-center gap-16 xl:gap-32" aria-hidden>
            <div className="bg-background-subtle size-36 animate-pulse rounded-full" />

            <div className="flex items-center gap-16">
              <div className="bg-background-subtle size-36 animate-pulse rounded-full" />
              <div className="bg-background-subtle rounded-4 h-20 w-64 animate-pulse" />
            </div>

            <div className="bg-background-subtle rounded-4 size-24 animate-pulse xl:hidden" />
          </div>
        ) : isLogin ? (
          <div className="relative z-50 flex shrink-0 items-center gap-16 xl:gap-32">
            <NotificationTrigger />

            <ProfileMenuTrigger
              key={pathname}
              nickname={nickname}
              items={profileMenuItems}
              role={resolvedRole}
            />

            <button
              type="button"
              aria-label="주요 메뉴"
              aria-expanded={isMobileMenuOpen}
              aria-controls={mobileMenuId}
              className="focus-visible:ring-border-brand rounded-4 flex size-24 items-center justify-center focus-visible:ring-2 focus-visible:outline-none xl:hidden"
              onClick={() => setIsMobileMenuOpen((open) => !open)}
            >
              <MenuIcon className="size-24" />
            </button>
          </div>
        ) : (
          <Link
            href={getLoginRedirectPath()}
            className="bg-background-brand text-text-inverse hover:bg-background-brand-hover rounded-8 flex h-40 shrink-0 items-center px-20 transition-colors"
          >
            <Text variant="md-semibold">로그인</Text>
          </Link>
        )}
      </div>

      <button
        type="button"
        aria-label="메뉴 닫기"
        aria-hidden={!isMobileMenuOpen}
        tabIndex={isMobileMenuOpen ? 0 : -1}
        className={cn(
          "bg-overlay-scrim fixed inset-0 z-[9999] transition-opacity duration-200 xl:hidden",
          isMobileMenuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      <aside
        ref={mobileMenuRef}
        id={mobileMenuId}
        role="dialog"
        aria-modal="true"
        aria-label="주요 메뉴"
        aria-hidden={!isMobileMenuOpen}
        inert={!isMobileMenuOpen}
        tabIndex={-1}
        className={cn(
          "bg-background-surface fixed inset-y-0 right-0 z-[10000] flex w-[220px] flex-col transition-transform duration-200 ease-out focus:outline-none xl:hidden",
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="border-border-subtle flex h-54 shrink-0 items-center justify-end border-b px-16 py-10">
          <button
            type="button"
            aria-label="메뉴 닫기"
            className="text-icon-default focus-visible:ring-border-brand rounded-4 flex size-24 items-center justify-center focus-visible:ring-2 focus-visible:outline-none"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <CloseIcon className="size-24" />
          </button>
        </div>

        <nav aria-label="모바일 주요 메뉴">
          <ul className="flex flex-col items-start">
            {navLinks.map((link) => {
              const isActive = isNavLinkActive(pathname, link.href);

              return (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "flex w-[220px] items-center overflow-hidden px-20 py-24 transition-colors",
                      isActive
                        ? "text-text-primary"
                        : "text-text-primary hover:bg-background-hover",
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Text variant="lg-medium">{link.label}</Text>
                  </Link>
                </li>
              );
            })}

            {!isLogin ? (
              <li>
                <Link
                  href={getLoginRedirectPath()}
                  className="text-text-primary hover:bg-background-hover flex w-[220px] items-center overflow-hidden px-20 py-24 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Text variant="lg-medium">로그인</Text>
                </Link>
              </li>
            ) : null}
          </ul>
        </nav>
      </aside>
    </header>
  );
};

export default Header;
