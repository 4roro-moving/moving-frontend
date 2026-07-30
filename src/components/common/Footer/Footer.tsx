"use client";

import Image from "next/image";
import Link from "next/link";

import { Text } from "@/components/common/Text";

const FOOTER_LINKS = [
  { label: "자주 묻는 질문", href: "/" },
  { label: "문의하기", href: "/" },
];

const Footer = () => {
  return (
    <footer className="border-border-default bg-background-subtle w-full border-t">
      <div className="px-margin-mobile max-w-container-desktop mx-auto flex w-full flex-col items-center gap-16 py-40 md:px-40">
        <Image src="/icons/logo_full.svg" alt="4roro-moving" width={100} height={37} />

        <nav aria-label="footer" className="flex items-center gap-24">
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
