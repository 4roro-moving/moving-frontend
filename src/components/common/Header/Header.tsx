"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState, useSyncExternalStore } from "react";

import NotificationPanel from "@/components/common/Header/NotificationPanel";
import { Text } from "@/components/common/Text";
import { useClickOutside } from "@/hooks/useClickOutside";
import { AlarmIcon } from "@/icons";
import { getLoginRedirectPath, hasAuthSession, subscribeAuthSession } from "@/lib/auth/session";
import { APP_ROUTES } from "@/lib/constants/appRoutes";
import { getUnreadNotificationCount, MOCK_NOTIFICATIONS } from "@/lib/mocks/notifications.mock";
import { cn } from "@/lib/utils/cn";
import { useAuthStore } from "@/stores/useAuthStore";

const LOGGED_OUT_LINKS = [{ label: "기사님 찾기", href: APP_ROUTES.MOVERS.ROOT }];

const LOGGED_IN_LINKS = [
  { label: "견적 요청", href: APP_ROUTES.ESTIMATE_REQUEST },
  { label: "기사님 찾기", href: APP_ROUTES.MOVERS.ROOT },
  { label: "내 견적 관리", href: "/estimates" },
];

export interface HeaderProps {
  /** Server에서 refresh 쿠키로 전달. hydrate 전 깜빡임 방지용 */
  isLogin?: boolean;
  /** Server에서 nickname 쿠키로 전달. hydrate 전 이름 표시용 */
  initialNickname?: string | null;
}

const PROFILE_MENU_ITEMS = [
  { label: "작성 가능한 리뷰", href: APP_ROUTES.REVIEWS.WRITABLE },
  { label: "내가 작성한 리뷰", href: APP_ROUTES.REVIEWS.ME },
] as const;

const Header = ({ isLogin: initialIsLogin, initialNickname = null }: HeaderProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const hasSession = useSyncExternalStore(subscribeAuthSession, hasAuthSession, () => false);

  const user = useAuthStore((state) => state.user);
  const displayName = useAuthStore((state) => state.displayName);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);
  const logout = useAuthStore((state) => state.logout);

  // 경로별로 열린 메뉴를 추적해 pathname 변경 시 별도 setState 없이 자동으로 닫힘
  const [openMenuPath, setOpenMenuPath] = useState<string | null>(null);
  const menuId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const profileMenuRef = useClickOutside<HTMLDivElement>(() => setOpenMenuPath(null));

  const isProfileMenuOpen = openMenuPath === pathname;
  // hydrate 전·checkAuth 중: SSR refresh 쿠키 힌트 유지 (Access 메모리 공백 깜빡임 방지)
  // checkAuth 완료 후: 실제 세션(access) 기준
  const isLogin = !hasHydrated || isCheckingAuth ? Boolean(initialIsLogin) : hasSession;
  const navLinks = isLogin ? LOGGED_IN_LINKS : LOGGED_OUT_LINKS;
  // hydrate/checkAuth 전·SSR 비로그인 힌트면 스켈레톤
  const showAuthSkeleton = (!hasHydrated || isCheckingAuth) && !initialIsLogin;
  const nickname = user?.name ?? displayName ?? initialNickname ?? "닉네임";

  const handleLogout = async () => {
    setOpenMenuPath(null);
    await logout();
    router.replace(APP_ROUTES.LOGIN);
  };
  const notificationPanelId = useId();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const unreadCount = getUnreadNotificationCount(MOCK_NOTIFICATIONS);

  const closeNotification = useCallback(() => {
    setIsNotificationOpen(false);
  }, []);

  const notificationRef = useClickOutside<HTMLDivElement>(closeNotification);

  useEffect(() => {
    if (!isNotificationOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeNotification();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isNotificationOpen, closeNotification]);

  const closeMenu = useCallback(() => {
    setOpenMenuPath(null);
    triggerRef.current?.focus();
  }, []);

  const openMenu = useCallback(() => {
    setOpenMenuPath(pathname);
  }, [pathname]);

  useEffect(() => {
    if (!isProfileMenuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu();
        return;
      }

      if (
        event.key !== "ArrowDown" &&
        event.key !== "ArrowUp" &&
        event.key !== "Home" &&
        event.key !== "End"
      ) {
        return;
      }

      const menuRoot = profileMenuRef.current;
      const target = event.target;
      if (!(target instanceof Node) || !menuRoot?.contains(target)) {
        return;
      }

      event.preventDefault();
      const items = itemRefs.current.filter((item): item is HTMLAnchorElement => item !== null);
      if (items.length === 0) return;

      const activeIndex = items.findIndex((item) => item === document.activeElement);

      if (event.key === "Home") {
        items[0]?.focus();
        return;
      }

      if (event.key === "End") {
        items[items.length - 1]?.focus();
        return;
      }

      if (event.key === "ArrowDown") {
        const nextIndex = activeIndex < 0 ? 0 : (activeIndex + 1) % items.length;
        items[nextIndex]?.focus();
        return;
      }

      const prevIndex = activeIndex <= 0 ? items.length - 1 : activeIndex - 1;
      items[prevIndex]?.focus();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeMenu, isProfileMenuOpen, profileMenuRef]);

  useEffect(() => {
    if (!isProfileMenuOpen) return;
    itemRefs.current[0]?.focus();
  }, [isProfileMenuOpen]);

  return (
    <header className="border-border-subtle bg-background-surface w-full border-b">
      <div className="h-gnb-height-desktop px-gnb-padding-x-desktop flex items-center justify-between py-26">
        <div className="flex items-center gap-80">
          <Link href="/" className="shrink-0">
            <Image src="/icons/logo_full.svg" alt="4roro-moving" width={100} height={37} priority />
          </Link>

          <nav aria-label="주요 메뉴">
            <ul className="flex items-center gap-40">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);

                return (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "transition-colors",
                        isActive ? "text-text-primary" : "text-text-subtle hover:text-text-primary",
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
          <div className="flex items-center gap-20" aria-hidden>
            <div className="bg-background-subtle size-24 animate-pulse rounded-full" />
            <div className="flex items-center gap-20">
              <div className="bg-background-subtle size-36 animate-pulse rounded-full" />
              <div className="bg-background-subtle rounded-4 h-20 w-64 animate-pulse" />
            </div>
          </div>
        ) : isLogin ? (
          <div className="flex items-center gap-20">
            <div ref={notificationRef} className="relative">
              <button
                type="button"
                aria-label={unreadCount > 0 ? `알림, 읽지 않은 알림 ${unreadCount}개` : "알림"}
                aria-expanded={isNotificationOpen}
                aria-controls={isNotificationOpen ? notificationPanelId : undefined}
                className="relative"
                onClick={() => setIsNotificationOpen((prev) => !prev)}
              >
                <AlarmIcon className="text-icon-default size-24" aria-hidden="true" />
                {unreadCount > 0 ? (
                  <Text
                    as="span"
                    variant="xs-semibold"
                    aria-hidden="true"
                    className="bg-status-error text-text-inverse absolute -top-4 -right-6 flex h-16 min-w-16 items-center justify-center rounded-full px-4 leading-none"
                  >
                    {unreadCount}
                  </Text>
                ) : null}
              </button>
              {isNotificationOpen ? (
                <div id={notificationPanelId}>
                  <NotificationPanel onClose={closeNotification} />
                </div>
              ) : null}
            </div>

            <div ref={profileMenuRef} className="relative flex items-center gap-12">
              <button
                ref={triggerRef}
                type="button"
                id={`${menuId}-trigger`}
                aria-label="프로필 메뉴"
                aria-haspopup="menu"
                aria-expanded={isProfileMenuOpen}
                aria-controls={isProfileMenuOpen ? `${menuId}-menu` : undefined}
                className="focus-visible:ring-border-brand rounded-8 flex items-center gap-12 focus-visible:ring-2 focus-visible:outline-none"
                onClick={() => {
                  if (isProfileMenuOpen) {
                    closeMenu();
                  } else {
                    openMenu();
                  }
                }}
              >
                <Image src="/icons/profile-default.svg" alt="" width={36} height={36} />
                <Text as="span" variant="md-medium" className="text-text-primary">
                  {nickname}
                </Text>
              </button>

              {isProfileMenuOpen ? (
                <div
                  id={`${menuId}-menu`}
                  role="menu"
                  aria-labelledby={`${menuId}-trigger`}
                  className="border-border-subtle bg-background-surface shadow-estimate-card rounded-12 absolute top-[calc(100%+8px)] right-0 z-50 flex min-w-[200px] flex-col overflow-hidden border py-8"
                >
                  {PROFILE_MENU_ITEMS.map((item, index) => {
                    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

                    return (
                      <Link
                        key={item.href}
                        ref={(node) => {
                          itemRefs.current[index] = node;
                        }}
                        href={item.href}
                        role="menuitem"
                        tabIndex={-1}
                        aria-current={isActive ? "page" : undefined}
                        className={cn(
                          "hover:bg-background-hover focus-visible:bg-background-hover px-16 py-12 transition-colors focus-visible:outline-none",
                          isActive ? "text-text-brand" : "text-text-primary",
                        )}
                        onClick={() => setOpenMenuPath(null)}
                      >
                        <Text as="span" variant="md-medium">
                          {item.label}
                        </Text>
                      </Link>
                    );
                  })}

                  <div className="border-border-subtle flex w-full items-center justify-center border-t px-12 pt-12 pb-8 md:pt-14">
                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleLogout}
                      className="text-text-muted hover:text-text-secondary transition-colors"
                    >
                      <Text as="span" variant={{ base: "xs-regular", md: "md-medium" }}>
                        로그아웃
                      </Text>
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        ) : (
          <Link
            href={getLoginRedirectPath()}
            className="bg-background-brand text-text-inverse hover:bg-background-brand-hover rounded-8 flex h-40 items-center px-20 transition-colors"
          >
            <Text variant="md-semibold">로그인</Text>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
