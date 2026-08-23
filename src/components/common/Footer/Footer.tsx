"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Text } from "@/components/common/Text";
import { APP_ROUTES } from "@/lib/constants/appRoutes";

const FOOTER_LINKS = [
  {
    label: "공지사항",
    href: APP_ROUTES.NOTICES.ROOT,
  },
  {
    label: "자주 묻는 질문",
    href: APP_ROUTES.FAQS.ROOT,
  },
  {
    label: "문의하기",
    href: APP_ROUTES.INQUIRIES.ROOT,
  },
];

const Footer = () => {
  const pathname = usePathname();

  // 2026.08.08 윤소정 - [추가]
  // /movers/map 경로인 경우 footer 제거
  // 지도에서 스크롤 생기지 않게 하기 위함
  if (pathname === APP_ROUTES.MOVERS.MAP) {
    return null;
  }

  return (
    <footer className="border-border-default bg-background-subtle w-full border-t">
      <div className="px-margin-mobile max-w-container-desktop mx-auto flex w-full flex-col items-center gap-16 py-40 md:px-40">
        <Image src="/icons/logo_full.svg" alt="4roro-moving" width={100} height={37} />

        <nav aria-label="고객지원" className="flex items-center gap-24">
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-text-secondary hover:text-text-primary transition-colors"
            >
              <Text variant="sm-medium">{link.label}</Text>
            </Link>
          ))}
        </nav>

        <Text variant="xs-regular" className="text-text-muted">
          Copyright © 2026, 4roro-moving. All rights reserved.
        </Text>
      </div>
    </footer>
  );
};

export default Footer;
