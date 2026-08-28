"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

import { Text } from "@/components/common/Text";
import { APP_ROUTES } from "@/lib/constants/appRoutes";
import { cn } from "@/lib/utils/cn";

const SupportNavigation = () => {
  const pathname = usePathname();
  const t = useTranslations("navigation");
  const supportLinks = [
    { label: t("notices"), href: APP_ROUTES.NOTICES.ROOT },
    { label: t("faqs"), href: APP_ROUTES.FAQS.ROOT },
    { label: t("inquiries"), href: APP_ROUTES.INQUIRIES.ROOT },
  ];

  return (
    <nav
      aria-label={t("support")}
      className="bg-background-default border-border-subtle shadow-tab h-tab-height-mobile xl:h-tab-height-desktop w-full overflow-x-auto border-b"
    >
      <div className="px-margin-mobile md:px-margin-tablet mx-auto h-full w-full max-w-(--container-desktop) xl:px-0">
        <div className="flex h-full items-center gap-24 md:gap-32 xl:gap-40">
          {supportLinks.map(({ label, href }) => {
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
