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
    <nav aria-label="고객지원 메뉴" className="border-border-default border-b">
      <div className="px-margin-mobile max-w-container-desktop mx-auto flex md:px-40">
        {SUPPORT_LINKS.map(({ label, href }) => {
          const isActive = pathname === href || pathname.startsWith(`${href}/`);

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "border-b-2 px-16 py-16 transition-colors",
                isActive
                  ? "border-border-brand text-text-primary"
                  : "text-text-secondary border-transparent",
              )}
            >
              <Text as="span" variant={isActive ? "md-bold" : "md-regular"}>
                {label}
              </Text>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default SupportNavigation;
