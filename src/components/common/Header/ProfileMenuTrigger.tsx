"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState, type FocusEvent } from "react";

import { Text } from "@/components/common/Text";
import { useClickOutside } from "@/hooks/useClickOutside";
import type { AuthRole } from "@/lib/auth/role";
import { isPublicPath } from "@/lib/auth/redirect";
import { APP_ROUTES } from "@/lib/constants/appRoutes";
import { cn } from "@/lib/utils/cn";
import { useAuthStore } from "@/stores/useAuthStore";

export type ProfileMenuItem =
  | { type: "link"; label: string; href: string }
  | { type: "action"; label: string; action: "logout" };

const LINK_ITEM_CLASS =
  "hover:bg-background-hover focus-visible:bg-background-hover flex w-full items-center py-14 pr-12 pl-24 transition-colors focus-visible:outline-none";

interface ProfileMenuTriggerProps {
  nickname: string;
  items: ProfileMenuItem[];
  /** 로그아웃 후 이동 경로 분기용 */
  role?: AuthRole | null;
  imageUrl?: string | null;
}

export default function ProfileMenuTrigger({
  nickname,
  items,
  role = null,
  imageUrl,
}: ProfileMenuTriggerProps) {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  const [isOpen, setIsOpen] = useState(false);
  const menuId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const linkItems = items.filter((item) => item.type === "link");
  const logoutItem = items.find((item) => item.type === "action" && item.action === "logout");
  const nicknameSuffix = role === "MOVER" ? "기사님" : "고객님";

  const closeQuiet = useCallback(() => setIsOpen(false), []);
  const closeWithFocus = useCallback(() => {
    setIsOpen(false);
    triggerRef.current?.focus();
  }, []);

  const containerRef = useClickOutside<HTMLDivElement>(closeQuiet);

  useEffect(() => {
    if (!isOpen) return;

    menuRef.current?.querySelector<HTMLElement>('[role="menuitem"]')?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeWithFocus();
        return;
      }

      if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;

      const menuItems = Array.from(
        menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? [],
      );
      if (menuItems.length === 0) return;

      event.preventDefault();
      const index = menuItems.findIndex((item) => item === document.activeElement);

      if (event.key === "Home") menuItems[0]?.focus();
      else if (event.key === "End") menuItems[menuItems.length - 1]?.focus();
      else if (event.key === "ArrowDown") menuItems[(index + 1) % menuItems.length]?.focus();
      else menuItems[(index <= 0 ? menuItems.length : index) - 1]?.focus();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, closeWithFocus]);

  const handleContainerBlur = (event: FocusEvent<HTMLDivElement>) => {
    const nextTarget = event.relatedTarget;
    if (nextTarget instanceof Node && event.currentTarget.contains(nextTarget)) {
      return;
    }

    // relatedTarget이 null인 브라우저가 있어, 다음 프레임에 실제 포커스 위치로 판별
    requestAnimationFrame(() => {
      if (!containerRef.current?.contains(document.activeElement)) {
        closeQuiet();
      }
    });
  };

  const handleLogout = async () => {
    setIsOpen(false);

    const isPublicPage = isPublicPath(pathname);
    const logoutPath = role === "MOVER" ? APP_ROUTES.MOVER_LOGIN : APP_ROUTES.LOGIN;

    await logout();

    if (isPublicPage) {
      router.refresh();
      return;
    }

    router.replace(logoutPath);
  };

  return (
    <div
      ref={containerRef}
      className="relative flex items-center xl:gap-16"
      onBlur={handleContainerBlur}
    >
      <button
        ref={triggerRef}
        type="button"
        id={`${menuId}-trigger`}
        aria-label="프로필 메뉴"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={isOpen ? `${menuId}-menu` : undefined}
        className="focus-visible:ring-border-brand rounded-8 flex items-center focus-visible:ring-2 focus-visible:outline-none xl:gap-16"
        onClick={() => setIsOpen((open) => !open)}
      >
        {imageUrl ? (
          <div className="rounded-100 overflow-hidden">
            <Image
              src={imageUrl}
              alt=""
              width={36}
              height={36}
              className="rounded-4 size-24 xl:size-36 xl:rounded-none"
            />
          </div>
        ) : (
          <Image
            src="/icons/profile-default.svg"
            alt=""
            width={36}
            height={36}
            className="rounded-4 size-24 xl:size-36 xl:rounded-none"
          />
        )}
        <Text as="span" variant="2lg-medium" className="text-text-primary hidden xl:block">
          {nickname}
        </Text>
      </button>

      {isOpen ? (
        <div
          ref={menuRef}
          id={`${menuId}-menu`}
          role="menu"
          aria-labelledby={`${menuId}-trigger`}
          className="border-border-default bg-background-surface shadow-profile-menu rounded-16 absolute top-[calc(100%+18px)] right-0 z-50 flex w-[248px] flex-col items-start border px-4 pt-16 pb-6"
        >
          <div className="flex w-full items-center py-14 pr-12 pl-24">
            <Text as="p" variant="2lg-bold" className="text-text-secondary">
              {nickname} {nicknameSuffix}
            </Text>
          </div>

          <div className="flex w-full flex-col items-center gap-10">
            <div className="flex w-full flex-col">
              {linkItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    role="menuitem"
                    tabIndex={-1}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      LINK_ITEM_CLASS,
                      isActive ? "text-text-brand" : "text-text-secondary",
                    )}
                    onClick={closeQuiet}
                  >
                    <Text as="span" variant="lg-medium">
                      {item.label}
                    </Text>
                  </Link>
                );
              })}
            </div>

            {logoutItem ? (
              <button
                type="button"
                role="menuitem"
                tabIndex={-1}
                className="border-border-subtle hover:text-text-secondary focus-visible:bg-background-hover text-text-muted flex w-full items-center justify-center border-t px-12 pt-14 pb-8 transition-colors focus-visible:outline-none"
                onClick={handleLogout}
              >
                <Text as="span" variant="md-medium">
                  {logoutItem.label}
                </Text>
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
