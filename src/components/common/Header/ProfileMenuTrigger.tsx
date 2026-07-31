"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";

import { Text } from "@/components/common/Text";
import { useClickOutside } from "@/hooks/useClickOutside";
import type { AuthRole } from "@/lib/auth/role";
import { APP_ROUTES } from "@/lib/constants/appRoutes";
import { cn } from "@/lib/utils/cn";
import { useAuthStore } from "@/stores/useAuthStore";

export type ProfileMenuItem =
  | { type: "link"; label: string; href: string }
  | { type: "action"; label: string; action: "logout" };

interface ProfileMenuTriggerProps {
  nickname: string;
  items: ProfileMenuItem[];
  /** 로그아웃 후 이동 경로 분기용 */
  role?: AuthRole | null;
}

export default function ProfileMenuTrigger({
  nickname,
  items,
  role = null,
}: ProfileMenuTriggerProps) {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  // 경로별로 열린 메뉴를 추적해 pathname 변경 시 별도 setState 없이 자동으로 닫힘
  const [openMenuPath, setOpenMenuPath] = useState<string | null>(null);
  const menuId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<Array<HTMLAnchorElement | HTMLButtonElement | null>>([]);
  const profileMenuRef = useClickOutside<HTMLDivElement>(() => setOpenMenuPath(null));

  const isProfileMenuOpen = openMenuPath === pathname;

  const handleLogout = async () => {
    setOpenMenuPath(null);
    const logoutPath = role === "MOVER" ? APP_ROUTES.MOVER_LOGIN : APP_ROUTES.LOGIN;

    try {
      await logout();
      router.replace(logoutPath);
    } catch {
      router.replace(logoutPath);
    }
  };

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
      const menuItems = itemRefs.current.filter(
        (item): item is HTMLAnchorElement | HTMLButtonElement => item !== null,
      );
      if (menuItems.length === 0) return;

      const activeIndex = menuItems.findIndex((item) => item === document.activeElement);

      if (event.key === "Home") {
        menuItems[0]?.focus();
        return;
      }

      if (event.key === "End") {
        menuItems[menuItems.length - 1]?.focus();
        return;
      }

      if (event.key === "ArrowDown") {
        const nextIndex = activeIndex < 0 ? 0 : (activeIndex + 1) % menuItems.length;
        menuItems[nextIndex]?.focus();
        return;
      }

      const prevIndex = activeIndex <= 0 ? menuItems.length - 1 : activeIndex - 1;
      menuItems[prevIndex]?.focus();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeMenu, isProfileMenuOpen, profileMenuRef]);

  useEffect(() => {
    if (!isProfileMenuOpen) return;
    itemRefs.current[0]?.focus();
  }, [isProfileMenuOpen]);

  return (
    <div ref={profileMenuRef} className="relative flex items-center gap-16">
      <button
        ref={triggerRef}
        type="button"
        id={`${menuId}-trigger`}
        aria-label="프로필 메뉴"
        aria-haspopup="menu"
        aria-expanded={isProfileMenuOpen}
        aria-controls={isProfileMenuOpen ? `${menuId}-menu` : undefined}
        className="focus-visible:ring-border-brand rounded-8 flex items-center gap-16 focus-visible:ring-2 focus-visible:outline-none"
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
          {items.map((item, index) => {
            if (item.type === "action") {
              return (
                <button
                  key={item.action}
                  ref={(node) => {
                    itemRefs.current[index] = node;
                  }}
                  tabIndex={-1}
                  type="button"
                  role="menuitem"
                  className="focus-visible:bg-background-hover text-text-muted hover:text-text-secondary border-border-subtle border-t px-16 py-12 text-center transition-colors focus-visible:outline-none"
                  onClick={handleLogout}
                >
                  <Text as="span" variant="md-medium">
                    {item.label}
                  </Text>
                </button>
              );
            }

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
        </div>
      ) : null}
    </div>
  );
}
