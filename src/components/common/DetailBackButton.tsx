"use client";

import { useTranslations } from "next-intl";

import { Text } from "@/components/common/Text";
import { useDetailBackNavigation } from "@/hooks/useDetailBackNavigation";
import { ArrowLeftIcon } from "@/icons";
import { cn } from "@/lib/utils/cn";

interface DetailBackButtonProps {
  /** 이력이 없을 때 이동할 목록 경로 (`APP_ROUTES`) */
  fallbackHref: string;
  className?: string;
}

/**
 * 상세 페이지 ghost 목록 이동 버튼 (← 목록으로)
 * 시각 크기는 작게, 터치 영역만 min 44px 보장
 * // 2026.08.03 정슬기- [추가]
 */
export default function DetailBackButton({ fallbackHref, className }: DetailBackButtonProps) {
  const t = useTranslations("common");
  const goBack = useDetailBackNavigation(fallbackHref);

  return (
    <button
      type="button"
      onClick={goBack}
      aria-label={t("backToListAria")}
      className={cn(
        "text-text-muted rounded-8 inline-flex min-h-44 min-w-44 items-center gap-4 self-start",
        "-ml-8 px-8 py-8",
        "hover:bg-background-hover",
        "active:bg-background-hover",
        "focus-visible:ring-border-brand focus-visible:ring-2 focus-visible:outline-none",
        className,
      )}
    >
      <ArrowLeftIcon className="size-16 shrink-0" aria-hidden="true" />
      <Text as="span" variant="sm-medium" className="text-text-muted whitespace-nowrap">
        {t("backToList")}
      </Text>
    </button>
  );
}
