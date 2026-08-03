"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Text } from "@/components/common/Text";
import { cn } from "@/lib/utils/cn";

export interface NavigationTabItem {
  href: string;
  label: string;
  match?: "exact" | "prefix";
}

interface NavigationTabsProps {
  ariaLabel: string;
  items: readonly NavigationTabItem[];
  className?: string;
}

export default function NavigationTabs({ ariaLabel, items, className }: NavigationTabsProps) {
  const pathname = usePathname();

  return (
    <nav
      aria-label={ariaLabel}
      className={cn(
        "bg-background-default border-border-subtle shadow-tab px-margin-mobile h-tab-height-mobile md:px-margin-tablet xl:h-tab-height-desktop xl:px-tab-padding-x-desktop flex w-full items-end overflow-x-auto border-b",
        className,
      )}
    >
      <div className="flex h-full min-w-max items-end gap-24 xl:gap-32">
        {items.map((item) => {
          const isActive =
            item.match === "exact"
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex h-full shrink-0 items-center whitespace-nowrap xl:h-64",
                isActive && "border-nav-indicator-active border-b-2",
              )}
            >
              <Text
                as="span"
                variant={isActive ? "md-bold" : "md-semibold"}
                className={cn(
                  "xl:text-[length:var(--font-size-20)] xl:leading-[var(--line-height-32)] xl:font-semibold",
                  isActive ? "text-nav-text-active" : "text-nav-text-default",
                )}
              >
                {item.label}
              </Text>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
