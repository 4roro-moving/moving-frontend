"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";

import NotificationTrigger from "@/components/common/Header/notification";
import HeaderSideNav, { type HeaderSideNavLink } from "@/components/common/Header/HeaderSideNav";
import { isNavLinkActive } from "@/components/common/Header/isNavLinkActive";
import ProfileMenuTrigger, {
  type ProfileMenuItem,
} from "@/components/common/Header/ProfileMenuTrigger";
import { Text } from "@/components/common/Text";
import { useResolvedAuthRole } from "@/hooks/auth/useResolvedAuthRole";
import { useCloseOnPathnameChange } from "@/hooks/useCloseOnPathnameChange";
import { useProfileCompletionState } from "@/hooks/profile/useProfileCompletionState";
import { MenuIcon } from "@/icons";
import { isOAuthCallbackPath } from "@/lib/auth/redirect";
import type { AuthRole } from "@/lib/auth/role";
import { getLoginRedirectPath } from "@/lib/auth/session";
import { APP_ROUTES } from "@/lib/constants/appRoutes";
import { cn } from "@/lib/utils/cn";
import { useAuthStore } from "@/stores/useAuthStore";

const isLoginPagePath = (pathname: string): boolean => {
  return [APP_ROUTES.LOGIN, APP_ROUTES.MOVER_LOGIN].some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
};

const PROFILE_INCOMPLETE_SIDE_NAV_MESSAGE = "프로필을 완성한 뒤 이용할 수 있어요.";

const PROFILE_LOGOUT_MENU_ITEM: ProfileMenuItem = {
  type: "action",
  label: "로그아웃",
  action: "logout",
};

const CONTENT_NAV_LINK = {
  label: "콘텐츠",
  href: APP_ROUTES.CONTENTS.ROOT,
} as const;

const LOGGED_OUT_LINKS = [
  {
    label: "기사님 찾기",
    href: APP_ROUTES.MOVERS.ROOT,
  },
  CONTENT_NAV_LINK,
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
  CONTENT_NAV_LINK,
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

/** nav role 분기 — 미확정 시 고객 메뉴 (F5 깜빡임 방지) */
const getHeaderNavLinks = (isLogin: boolean, role: AuthRole | null): HeaderSideNavLink[] => {
  if (!isLogin) {
    return LOGGED_OUT_LINKS;
  }

  switch (role) {
    case "MOVER":
      return MOVER_LOGGED_IN_LINKS;
    case "ADMIN":
      return [];
    case "CUSTOMER":
    default:
      return CUSTOMER_LOGGED_IN_LINKS;
  }
};

/** nav와 동일한 role 분기 — 미확정 시 고객 메뉴 (F5 깜빡임 방지) */
const getCompletedProfileMenuItems = (role: AuthRole | null): ProfileMenuItem[] => {
  switch (role) {
    case "MOVER":
      return MOVER_PROFILE_MENU_ITEMS;
    case "ADMIN":
      return [PROFILE_LOGOUT_MENU_ITEM];
    case "CUSTOMER":
    default:
      return CUSTOMER_PROFILE_MENU_ITEMS;
  }
};

export interface HeaderProps {
  /** Server에서 refresh 쿠키로 전달. hydrate 전 깜빡임 방지용 */
  isLogin?: boolean;
  /** Server에서 nickname 쿠키로 전달. hydrate 전 이름 표시용 */
  initialNickname?: string | null;
  /** Server에서 role 쿠키로 전달. hydrate 전 nav 분기용 */
  initialRole?: AuthRole | null;
  /** Server에서 profileImage 쿠키로 전달. hydrate 전 프로필 이미지 표시용 */
  initialProfileImage?: string | null;
  /** Server에서 profileCompleted 쿠키. 미완료 시 GNB 숨김 낙관용 */
  initialProfileCompleted?: boolean | null;
}

const Header = ({
  isLogin: initialIsLogin,
  initialNickname = null,
  initialRole = null,
  initialProfileImage = null,
  initialProfileCompleted = null,
}: HeaderProps) => {
  const pathname = usePathname();
  const mobileMenuId = useId();
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const wasSideNavOpenRef = useRef(false);

  const openSideNav = useCallback(() => setIsSideNavOpen(true), []);
  const closeSideNav = useCallback(() => setIsSideNavOpen(false), []);

  useCloseOnPathnameChange(closeSideNav);

  useEffect(() => {
    if (wasSideNavOpenRef.current && !isSideNavOpen) {
      menuButtonRef.current?.focus();
    }
    wasSideNavOpenRef.current = isSideNavOpen;
  }, [isSideNavOpen]);

  const user = useAuthStore((state) => state.user);
  const displayName = useAuthStore((state) => state.displayName);
  const profileImage = useAuthStore((state) => state.profileImage);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const isAuthPending = !hasHydrated || isCheckingAuth;

  // hydrate 전·checkAuth 중: SSR refresh 쿠키 힌트 유지
  // checkAuth 완료 후: 실제 세션(access) 기준
  const isLogin = isAuthPending ? Boolean(initialIsLogin || initialRole) : isAuthenticated;

  const resolvedRole = useResolvedAuthRole(initialRole);
  // 확정 후 loadRole 공백 시에도 SSR role 힌트 유지 (Header 표시용)
  const roleForNav = resolvedRole ?? initialRole;

  const navLinks = getHeaderNavLinks(isLogin, roleForNav);

  const isLoginPage = isLoginPagePath(pathname);
  const isOAuthCallbackPage = isOAuthCallbackPath(pathname);
  /** 로그인·OAuth callback — 이탈용 GNB/로그인 CTA 숨김 */
  const shouldHideAuthChrome = isLoginPage || isOAuthCallbackPage;

  const sideNavLinks = !isLogin
    ? isOAuthCallbackPage
      ? []
      : isLoginPage
        ? LOGGED_OUT_LINKS
        : [...LOGGED_OUT_LINKS, { label: "로그인", href: getLoginRedirectPath() }]
    : navLinks;

  // hydrate/checkAuth 전·로그인 힌트(refresh·role) 없으면 스켈레톤 — isLogin과 기준 맞춤
  // OAuth callback은 code 교환 중이므로 우측 액션·스켈레톤도 숨김
  const showAuthSkeleton = !isOAuthCallbackPage && isAuthPending && !initialIsLogin && !initialRole;

  const nickname = user?.name ?? displayName ?? initialNickname ?? "닉네임";

  const hintedImageUrl = profileImage ?? initialProfileImage ?? null;
  const imageUrl = isAuthPending ? hintedImageUrl : (user?.imageUrl ?? profileImage ?? null);

  const isAvatarPending = isAuthPending && !hintedImageUrl;

  const { isIncomplete, profileCreatePath } = useProfileCompletionState(
    roleForNav,
    initialProfileCompleted,
  );

  // 프로필 미완료·OAuth callback 중 GNB 숨김
  const shouldHideNavLinks = (isLogin && isIncomplete) || isOAuthCallbackPage;

  const logoImages = isLogin ? (
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
  );

  const completedProfileMenuItems = getCompletedProfileMenuItems(roleForNav);

  const profileMenuItems: ProfileMenuItem[] = !isLogin
    ? completedProfileMenuItems
    : isIncomplete
      ? [{ type: "link", label: "프로필 생성", href: profileCreatePath }, PROFILE_LOGOUT_MENU_ITEM]
      : completedProfileMenuItems;

  return (
    <header className="border-border-subtle bg-background-surface relative z-40 w-full max-w-full border-b">
      {/* Desktop 고정 GNB padding은 xl+ — Tablet에서 과도한 padding으로 가로 스크롤이 생기는 문제 방지 */}
      {/* 2026.08.04 정슬기 - [수정] */}
      {/* overflow-x-hidden을 header 전체에 두면 알림·프로필 드롭다운이 잘리므로 좌측 nav 영역에만 적용 */}
      <div className="h-gnb-height-mobile md:h-gnb-height-tablet xl:h-gnb-height-desktop px-margin-mobile md:px-margin-tablet xl:px-gnb-padding-x-desktop flex w-full max-w-full items-center justify-between gap-12 py-16 xl:py-26">
        <div className="flex min-w-0 flex-1 items-center gap-24 overflow-x-hidden xl:gap-80">
          {isOAuthCallbackPage ? (
            <div className="shrink-0">{logoImages}</div>
          ) : (
            <Link href="/" className="shrink-0">
              {logoImages}
            </Link>
          )}

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

        {isOAuthCallbackPage ? null : showAuthSkeleton ? (
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
              imageUrl={imageUrl}
              items={profileMenuItems}
              role={roleForNav}
              isAvatarPending={isAvatarPending}
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
              <MenuIcon className="text-icon-muted size-24" />
            </button>
          </div>
        ) : (
          <div className="flex shrink-0 items-center gap-16">
            {!shouldHideAuthChrome ? (
              <Link
                href={getLoginRedirectPath()}
                className="bg-background-brand text-text-inverse hover:bg-background-brand-hover rounded-8 hidden h-40 items-center px-20 transition-colors xl:flex"
              >
                <Text variant="md-semibold">로그인</Text>
              </Link>
            ) : null}
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
