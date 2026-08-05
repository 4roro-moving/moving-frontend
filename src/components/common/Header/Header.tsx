"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";

import NotificationTrigger from "@/components/common/Header/notification";
import HeaderSideNav from "@/components/common/Header/HeaderSideNav";
import { isNavLinkActive } from "@/components/common/Header/isNavLinkActive";
import ProfileMenuTrigger, {
  type ProfileMenuItem,
} from "@/components/common/Header/ProfileMenuTrigger";
import { Text } from "@/components/common/Text";
import { useProfileCompletionState } from "@/hooks/profile/useProfileCompletionState";
import { MenuIcon } from "@/icons";
import type { AuthRole } from "@/lib/auth/role";
import { loadRole } from "@/lib/auth/role";
import { getLoginRedirectPath } from "@/lib/auth/session";
import { APP_ROUTES } from "@/lib/constants/appRoutes";
import { cn } from "@/lib/utils/cn";
import { useAuthStore } from "@/stores/useAuthStore";

const PROFILE_INCOMPLETE_SIDE_NAV_MESSAGE = "프로필을 완성한 뒤 이용할 수 있어요.";

const PROFILE_LOGOUT_MENU_ITEM: ProfileMenuItem = {
  type: "action",
  label: "로그아웃",
  action: "logout",
};

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
  PROFILE_LOGOUT_MENU_ITEM,
];

const MOVER_PROFILE_MENU_ITEMS: ProfileMenuItem[] = [
  {
    type: "link",
    label: "프로필 수정",
    href: APP_ROUTES.MOVER_PROFILE_EDIT,
  },
  {
    type: "link",
    label: "기본정보 수정",
    href: APP_ROUTES.MOVER_BASIC_EDIT,
  },
  PROFILE_LOGOUT_MENU_ITEM,
];

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
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const [sideNavPathname, setSideNavPathname] = useState(pathname);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const wasSideNavOpenRef = useRef(false);

  if (pathname !== sideNavPathname) {
    setSideNavPathname(pathname);
    if (isSideNavOpen) {
      setIsSideNavOpen(false);
    }
  }

  useEffect(() => {
    if (wasSideNavOpenRef.current && !isSideNavOpen) {
      menuButtonRef.current?.focus();
    }
    wasSideNavOpenRef.current = isSideNavOpen;
  }, [isSideNavOpen]);

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

  const sideNavLinks = !isLogin
    ? [...LOGGED_OUT_LINKS, { label: "로그인", href: getLoginRedirectPath() }]
    : navLinks;

  // hydrate/checkAuth 전·SSR 비로그인 힌트면 스켈레톤
  const showAuthSkeleton = (!hasHydrated || isCheckingAuth) && !initialIsLogin;

  const nickname = user?.name ?? displayName ?? initialNickname ?? "닉네임";

  const { isIncomplete, isCompletionUnresolved, profileCreatePath } =
    useProfileCompletionState(resolvedRole);

  // SSR 로그인 힌트와 status 확정 전: 완료 사용자 메뉴/링크가 깜빡이지 않도록 숨김
  const shouldHideNavLinks = isLogin && (isIncomplete || isCompletionUnresolved);

  const completedProfileMenuItems =
    resolvedRole === "MOVER" ? MOVER_PROFILE_MENU_ITEMS : CUSTOMER_PROFILE_MENU_ITEMS;

  const profileMenuItems: ProfileMenuItem[] = !isLogin
    ? completedProfileMenuItems
    : isIncomplete
      ? [{ type: "link", label: "프로필 생성", href: profileCreatePath }, PROFILE_LOGOUT_MENU_ITEM]
      : isCompletionUnresolved
        ? [PROFILE_LOGOUT_MENU_ITEM]
        : completedProfileMenuItems;

  const openSideNav = useCallback(() => setIsSideNavOpen(true), []);
  const closeSideNav = useCallback(() => setIsSideNavOpen(false), []);

  return (
    <header className="border-border-subtle bg-background-surface relative z-40 w-full max-w-full border-b">
      {/* Desktop 고정 GNB padding은 xl+ — Tablet에서 과도한 padding으로 가로 스크롤이 생기는 문제 방지 */}
      {/* 2026.08.04 정슬기 - [수정] */}
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
          {/* 2026.08.04 정슬기 - [수정] */}
          {!shouldHideNavLinks ? (
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
          ) : null}
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
              ref={menuButtonRef}
              type="button"
              aria-label="주요 메뉴"
              aria-expanded={isSideNavOpen}
              aria-controls={mobileMenuId}
              className="focus-visible:ring-border-brand rounded-4 flex size-24 items-center justify-center focus-visible:ring-2 focus-visible:outline-none xl:hidden"
              onClick={openSideNav}
            >
              <MenuIcon aria-hidden="true" className="size-24" />
            </button>
          </div>
        ) : (
          <div className="flex shrink-0 items-center gap-16">
            <Link
              href={getLoginRedirectPath()}
              className="bg-background-brand text-text-inverse hover:bg-background-brand-hover rounded-8 hidden h-40 items-center px-20 transition-colors xl:flex"
            >
              <Text variant="md-semibold">로그인</Text>
            </Link>
            <button
              ref={menuButtonRef}
              type="button"
              aria-label="주요 메뉴"
              aria-expanded={isSideNavOpen}
              aria-controls={mobileMenuId}
              className="focus-visible:ring-border-brand rounded-4 flex size-24 items-center justify-center focus-visible:ring-2 focus-visible:outline-none xl:hidden"
              onClick={openSideNav}
            >
              <MenuIcon aria-hidden="true" className="size-24" />
            </button>
          </div>
        )}
      </div>

      <HeaderSideNav
        id={mobileMenuId}
        isOpen={isSideNavOpen}
        onClose={closeSideNav}
        links={shouldHideNavLinks ? [] : sideNavLinks}
        emptyMessage={isIncomplete ? PROFILE_INCOMPLETE_SIDE_NAV_MESSAGE : undefined}
      />
    </header>
  );
};

export default Header;
