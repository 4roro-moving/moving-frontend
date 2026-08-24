"use client";

import Image from "next/image";
import type { MouseEventHandler, ReactNode } from "react";

import Button from "@/components/common/Button/Button";
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
  onButtonClick?: MouseEventHandler<HTMLAnchorElement>;
  /** href 없이 버튼만 표시할 때 사용 */
  onActionClick?: () => void;
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
  onActionClick,
  imageAlt = "",
  className,
  size,
}: EmptyStateProps) {
  const showLinkButton = Boolean(buttonLabel && href);
  const showActionButton = Boolean(buttonLabel && !href && onActionClick);
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
          <Text
            as="p"
            variant="lg-regular"
            className="text-text-muted text-center whitespace-pre-line"
          >
            {description}
          </Text>
        ) : null}

        {isLg ? (
          <Text
            as="p"
            variant="2xl-regular"
            className="text-text-muted text-center whitespace-pre-line"
          >
            {description}
          </Text>
        ) : null}

        {!size ? (
          <>
            <Text
              as="p"
              variant="lg-regular"
              className="text-text-muted text-center whitespace-pre-line md:hidden"
            >
              {description}
            </Text>
            <Text
              as="p"
              variant="2xl-regular"
              className="text-text-muted hidden text-center whitespace-pre-line md:block"
            >
              {description}
            </Text>
          </>
        ) : null}

        {showLinkButton ? (
          <Button href={href!} onClick={onButtonClick} size="cta" className="w-auto">
            {buttonLabel}
          </Button>
        ) : null}

        {showActionButton ? (
          <Button type="button" onClick={onActionClick} size="cta" className="w-auto">
            {buttonLabel}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
