"use client";

import Link from "next/link";

import { Text } from "@/components/common/Text";
import { APP_ROUTES } from "@/lib/constants/appRoutes";
import { cn } from "@/lib/utils/cn";

interface HeaderProfileMenuProps {
  userName: string;
  onLogout: () => void;
  onNavigate?: () => void;
  className?: string;
}

const MENU_ITEMS = [
  { label: "프로필 수정", href: APP_ROUTES.PROFILE_EDIT },
  { label: "찜한 기사님", href: APP_ROUTES.FAVORITE_MOVERS },
  { label: "이사 리뷰", href: APP_ROUTES.REVIEWS },
] as const;

const HeaderProfileMenu = ({
  userName,
  onLogout,
  onNavigate,
  className,
}: HeaderProfileMenuProps) => {
  return (
    <div
      role="menu"
      aria-label="마이페이지 메뉴"
      className={cn(
        "border-border-default bg-background-surface shadow-select absolute top-full right-0 z-50 mt-8",
        "rounded-16 flex w-[140px] flex-col items-stretch border pt-10 pb-6 md:w-[240px] md:px-4 md:pt-16",
        "px-6",
        className,
      )}
    >
      <div className="bg-background-surface flex items-center px-12 py-8 md:py-14 md:pr-12 md:pl-24">
        <Text
          as="p"
          variant={{ base: "lg-bold", md: "2lg-bold" }}
          className="text-text-primary md:text-text-secondary"
        >
          {userName} 고객님
        </Text>
      </div>

      <div className="flex flex-col items-center gap-8 md:gap-10">
        <div className="flex w-full flex-col items-stretch">
          {MENU_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              role="menuitem"
              onClick={onNavigate}
              className="bg-background-surface hover:bg-background-hover flex w-full items-center px-12 py-8 md:py-14 md:pr-12 md:pl-24"
            >
              <Text
                as="span"
                variant={{ base: "md-medium", md: "lg-medium" }}
                className="text-text-secondary"
              >
                {item.label}
              </Text>
            </Link>
          ))}
        </div>

        <div className="border-border-subtle flex w-full items-center justify-center border-t px-12 pt-12 pb-8 md:pt-14">
          <button
            type="button"
            role="menuitem"
            onClick={onLogout}
            className="text-text-muted hover:text-text-secondary transition-colors"
          >
            <Text as="span" variant={{ base: "xs-regular", md: "md-medium" }}>
              로그아웃
            </Text>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeaderProfileMenu;
