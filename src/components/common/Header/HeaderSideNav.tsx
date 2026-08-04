"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";

import { Text } from "@/components/common/Text";
import { CloseIcon } from "@/icons";
import { APP_ROUTES } from "@/lib/constants/appRoutes";
import { cn } from "@/lib/utils/cn";

export interface HeaderSideNavLink {
  label: string;
  href: string;
}

interface HeaderSideNavProps {
  isOpen: boolean;
  onClose: () => void;
  links: HeaderSideNavLink[];
}

const DESKTOP_MEDIA_QUERY = "(min-width: 1024px)";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

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

/** tablet·mobile GNB 사이드 네비게이션 (오른쪽 슬라이드) */
const HeaderSideNav = ({ isOpen, onClose, links }: HeaderSideNavProps) => {
  const pathname = usePathname();
  const titleId = useId();
  const panelRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const mediaQuery = window.matchMedia(DESKTOP_MEDIA_QUERY);
    const handleDesktopChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        onClose();
      }
    };

    if (mediaQuery.matches) {
      onClose();
      return;
    }

    mediaQuery.addEventListener("change", handleDesktopChange);
    return () => mediaQuery.removeEventListener("change", handleDesktopChange);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab" || !panelRef.current) {
        return;
      }

      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      ).filter((element) => !element.hasAttribute("disabled") && element.tabIndex !== -1);

      if (focusable.length === 0) {
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last?.focus();
        return;
      }

      if (!event.shiftKey && active === last) {
        event.preventDefault();
        first?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (typeof document === "undefined" || !isOpen) {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-[100] lg:hidden" role="presentation">
      <button
        type="button"
        className="bg-overlay-scrim absolute inset-0"
        aria-label="메뉴 닫기"
        onClick={onClose}
      />

      <nav
        ref={panelRef}
        className="bg-background-surface absolute inset-y-0 right-0 flex w-[220px] flex-col"
        aria-labelledby={titleId}
        aria-modal="true"
        role="dialog"
      >
        <div className="border-border-subtle h-gnb-height-mobile flex items-center justify-end border-b px-16 py-10">
          <h2 id={titleId} className="sr-only">
            메뉴
          </h2>
          <button
            ref={closeButtonRef}
            type="button"
            aria-label="메뉴 닫기"
            className="text-icon-default focus-visible:ring-border-brand rounded-4 flex size-24 items-center justify-center focus-visible:ring-2 focus-visible:outline-none"
            onClick={onClose}
          >
            <CloseIcon aria-hidden="true" className="size-24" />
          </button>
        </div>

        <ul className="flex flex-col">
          {links.map((link) => {
            const isActive = isNavLinkActive(pathname, link.href);

            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "flex items-center px-20 py-24 transition-colors",
                    isActive
                      ? "text-nav-text-active"
                      : "text-text-primary hover:text-nav-text-active",
                  )}
                  onClick={onClose}
                >
                  <Text as="span" variant="lg-medium">
                    {link.label}
                  </Text>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>,
    document.body,
  );
};

export default HeaderSideNav;
