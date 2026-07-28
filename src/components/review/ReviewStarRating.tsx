"use client";

import { StarIcon } from "@/icons";
import { cn } from "@/lib/utils/cn";

interface ReviewStarRatingProps {
  /** 1~5 별점. 표시 전용일 때 현재 값, 선택형일 때 선택된 값 */
  value: number;
  /** 전달되면 별점 선택 UI로 동작 */
  onChange?: (rating: number) => void;
  size?: "sm" | "md" | "lg";
  className?: string;
  /** 스크린 리더용 라벨 prefix */
  label?: string;
  disabled?: boolean;
}

const SIZE_CLASS = {
  sm: "size-20 md:size-24",
  md: "size-24",
  lg: "size-28 md:size-32",
} as const;

/**
 * 별점 표시/선택 공통 컴포넌트
 * // 2026.07.27 정슬기 - [추가] 리뷰 별점 UI
 * // 2026.07.28 정슬기 - [수정] radiogroup/radio 제거 → group + aria-pressed (키보드 패턴 미구현 대응)
 */
export default function ReviewStarRating({
  value,
  onChange,
  size = "md",
  className,
  label = "별점",
  disabled = false,
}: ReviewStarRatingProps) {
  const isInteractive = typeof onChange === "function";
  const clamped = Math.min(5, Math.max(0, value));

  return (
    <div
      className={cn("flex items-center gap-2", className)}
      role={isInteractive ? "group" : "img"}
      aria-label={isInteractive ? label : `${label} ${clamped}점`}
    >
      {Array.from({ length: 5 }, (_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= clamped;

        if (!isInteractive) {
          return (
            <StarIcon
              key={starValue}
              className={cn(
                SIZE_CLASS[size],
                isFilled ? "text-rating-fill" : "text-icon-default opacity-30",
              )}
              aria-hidden="true"
            />
          );
        }

        const isSelected = starValue === clamped;

        return (
          <button
            key={starValue}
            type="button"
            aria-label={`${label} ${starValue}점`}
            aria-pressed={isSelected}
            disabled={disabled}
            className="focus-visible:ring-border-brand rounded-4 focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed"
            onClick={() => onChange(starValue)}
          >
            <StarIcon
              className={cn(
                SIZE_CLASS[size],
                isFilled ? "text-rating-fill" : "text-icon-default opacity-30",
              )}
              aria-hidden="true"
            />
          </button>
        );
      })}
      {!isInteractive ? <span className="sr-only">{`${label} ${clamped}점`}</span> : null}
    </div>
  );
}
