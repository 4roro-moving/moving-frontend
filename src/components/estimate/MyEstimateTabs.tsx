"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Text } from "@/components/common/Text";
import { cn } from "@/lib/utils/cn";

const TABS = [
  { href: "/estimates/pending", label: "대기 중인 견적" },
  { href: "/estimates/received", label: "받았던 견적" },
  { href: "/estimates/requests", label: "보낸 견적 요청" },
] as const;

export default function MyEstimateTabs() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="내 견적 관리"
      // 2026.07.24 정슬기 - [수정] Figma Tablet/Mobile 탭 높이·여백 반영 (Desktop lg 유지)
      // 2026.07.24 정슬기 - [수정] tab height/padding·nav indicator를 디자인 토큰 유틸로 교체
      className="bg-background-default border-border-subtle px-margin-mobile md:px-margin-tablet h-tab-height-mobile md:h-tab-height-tablet lg:h-tab-height-desktop lg:px-tab-padding-x-desktop flex w-full items-end border-b shadow-[0_2px_5px_0_rgba(248,248,248,0.1)]"
    >
      <div className="flex h-full flex-1 items-end gap-16 pt-8 md:gap-24 md:pt-12 lg:gap-32 lg:pt-16">
        {TABS.map((tab) => {
          const isActive = pathname === tab.href || pathname.startsWith(`${tab.href}/`);
          const labelColor = isActive ? "text-text-primary" : "text-text-subtle";

          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex h-40 shrink-0 items-center md:h-48 lg:h-64",
                isActive && "border-nav-indicator-active border-b-2",
              )}
            >
              <Text as="span" variant="lg-semibold" className={cn("lg:hidden", labelColor)}>
                {tab.label}
              </Text>
              <Text as="span" variant="xl-semibold" className={cn("hidden lg:inline", labelColor)}>
                {tab.label}
              </Text>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
