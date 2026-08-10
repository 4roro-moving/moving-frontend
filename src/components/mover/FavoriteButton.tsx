"use client";

import type { MouseEvent } from "react";

import { Text, type ResponsiveTextVariant, type TextVariant } from "@/components/common/Text";
import { LikeIcon } from "@/icons";
import { cn } from "@/lib/utils/cn";

interface FavoriteButtonProps {
  moverName: string;
  isFavorite: boolean;
  favoriteCount?: number;
  showCount?: boolean;
  /**
   * 클릭 가능 여부. 기본값 true.
   * 로그인 가드 등으로 이미 접근이 제한된 화면이면 생략
   * 같은 화면에서 상황에 따라 토글 가능 여부가 갈리면(비로그인 노출 등) 명시적으로 조건을 계산해 전달해야 함
   */
  interactive?: boolean;
  countPosition?: "before" | "after";
  countVariant?: TextVariant | ResponsiveTextVariant;
  className?: string;
  iconClassName?: string;
  countClassName?: string;
  onToggle: (nextIsFavorite: boolean) => void;
}

/** 기사님 찜 하트·개수 표시와 토글 접근성을 통일하는 공통 버튼 */
export function FavoriteButton({
  moverName,
  isFavorite,
  favoriteCount,
  showCount = false,
  interactive = true,
  countPosition = "after",
  countVariant = "md-regular",
  className,
  iconClassName = "size-24",
  countClassName,
  onToggle,
}: FavoriteButtonProps) {
  const icon = (
    <LikeIcon
      isFavorite={isFavorite}
      className={cn(
        iconClassName,
        isFavorite ? "text-like-active-fill" : "text-like-default-stroke",
      )}
    />
  );
  const count =
    showCount && favoriteCount !== undefined ? (
      <Text
        as="span"
        variant={countVariant}
        className={cn("text-text-muted", countClassName)}
        aria-hidden="true"
      >
        {favoriteCount}
      </Text>
    ) : null;
  const content = (
    <>
      {countPosition === "before" ? count : icon}
      {countPosition === "before" ? icon : count}
    </>
  );

  if (!interactive) {
    return (
      <div
        className={cn("flex shrink-0 items-center", className)}
        role="group"
        aria-label={`${moverName} 기사님 현재 찜 ${favoriteCount ?? 0}개`}
      >
        {content}
      </div>
    );
  }

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    onToggle(!isFavorite);
  };

  const ariaLabel =
    showCount && favoriteCount !== undefined
      ? `${moverName} 기사님 찜, 현재 ${favoriteCount}개`
      : `${moverName} 기사님 찜`;

  return (
    <button
      type="button"
      className={cn(
        "focus-visible:ring-border-brand rounded-8 flex shrink-0 cursor-pointer items-center focus-visible:ring-2 focus-visible:outline-none",
        className,
      )}
      aria-label={ariaLabel}
      aria-pressed={isFavorite}
      onClick={handleClick}
    >
      {content}
    </button>
  );
}
