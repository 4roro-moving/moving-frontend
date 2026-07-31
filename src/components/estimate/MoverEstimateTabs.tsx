"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Text } from "@/components/common/Text";
import { APP_ROUTES } from "@/lib/constants/appRoutes";
import { cn } from "@/lib/utils/cn";

const TABS = [
  { href: APP_ROUTES.MOVER_ESTIMATES.SENT, label: "보낸 견적 조회" },
  { href: APP_ROUTES.MOVER_ESTIMATES.REJECTED, label: "반려 요청" },
] as const;

export default function MoverEstimateTabs() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="기사님 내 견적 관리"
      className="bg-background-default border-border-subtle px-margin-mobile md:px-margin-tablet h-tab-height-mobile md:h-tab-height-tablet lg:h-tab-height-desktop lg:px-tab-padding-x-desktop flex w-full items-end border-b shadow-[0_2px_5px_0_rgba(248,248,248,0.1)]"
    >
      <div className="flex h-full items-end gap-24 lg:gap-32">
        {TABS.map((tab) => {
          const isActive = pathname === tab.href;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex h-full items-center",
                isActive && "border-nav-indicator-active border-b-2",
              )}
            >
              <Text
                as="span"
                variant={{ base: isActive ? "md-bold" : "md-semibold", lg: "xl-semibold" }}
                className={isActive ? "text-text-primary" : "text-text-subtle"}
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
