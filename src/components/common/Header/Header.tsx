"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useState } from "react";

import NotificationPanel from "@/components/common/Header/NotificationPanel";
import { Text } from "@/components/common/Text";
import { useClickOutside } from "@/hooks/useClickOutside";
import { AlarmIcon } from "@/icons";
import { APP_ROUTES } from "@/lib/constants/appRoutes";
import { getUnreadNotificationCount, MOCK_NOTIFICATIONS } from "@/lib/mocks/notifications.mock";
import { cn } from "@/lib/utils/cn";

export interface HeaderProps {
  /** TODO: auth 연동 전 임시 prop. 추후 대체 */
  isLogin?: boolean;
}

const LOGGED_OUT_LINKS = [{ label: "기사님 찾기", href: "/movers" }];

const LOGGED_IN_LINKS = [
  { label: "견적 요청", href: "/estimate-request" },
  { label: "기사님 찾기", href: "/movers" },
  { label: "내 견적 관리", href: "/estimates" },
];

const Header = ({ isLogin = false }: HeaderProps) => {
  const pathname = usePathname();
  const navLinks = isLogin ? LOGGED_IN_LINKS : LOGGED_OUT_LINKS;
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
                      <Text variant="md-bold">{link.label}</Text>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {isLogin ? (
          <div className="flex items-center gap-20">
            <div ref={notificationRef} className="relative">
              <button
                type="button"
                aria-label={unreadCount > 0 ? `알림, 읽지 않은 알림 ${unreadCount}개` : "알림"}
                aria-expanded={isNotificationOpen}
                aria-controls={notificationPanelId}
                className="relative"
                onClick={() => setIsNotificationOpen((prev) => !prev)}
              >
                <AlarmIcon className="text-icon-default size-24" aria-hidden="true" />
                {unreadCount > 0 ? (
                  <span
                    aria-hidden="true"
                    className="bg-status-error text-text-inverse absolute -top-4 -right-6 flex h-16 min-w-16 items-center justify-center rounded-full px-4 text-[length:var(--font-size-12)] leading-none font-semibold"
                  >
                    {unreadCount}
                  </span>
                ) : null}
              </button>
              {isNotificationOpen ? (
                <div id={notificationPanelId}>
                  <NotificationPanel onClose={closeNotification} />
                </div>
              ) : null}
            </div>
            <button type="button" aria-label="프로필">
              <Image src="/icons/profile-default.svg" alt="" width={36} height={36} />
            </button>
            {/* TODO: 프로필 기능 연동 전까지 닉네임 placeholder */}
            <button type="button" className="text-text-primary">
              <Text variant="md-medium">닉네임</Text>
            </button>
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
