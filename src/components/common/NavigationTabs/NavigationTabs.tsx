"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Text } from "@/components/common/Text";
import { cn } from "@/lib/utils/cn";

export interface NavigationTabItem {
  /** 탭 클릭 시 이동할 경로 */
  href: string;
  /** 탭에 표시할 텍스트 */
  label: string;
  /** exact는 경로가 완전히 같을 때만, prefix는 하위 경로에서도 활성화 */
  match?: "exact" | "prefix";
}

export interface NavigationTabsProps {
  /** 탭 목록의 용도를 설명하는 nav 접근성 이름 */
  ariaLabel: string;
  /** href, label과 경로 매칭 방식을 정의하는 탭 목록 */
  items: readonly NavigationTabItem[];
  /** 탭 영역의 레이아웃이나 스타일을 확장하는 클래스 */
  className?: string;
}

export default function NavigationTabs({ ariaLabel, items, className }: NavigationTabsProps) {
  const pathname = usePathname();

  return (
    <nav
      aria-label={ariaLabel}
      className={cn(
        "bg-background-default border-border-subtle shadow-tab h-tab-height-mobile xl:h-tab-height-desktop w-full overflow-x-auto border-b",
        className,
      )}
    >
      <div className="px-margin-mobile md:px-margin-tablet mx-auto h-full w-full max-w-(--container-desktop) xl:px-0">
        <div className="flex h-full items-center gap-24 md:gap-32 xl:gap-40">
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
                  "relative flex h-full shrink-0 items-center whitespace-nowrap xl:h-64",
                  isActive &&
                    "after:bg-nav-indicator-active after:absolute after:right-0 after:bottom-0 after:left-0 after:h-2",
                )}
              >
                <Text
                  as="span"
                  variant={isActive ? "md-bold" : "md-semibold"}
                  className={cn(
                    "xl:text-(length:--font-size-20) xl:leading-[var(--line-height-32)] xl:font-semibold",
                    isActive ? "text-nav-text-active" : "text-nav-text-default",
                  )}
                >
                  {item.label}
                </Text>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
