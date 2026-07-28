"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useState } from "react";

import HeaderProfileMenu from "@/components/common/Header/HeaderProfileMenu";
import { Text } from "@/components/common/Text";
import { useClickOutside } from "@/hooks/useClickOutside";
import { AlarmIcon } from "@/icons";
import { APP_ROUTES } from "@/lib/constants/appRoutes";
import { cn } from "@/lib/utils/cn";
import { useAuthStore } from "@/stores/useAuthStore";

const LOGGED_OUT_LINKS = [{ label: "기사님 찾기", href: APP_ROUTES.MOVERS }];

const LOGGED_IN_LINKS = [
  { label: "견적 요청", href: APP_ROUTES.ESTIMATE_REQUEST },
  { label: "기사님 찾기", href: APP_ROUTES.MOVERS },
  { label: "내 견적 관리", href: "/estimates" },
];

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const logout = useAuthStore((state) => state.logout);
  // hydrate 전에는 스켈레톤 — SSR/CSR 동일 (잘못된 로그인 UI 깜빡임 방지)
  const isLogin = hasHydrated && isAuthenticated;
  const navLinks = isLogin ? LOGGED_IN_LINKS : LOGGED_OUT_LINKS;

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const closeProfileMenu = useCallback(() => {
    setIsProfileMenuOpen(false);
  }, []);

  const profileMenuRef = useClickOutside<HTMLDivElement>(closeProfileMenu);

  const handleLogout = async () => {
    closeProfileMenu();
    await logout();
    router.replace(APP_ROUTES.LOGIN);
  };

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

        {!hasHydrated ? (
          // 임시: cookie SSR 전 — SSR/CSR 동일 스켈레톤 (잘못된 로그인 UI 깜빡임 방지)
          <div className="flex items-center gap-20" aria-hidden>
            <div className="bg-background-subtle size-24 animate-pulse rounded-full" />
            <div className="flex items-center gap-20">
              <div className="bg-background-subtle size-36 animate-pulse rounded-full" />
              <div className="bg-background-subtle rounded-4 h-20 w-64 animate-pulse" />
            </div>
          </div>
        ) : isLogin ? (
          <div className="flex items-center gap-20">
            <button type="button" aria-label="알림">
              <AlarmIcon className="text-icon-default size-24" />
            </button>

            <div ref={profileMenuRef} className="relative flex items-center gap-20">
              <button
                type="button"
                aria-label="마이페이지 메뉴"
                aria-haspopup="menu"
                aria-expanded={isProfileMenuOpen}
                onClick={() => setIsProfileMenuOpen((prev) => !prev)}
                className="flex items-center gap-20"
              >
                <Image src="/icons/profile-default.svg" alt="" width={36} height={36} />
                <Text as="span" variant="md-medium" className="text-text-primary">
                  {user?.name ?? "닉네임"}
                </Text>
              </button>

              {isProfileMenuOpen ? (
                <HeaderProfileMenu
                  userName={user?.name ?? "닉네임"}
                  onLogout={() => {
                    void handleLogout();
                  }}
                  onNavigate={closeProfileMenu}
                />
              ) : null}
            </div>
          </div>
        ) : (
          <Link
            href={APP_ROUTES.LOGIN}
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
