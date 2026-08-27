"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState, type FocusEvent } from "react";
import { useTranslations } from "next-intl";

import ProfileAvatar from "@/components/common/ProfileAvatar/ProfileAvatar";
import { Skeleton } from "@/components/common/Skeleton/Skeleton";
import { Text } from "@/components/common/Text";
import Toast from "@/components/common/Toast/Toast";
import { useClickOutside } from "@/hooks/useClickOutside";
import { usePresence } from "@/hooks/usePresence";
import { sanitizeSoftUxProfileImageUrl } from "@/lib/auth/profileImage";
import type { AuthRole } from "@/lib/auth/role";
import { isPublicPath } from "@/lib/auth/redirect";
import { APP_ROUTES } from "@/lib/constants/appRoutes";
import { cn } from "@/lib/utils/cn";
import { DROPDOWN_EXIT_DURATION_MS, dropdownMotionClassName } from "@/lib/utils/uiMotion";
import { useAuthStore } from "@/stores/useAuthStore";

const HEADER_PROFILE_AVATAR_CLASSNAME = "bg-background-muted rounded-100 size-24 xl:size-36";
const HEADER_PROFILE_SKELETON_CLASSNAME = "size-24 rounded-full xl:size-36";

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
  isAvatarPending?: boolean;
}

export default function ProfileMenuTrigger({
  nickname,
  items,
  role = null,
  imageUrl,
  isAvatarPending,
}: ProfileMenuTriggerProps) {
  const t = useTranslations("auth");
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const safeImageUrl = sanitizeSoftUxProfileImageUrl(imageUrl);

  const [menuOpenForPath, setMenuOpenForPath] = useState<string | null>(null);
  const isOpen = menuOpenForPath === pathname;
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const { isRendered: isMenuRendered, isVisible: isMenuVisible } = usePresence(
    isOpen,
    DROPDOWN_EXIT_DURATION_MS,
  );
  const menuId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const linkItems = items.filter((item) => item.type === "link");
  const logoutItem = items.find((item) => item.type === "action" && item.action === "logout");
  const nicknameSuffix = role === "MOVER" ? t("moverSuffix") : t("customerSuffix");

  const restoreTriggerFocusIfNeeded = () => {
    const active = document.activeElement;
    if (active instanceof HTMLElement && menuRef.current?.contains(active)) {
      triggerRef.current?.focus();
    }
  };

  const closeQuiet = useCallback(() => {
    // aria-hidden 적용 전에 포커스를 메뉴 밖으로 이동
    restoreTriggerFocusIfNeeded();
    setMenuOpenForPath(null);
  }, []);

  const closeWithFocus = useCallback(() => {
    triggerRef.current?.focus();
    setMenuOpenForPath(null);
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
    triggerRef.current?.focus();
    setMenuOpenForPath(null);

    const isPublicPage = isPublicPath(pathname);
    const logoutPath = role === "MOVER" ? APP_ROUTES.MOVER_LOGIN : APP_ROUTES.LOGIN;

    if (isPublicPage) {
      try {
        await logout();
      } catch {
        setToastMessage(t("logoutFailed"));
      }
      router.refresh();
      return;
    }

    // hard navigate 직전: deferUiClear로 비로그인 UI paint를 건너뜀
    // API 실패여도 로컬 세션 정리 후 로그인 페이지로 이동
    try {
      await logout({ deferUiClear: true });
    } catch {
      setToastMessage(t("logoutFailed"));
    }
    window.location.assign(logoutPath);
  };

  return (
    <div
      ref={containerRef}
      className="relative flex items-center xl:gap-16"
      onBlur={handleContainerBlur}
    >
      {toastMessage ? <Toast onClose={() => setToastMessage(null)}>{toastMessage}</Toast> : null}
      <button
        ref={triggerRef}
        type="button"
        id={`${menuId}-trigger`}
        aria-label={t("profileMenu")}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={isOpen ? `${menuId}-menu` : undefined}
        className="focus-visible:ring-border-brand rounded-8 flex items-center focus-visible:ring-2 focus-visible:outline-none xl:gap-16"
        onClick={() => setMenuOpenForPath((current) => (current === pathname ? null : pathname))}
      >
        {isAvatarPending ? (
          <Skeleton className={HEADER_PROFILE_SKELETON_CLASSNAME} />
        ) : (
          <ProfileAvatar
            imageUrl={safeImageUrl}
            className={HEADER_PROFILE_AVATAR_CLASSNAME}
            sizes="36px"
          />
        )}
        <Text as="span" variant="2lg-medium" className="text-text-primary hidden xl:block">
          {nickname}
        </Text>
      </button>

      {isMenuRendered ? (
        <div
          ref={menuRef}
          id={`${menuId}-menu`}
          role="menu"
          inert={!isMenuVisible ? true : undefined}
          aria-labelledby={`${menuId}-trigger`}
          className={cn(
            "border-border-default bg-background-surface shadow-profile-menu rounded-16 absolute top-[calc(100%+18px)] right-0 z-50 flex w-62 flex-col items-start border px-4 pt-16 pb-6",
            dropdownMotionClassName(isMenuVisible),
          )}
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
                    onClick={closeWithFocus}
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
