"use client";

import { useTranslations } from "next-intl";
import { useId, type FocusEvent } from "react";

import { Text } from "@/components/common/Text";
import { StarIcon } from "@/icons";
import { cn } from "@/lib/utils/cn";

interface ReviewStarRatingProps {
  /** 1~5 별점. 표시 전용일 때 현재 값, 선택형일 때 선택된 값 */
  value: number;
  /** 전달되면 별점 선택 UI로 동작 */
  onChange?: (rating: number) => void;
  /** 선택형일 때 그룹 밖으로 포커스가 나갈 때만 호출 */
  onBlur?: () => void;
  size?: "sm" | "md" | "lg";
  className?: string;
  /** 스크린 리더용 라벨 prefix */
  label?: string;
  /** 보이는 라벨과 연결할 때 사용. 있으면 aria-label 대신 이 id를 사용합니다 */
  labelledBy?: string;
  error?: string;
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
 * // 2026.08.24 김나연 - [추가] 선택형 접근성(onBlur, labelledBy, error). 표시형은 기존 DOM 유지
 */
export default function ReviewStarRating({
  value,
  onChange,
  onBlur,
  size = "md",
  className,
  label,
  labelledBy,
  error,
  disabled = false,
}: ReviewStarRatingProps) {
  const t = useTranslations("reviews");
  const errorId = useId();
  const resolvedLabel = label ?? t("ratingLabel");
  const isInteractive = typeof onChange === "function";
  const clamped = Math.min(5, Math.max(0, value));
  const groupAriaLabel = labelledBy
    ? undefined
    : isInteractive
      ? resolvedLabel
      : t("ratingScoreAria", { label: resolvedLabel, score: clamped });

  const handleGroupBlur = (event: FocusEvent<HTMLDivElement>) => {
    const nextFocused = event.relatedTarget;
    if (nextFocused instanceof Node && event.currentTarget.contains(nextFocused)) {
      return;
    }

    onBlur?.();
  };

  const stars = (
    <div
      className={cn("flex items-center gap-2", className)}
      role={isInteractive ? "group" : "img"}
      aria-labelledby={labelledBy}
      aria-label={groupAriaLabel}
      aria-invalid={isInteractive && Boolean(error) ? true : undefined}
      aria-describedby={isInteractive && error ? errorId : undefined}
      onBlur={isInteractive ? handleGroupBlur : undefined}
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
            aria-label={t("ratingScoreAria", { label: resolvedLabel, score: starValue })}
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
      {!isInteractive ? (
        <span className="sr-only">
          {t("ratingScoreAria", { label: resolvedLabel, score: clamped })}
        </span>
      ) : null}
    </div>
  );

  if (!isInteractive) {
    return stars;
  }

  return (
    <div className="flex w-full flex-col gap-4">
      {stars}
      {error ? (
        <Text id={errorId} variant="xs-regular" className="text-text-error">
          {error}
        </Text>
      ) : null}
    </div>
  );
}
