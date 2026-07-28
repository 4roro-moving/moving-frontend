"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Text } from "@/components/common/Text";
import { APP_ROUTES } from "@/lib/constants/appRoutes";
import { cn } from "@/lib/utils/cn";

const TABS = [
  { href: APP_ROUTES.REVIEWS.WRITABLE, label: "작성 가능한 리뷰" },
  { href: APP_ROUTES.REVIEWS.ME, label: "내가 작성한 리뷰" },
] as const;

// 2026.07.27 정슬기 - [추가] 리뷰 관리 탭 (견적 MyEstimateTabs 패턴)
export default function ReviewTabs() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="리뷰 관리"
      className="bg-background-default border-border-subtle shadow-tab px-margin-mobile md:px-margin-tablet h-tab-height-mobile md:h-tab-height-tablet lg:h-tab-height-desktop lg:px-tab-padding-x-desktop flex w-full items-end overflow-x-auto border-b"
    >
      <div className="flex h-full min-w-0 flex-1 items-end gap-16 pt-8 md:gap-24 md:pt-12 lg:gap-32 lg:pt-16">
        {TABS.map((tab) => {
          const isActive = pathname === tab.href || pathname.startsWith(`${tab.href}/`);
          const labelColor = isActive ? "text-text-primary" : "text-text-subtle";

          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex h-40 shrink-0 items-center whitespace-nowrap md:h-48 lg:h-64",
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
