"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { Text } from "@/components/common/Text";
import { cn } from "@/lib/utils/cn";

export interface EmptyStateProps {
  /** empty-state 일러스트 경로 */
  imageSrc: string;
  /** 이미지 하단 안내 문구 (줄바꿈은 ReactNode로 전달) */
  description: ReactNode;
  /** 주황색 CTA 버튼 문구 (없으면 버튼 미표시) */
  buttonLabel?: string;
  /** CTA 클릭 시 이동 경로 */
  href?: string;
  onButtonClick?: () => void;
  imageAlt?: string;
  className?: string;
  /**
   * Figma Empty State size.
   * - sm: Text/Lg/Regular(16)
   * - lg: Text/2xl/Regular(24)
   * - 미지정: 기존 반응형(모바일 16 / md+ 24)
   */
  size?: "sm" | "lg";
}

export default function EmptyState({
  imageSrc,
  description,
  buttonLabel,
  href,
  onButtonClick,
  imageAlt = "",
  className,
  size,
}: EmptyStateProps) {
  const showButton = Boolean(buttonLabel && href);
  const isSm = size === "sm";
  const isLg = size === "lg";

  return (
    <div
      className={cn(
        "flex w-full flex-col items-center justify-center",
        size
          ? isSm
            ? "min-h-0 px-0 py-40"
            : "min-h-0 px-0 py-64"
          : "min-h-[60vh] px-24 py-64 md:min-h-[70vh]",
        className,
      )}
    >
      <div
        className={cn(
          "flex flex-col items-center",
          isSm ? "gap-24" : isLg ? "gap-32" : "gap-24 md:gap-32",
        )}
      >
        <div
          className={cn(
            "relative overflow-hidden",
            isSm
              ? "h-[196px] w-[240px] opacity-50"
              : isLg
                ? "h-[196px] w-[240px] opacity-50"
                : "size-[180px] opacity-30 md:size-[280px]",
          )}
        >
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            sizes={size ? "240px" : "(max-width: 768px) 180px, 280px"}
            className="object-contain"
            priority
          />
        </div>

        {isSm ? (
          <Text as="p" variant="lg-regular" className="text-text-muted text-center">
            {description}
          </Text>
        ) : null}

        {isLg ? (
          <Text as="p" variant="2xl-regular" className="text-text-muted text-center">
            {description}
          </Text>
        ) : null}

        {!size ? (
          <>
            <Text as="p" variant="lg-regular" className="text-text-muted text-center md:hidden">
              {description}
            </Text>
            <Text
              as="p"
              variant="2xl-regular"
              className="text-text-muted hidden text-center md:block"
            >
              {description}
            </Text>
          </>
        ) : null}

        {showButton && (
          <Link
            href={href!}
            onClick={onButtonClick}
            className={cn(
              "bg-background-brand hover:bg-background-brand-hover flex items-center justify-center px-16 transition-colors",
              isSm
                ? "rounded-12 h-[54px]"
                : isLg
                  ? "rounded-16 h-64"
                  : "rounded-12 md:rounded-16 h-[54px] md:h-64",
            )}
          >
            {isSm ? (
              <Text as="span" variant="lg-semibold" className="text-text-inverse">
                {buttonLabel}
              </Text>
            ) : null}
            {isLg ? (
              <Text as="span" variant="2lg-semibold" className="text-text-inverse">
                {buttonLabel}
              </Text>
            ) : null}
            {!size ? (
              <>
                <Text as="span" variant="lg-semibold" className="text-text-inverse md:hidden">
                  {buttonLabel}
                </Text>
                <Text
                  as="span"
                  variant="2lg-semibold"
                  className="text-text-inverse hidden md:inline"
                >
                  {buttonLabel}
                </Text>
              </>
            ) : null}
          </Link>
        )}
      </div>
    </div>
  );
}
