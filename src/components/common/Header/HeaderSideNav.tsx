"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type TransitionEvent } from "react";
import { createPortal } from "react-dom";

import { isNavLinkActive } from "@/components/common/Header/isNavLinkActive";
import { Text } from "@/components/common/Text";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { CloseIcon } from "@/icons";
import { MEDIA_QUERY } from "@/lib/constants/breakpoints";
import { cn } from "@/lib/utils/cn";

export interface HeaderSideNavLink {
  label: string;
  href: string;
}

interface HeaderSideNavProps {
  id: string;
  isOpen: boolean;
  onClose: () => void;
  links: HeaderSideNavLink[];
  /** 프로필 미완료 시 — 링크 대신 표시할 안내 */
  emptyMessage?: string;
}

/** tablet·mobile GNB 사이드 네비게이션 — exit 애니메이션 후 unmount */
const HeaderSideNav = ({ id, isOpen, onClose, links, emptyMessage }: HeaderSideNavProps) => {
  const pathname = usePathname();
  const panelRef = useRef<HTMLElement>(null);
  const [shouldRender, setShouldRender] = useState(false);

  // props 변화에 맞춘 state 조정 (render-time). effect setState 린트 회피
  if (isOpen && !shouldRender) {
    setShouldRender(true);
  }

  useFocusTrap({
    containerRef: panelRef,
    enabled: isOpen && shouldRender,
    onEscape: onClose,
  });

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const mediaQuery = window.matchMedia(MEDIA_QUERY.xl);

    const handleBreakpointChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        onClose();
      }
    };

    if (mediaQuery.matches) {
      onClose();
      return;
    }

    mediaQuery.addEventListener("change", handleBreakpointChange);

    return () => {
      mediaQuery.removeEventListener("change", handleBreakpointChange);
    };
  }, [isOpen, onClose]);

  // 모바일 화면에서 주요 메뉴 열림 시 body overflow 조정
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  const handlePanelTransitionEnd = (event: TransitionEvent<HTMLElement>) => {
    if (event.target !== event.currentTarget) return;
    if (event.propertyName !== "transform") return;
    if (isOpen) return;

    setShouldRender(false);
  };

  if (typeof document === "undefined" || !shouldRender) {
    return null;
  }

  return createPortal(
    <>
      <button
        type="button"
        aria-label="메뉴 닫기"
        tabIndex={isOpen ? 0 : -1}
        className={cn(
          "bg-overlay-scrim fixed inset-0 z-[9999] transition-opacity duration-200 xl:hidden",
          "starting:opacity-0",
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
      />

      <aside
        ref={panelRef}
        id={id}
        role="dialog"
        aria-modal="true"
        aria-label="주요 메뉴"
        aria-hidden={!isOpen}
        tabIndex={-1}
        onTransitionEnd={handlePanelTransitionEnd}
        className={cn(
          "bg-background-surface fixed inset-y-0 right-0 z-[10000] flex w-[220px] flex-col transition-transform duration-200 ease-out focus:outline-none xl:hidden",
          "starting:translate-x-full",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="border-border-subtle flex h-54 shrink-0 items-center justify-end border-b px-16 py-10">
          <button
            type="button"
            aria-label="메뉴 닫기"
            className="text-icon-default focus-visible:ring-border-brand rounded-4 flex size-24 items-center justify-center focus-visible:ring-2 focus-visible:outline-none"
            onClick={onClose}
          >
            <CloseIcon aria-hidden="true" className="size-24" />
          </button>
        </div>

        <nav aria-label="모바일 주요 메뉴">
          {emptyMessage ? (
            <Text as="p" variant="lg-medium" className="text-text-subtle px-20 py-24">
              {emptyMessage}
            </Text>
          ) : (
            <ul className="flex flex-col items-start">
              {links.map((link) => {
                const isActive = isNavLinkActive(pathname, link.href);

                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "flex w-[220px] items-center overflow-hidden px-20 py-24 transition-colors",
                        isActive
                          ? "text-text-primary"
                          : "text-text-primary hover:bg-background-hover",
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
          )}
        </nav>
      </aside>
    </>,
    document.body,
  );
};

export default HeaderSideNav;
