"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Text } from "@/components/common/Text";
import { cn } from "@/lib/utils/cn";

const TABS = [
  { href: "/estimates/pending", label: "대기 중인 견적" },
  { href: "/estimates/received", label: "받았던 견적" },
] as const;

export default function MyEstimateTabs() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="내 견적 관리"
      // 2026.07.24 정슬기 - [수정] Figma Tablet/Mobile 탭 높이·여백 반영 (Desktop lg 유지)
      className="bg-background-default border-border-subtle px-margin-mobile md:px-margin-tablet flex h-[var(--tab-height-mobile)] w-full items-end border-b shadow-[0_2px_5px_0_rgba(248,248,248,0.1)] md:h-[var(--tab-height-tablet)] lg:h-[var(--tab-height-desktop)] lg:px-[var(--tab-padding-x-desktop)]"
    >
      <div className="flex h-full flex-1 items-end gap-16 pt-8 md:gap-24 md:pt-12 lg:gap-32 lg:pt-16">
        {TABS.map((tab) => {
          const isActive = pathname === tab.href || pathname.startsWith(`${tab.href}/`);

          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex h-40 shrink-0 items-center md:h-48 lg:h-64",
                isActive && "border-b-2 border-[var(--nav-indicator-active)]",
              )}
            >
              <Text
                as="span"
                variant="lg-semibold"
                className={cn(
                  "lg:text-[length:var(--font-size-20)] lg:leading-[var(--line-height-32)]",
                  isActive ? "text-text-primary" : "text-text-subtle",
                )}
              >
                {tab.label}
              </Text>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
