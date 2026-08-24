"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Text } from "@/components/common/Text";
import { APP_ROUTES } from "@/lib/constants/appRoutes";
import { cn } from "@/lib/utils/cn";

const SUPPORT_LINKS = [
  {
    label: "공지사항",
    href: APP_ROUTES.NOTICES.ROOT,
  },
  {
    label: "자주 묻는 질문",
    href: APP_ROUTES.FAQS.ROOT,
  },
  {
    label: "1:1 문의",
    href: APP_ROUTES.INQUIRIES.ROOT,
  },
] as const;

const SupportNavigation = () => {
  const pathname = usePathname();

  return (
    <nav
      aria-label="고객지원 메뉴"
      className="bg-background-default border-border-subtle shadow-tab h-tab-height-mobile xl:h-tab-height-desktop w-full overflow-x-auto border-b"
    >
      <div className="px-margin-mobile md:px-margin-tablet mx-auto h-full w-full max-w-(--container-desktop) xl:px-0">
        <div className="flex h-full items-center gap-24 md:gap-32 xl:gap-40">
          {SUPPORT_LINKS.map(({ label, href }) => {
            const isActive = pathname === href || pathname.startsWith(`${href}/`);

            return (
              <Link
                key={href}
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "relative flex h-full shrink-0 items-center whitespace-nowrap xl:h-64",
                  isActive &&
                    "after:bg-nav-indicator-active after:absolute after:right-0 after:bottom-0 after:left-0 after:h-2",
                )}
              >
                <Text
                  as="span"
                  variant={
                    isActive
                      ? {
                          base: "md-bold",
                          xl: "xl-semibold",
                        }
                      : {
                          base: "md-semibold",
                          xl: "xl-semibold",
                        }
                  }
                  className={isActive ? "text-nav-text-active" : "text-nav-text-default"}
                >
                  {label}
                </Text>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default SupportNavigation;
