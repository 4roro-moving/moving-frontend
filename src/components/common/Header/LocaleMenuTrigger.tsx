"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState, type FocusEvent } from "react";

import { Text } from "@/components/common/Text";
import { useClickOutside } from "@/hooks/useClickOutside";
import { resolveLocale, SUPPORTED_LOCALES, type Locale } from "@/i18n/config";
import { setLocaleCookie } from "@/i18n/localeCookie";
import { ChevronDownIcon } from "@/icons";
import { cn } from "@/lib/utils/cn";
import { DROPDOWN_EXIT_DURATION_MS, dropdownMotionClassName } from "@/lib/utils/uiMotion";
import { usePresence } from "@/hooks/usePresence";

type LocaleMenuTriggerVariant = "header" | "side-nav";

interface LocaleMenuTriggerProps {
  variant?: LocaleMenuTriggerVariant;
  className?: string;
}

export default function LocaleMenuTrigger({
  variant = "header",
  className,
}: LocaleMenuTriggerProps) {
  const locale = resolveLocale(useLocale());
  const t = useTranslations("locale");
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { isRendered: isMenuRendered, isVisible: isMenuVisible } = usePresence(
    isOpen,
    DROPDOWN_EXIT_DURATION_MS,
  );
  const menuId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const closeQuiet = useCallback(() => setIsOpen(false), []);
  const closeWithFocus = useCallback(() => {
    setIsOpen(false);
    triggerRef.current?.focus();
  }, []);
  const containerRef = useClickOutside<HTMLDivElement>(closeQuiet);

  useEffect(() => {
    if (!isOpen) return;

    menuRef.current?.querySelector<HTMLElement>('[role="menuitemradio"]')?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeWithFocus();
        return;
      }

      if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;

      const menuItems = Array.from(
        menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitemradio"]') ?? [],
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

    requestAnimationFrame(() => {
      if (!containerRef.current?.contains(document.activeElement)) {
        closeQuiet();
      }
    });
  };

  const handleLocaleChange = (nextLocale: Locale) => {
    if (nextLocale === locale) {
      closeWithFocus();
      return;
    }

    setLocaleCookie(nextLocale);
    setIsOpen(false);
    router.refresh();
  };

  const currentLocaleName = t(`names.${locale}`);
  const isSideNav = variant === "side-nav";

  return (
    <div ref={containerRef} className={cn("relative", className)} onBlur={handleContainerBlur}>
      <button
        ref={triggerRef}
        type="button"
        id={`${menuId}-trigger`}
        aria-label={t("select")}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={isOpen ? `${menuId}-menu` : undefined}
        className={cn(
          "focus-visible:ring-border-brand transition-colors focus-visible:ring-2 focus-visible:outline-none",
          isSideNav
            ? "hover:bg-background-hover flex w-full items-center justify-between px-20 py-16"
            : "text-text-secondary hover:text-text-primary rounded-8 flex h-36 items-center gap-6 px-8",
        )}
        onClick={() => setIsOpen((open) => !open)}
      >
        {isSideNav ? (
          <span className="flex flex-col items-start gap-4">
            <Text as="span" variant="xs-medium" className="text-text-muted">
              {t("label")}
            </Text>
            <Text as="span" variant="lg-medium" className="text-text-primary">
              {currentLocaleName}
            </Text>
          </span>
        ) : (
          <Text as="span" variant="md-medium">
            {currentLocaleName}
          </Text>
        )}
        <ChevronDownIcon aria-hidden="true" className="text-icon-muted size-16" />
      </button>

      {isMenuRendered ? (
        <div
          ref={menuRef}
          id={`${menuId}-menu`}
          role="menu"
          inert={!isMenuVisible ? true : undefined}
          aria-labelledby={`${menuId}-trigger`}
          className={cn(
            "border-border-default bg-background-surface shadow-profile-menu z-50 flex min-w-120 flex-col border p-4",
            dropdownMotionClassName(isMenuVisible),
            isSideNav
              ? "rounded-12 absolute right-12 bottom-[calc(100%+4px)] left-12"
              : "rounded-12 absolute top-[calc(100%+8px)] right-0",
          )}
        >
          {SUPPORTED_LOCALES.map((supportedLocale) => (
            <button
              key={supportedLocale}
              type="button"
              role="menuitemradio"
              tabIndex={-1}
              aria-checked={locale === supportedLocale}
              className={cn(
                "hover:bg-background-hover focus-visible:bg-background-hover rounded-8 flex w-full items-center px-12 py-10 text-left focus-visible:outline-none",
                locale === supportedLocale ? "text-text-brand" : "text-text-secondary",
              )}
              onClick={() => handleLocaleChange(supportedLocale)}
            >
              <Text as="span" variant="md-medium">
                {t(`names.${supportedLocale}`)}
              </Text>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
