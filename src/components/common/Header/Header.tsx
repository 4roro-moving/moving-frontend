"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import NotificationTrigger from "@/components/common/Header/notification";
import HeaderSideNav from "@/components/common/Header/HeaderSideNav";
import ProfileMenuTrigger, {
  type ProfileMenuItem,
} from "@/components/common/Header/ProfileMenuTrigger";
import { Text } from "@/components/common/Text";
import { MenuIcon } from "@/icons";
import { getLoginRedirectPath } from "@/lib/auth/session";
import type { AuthRole } from "@/lib/auth/role";
import { loadRole } from "@/lib/auth/role";
import { APP_ROUTES } from "@/lib/constants/appRoutes";
import { cn } from "@/lib/utils/cn";
import { useAuthStore } from "@/stores/useAuthStore";

const LOGGED_OUT_LINKS = [{ label: "기사님 찾기", href: APP_ROUTES.MOVERS.ROOT }];

const CUSTOMER_LOGGED_IN_LINKS = [
  { label: "견적 요청", href: APP_ROUTES.ESTIMATE_REQUEST },
  { label: "기사님 찾기", href: APP_ROUTES.MOVERS.ROOT },
  { label: "내 견적 관리", href: APP_ROUTES.ESTIMATES.ROOT },
];

const MOVER_LOGGED_IN_LINKS = [
  { label: "받은 요청", href: APP_ROUTES.MOVER_ESTIMATES.ROOT },
  { label: "내 견적 관리", href: APP_ROUTES.MOVER_ESTIMATES.SENT },
];

const CUSTOMER_PROFILE_MENU_ITEMS: ProfileMenuItem[] = [
  { type: "link", label: "프로필 수정", href: APP_ROUTES.PROFILE_EDIT },
  { type: "link", label: "찜한 기사님", href: APP_ROUTES.MOVERS.FAVORITES },
  { type: "link", label: "이사 리뷰", href: APP_ROUTES.REVIEWS.WRITABLE },
  { type: "action", label: "로그아웃", action: "logout" },
];

const MOVER_PROFILE_MENU_ITEMS: ProfileMenuItem[] = [
  { type: "link", label: "프로필 수정", href: APP_ROUTES.MOVER_PROFILE_EDIT },
  { type: "link", label: "기본정보 수정", href: APP_ROUTES.MOVER_BASIC_EDIT },
  { type: "action", label: "로그아웃", action: "logout" },
];

/** GNB 메뉴 활성 여부. 찜한 기사님(`/movers/favorites`)은 프로필 메뉴 항목이라 기사님 찾기 활성에서 제외 */
const isNavLinkActive = (pathname: string, href: string): boolean => {
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
};

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

  // hydrate 전·checkAuth 중: SSR refresh 쿠키 힌트 유지 (Access 메모리 공백 깜빡임 방지)
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
  const profileMenuItems =
    resolvedRole === "MOVER" ? MOVER_PROFILE_MENU_ITEMS : CUSTOMER_PROFILE_MENU_ITEMS;
  // hydrate/checkAuth 전·SSR 비로그인 힌트면 스켈레톤
  const showAuthSkeleton = (!hasHydrated || isCheckingAuth) && !initialIsLogin;
  const nickname = user?.name ?? displayName ?? initialNickname ?? "닉네임";

  const openSideNav = () => setIsSideNavOpen(true);
  const closeSideNav = () => setIsSideNavOpen(false);

  return (
    <header className="border-border-subtle bg-background-surface w-full border-b">
      <div className="h-gnb-height-mobile md:h-gnb-height-tablet lg:h-gnb-height-desktop px-margin-mobile md:px-margin-tablet lg:px-gnb-padding-x-desktop flex items-center justify-between py-10 lg:py-26">
        <div className="flex items-center gap-80">
          <Link href="/" className="shrink-0">
            <Image
              src="/icons/logo_full.svg"
              alt="4roro-moving"
              width={116}
              height={44}
              priority
              className="h-[34px] w-[88px] lg:h-44 lg:w-[116px]"
            />
          </Link>

          <nav className="hidden lg:block" aria-label="주요 메뉴">
            <ul className="flex items-center gap-40">
              {navLinks.map((link) => {
                const isActive = isNavLinkActive(pathname, link.href);

                return (
                  <li key={link.label}>
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
          <div className="flex items-center gap-24 lg:gap-32" aria-hidden>
            <div className="bg-background-subtle size-24 animate-pulse rounded-full lg:size-36" />
            <div className="flex items-center gap-16">
              <div className="bg-background-subtle size-24 animate-pulse rounded-full lg:size-36" />
              <div className="bg-background-subtle rounded-4 hidden h-20 w-64 animate-pulse lg:block" />
            </div>
            <div className="bg-background-subtle rounded-4 size-24 animate-pulse lg:hidden" />
          </div>
        ) : isLogin ? (
          <div className="flex items-center gap-24 lg:gap-32">
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
              className="text-icon-default focus-visible:ring-border-brand rounded-4 flex size-24 items-center justify-center focus-visible:ring-2 focus-visible:outline-none lg:hidden"
              aria-label="메뉴 열기"
              aria-expanded={isSideNavOpen}
              onClick={openSideNav}
            >
              <MenuIcon aria-hidden="true" className="size-24" />
            </button>
          </div>
        ) : (
          <div className="flex items-center">
            <Link
              href={getLoginRedirectPath()}
              className="bg-background-brand text-text-inverse hover:bg-background-brand-hover rounded-8 hidden h-40 items-center px-20 transition-colors lg:flex"
            >
              <Text variant="md-semibold">로그인</Text>
            </Link>
            <button
              ref={menuButtonRef}
              type="button"
              className="text-icon-default focus-visible:ring-border-brand rounded-4 flex size-24 items-center justify-center focus-visible:ring-2 focus-visible:outline-none lg:hidden"
              aria-label="메뉴 열기"
              aria-expanded={isSideNavOpen}
              onClick={openSideNav}
            >
              <MenuIcon aria-hidden="true" className="size-24" />
            </button>
          </div>
        )}
      </div>

      <HeaderSideNav isOpen={isSideNavOpen} onClose={closeSideNav} links={sideNavLinks} />
    </header>
  );
};

export default Header;
