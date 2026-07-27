"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { Text } from "@/components/common/Text";

export interface EmptyStateProps {
  /** empty-state 일러스트 경로 */
  imageSrc: string;
  /** 이미지 하단 안내 문구 (줄바꿈은 ReactNode로 전달) */
  description: ReactNode;
  /** 주황색 CTA 버튼 문구 (없으면 버튼 미표시) */
  buttonLabel?: string;
  /** CTA 클릭 시 이동 경로 */
  href?: string;
  imageAlt?: string;
}

export default function EmptyState({
  imageSrc,
  description,
  buttonLabel,
  href,
  imageAlt = "",
}: EmptyStateProps) {
  const showButton = Boolean(buttonLabel && href);

  return (
    <div className="flex min-h-[60vh] w-full flex-col items-center justify-center px-24 py-64 md:min-h-[70vh]">
      <div className="flex flex-col items-center gap-24 md:gap-32">
        <div className="relative size-[180px] opacity-30 md:size-[280px]">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            sizes="(max-width: 768px) 180px, 280px"
            className="object-contain"
            priority
          />
        </div>

        <Text as="p" variant="lg-regular" className="text-text-muted text-center md:hidden">
          {description}
        </Text>
        <Text as="p" variant="2xl-regular" className="text-text-muted hidden text-center md:block">
          {description}
        </Text>

        {showButton && (
          <Link
            href={href!}
            className="bg-background-brand hover:bg-background-brand-hover rounded-12 md:rounded-16 flex h-[54px] items-center justify-center px-16 transition-colors md:h-64"
          >
            <Text as="span" variant="lg-semibold" className="text-text-inverse md:hidden">
              {buttonLabel}
            </Text>
            <Text as="span" variant="2lg-semibold" className="text-text-inverse hidden md:inline">
              {buttonLabel}
            </Text>
          </Link>
        )}
      </div>
    </div>
  );
}
