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
      className="bg-background-default border-border-subtle flex h-[var(--tab-height-desktop)] w-full items-end border-b border-solid px-[var(--tab-padding-x-desktop)] shadow-[0_2px_5px_0_rgba(248,248,248,0.1)]"
    >
      <div className="flex h-full flex-1 items-end gap-32 pt-16">
        {TABS.map((tab) => {
          const isActive = pathname === tab.href || pathname.startsWith(`${tab.href}/`);

          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex h-64 shrink-0 items-center",
                isActive && "border-b-2 border-solid border-[var(--nav-indicator-active)]",
              )}
            >
              <Text
                as="span"
                variant="xl-semibold"
                className={
                  isActive
                    ? "text-[color:var(--nav-text-active)]"
                    : "text-[color:var(--nav-text-default)]"
                }
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
