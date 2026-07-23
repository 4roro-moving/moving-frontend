"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Text } from "@/components/common/Text";
import { cn } from "@/lib/utils/cn";

export interface HeaderProps {
  /** TODO: auth 연동 전 임시 prop. 추후 useIsAuthenticated() 등으로 대체 */
  isLogin?: boolean;
}

const LOGGED_OUT_LINKS = [{ label: "기사님 찾기", href: "/movers" }];

const LOGGED_IN_LINKS = [
  { label: "견적 요청", href: "/estimate-request" },
  { label: "기사님 찾기", href: "/movers" },
  { label: "내 견적 관리", href: "/estimates" },
];

const Header = ({ isLogin = false }: HeaderProps) => {
  const pathname = usePathname();
  const navLinks = isLogin ? LOGGED_IN_LINKS : LOGGED_OUT_LINKS;

  return (
    <header className="border-border-subtle bg-background-surface w-full border-b">
      <div className="h-gnb-height-desktop flex items-center justify-between px-[var(--gnb-padding-x-desktop)] py-26">
        <div className="flex items-center gap-80">
          <Link href="/" className="shrink-0">
            <Image src="/icons/logo_full.svg" alt="4roro-moving" width={100} height={37} priority />
          </Link>

          <nav aria-label="주요 메뉴">
            <ul className="flex items-center gap-40">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;

                return (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "transition-colors",
                        isActive ? "text-text-primary" : "text-text-subtle hover:text-text-primary",
                      )}
                    >
                      <Text variant="md-bold">{link.label}</Text>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {isLogin ? (
          <div className="flex items-center gap-20">
            <button type="button" aria-label="알림">
              <Image src="/icons/ic_alarm.svg" alt="" width={24} height={24} />
            </button>
            <button type="button" aria-label="프로필">
              <Image src="/icons/ic_profile.svg" alt="" width={24} height={24} />
            </button>
            {/* TODO: 프로필 기능 연동 전까지 닉네임 placeholder */}
            <button type="button" className="text-text-primary">
              <Text variant="md-medium">닉네임</Text>
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="bg-background-brand text-text-inverse hover:bg-background-brand-hover rounded-8 flex h-40 items-center px-20 transition-colors"
          >
            <Text variant="md-semibold">로그인</Text>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
