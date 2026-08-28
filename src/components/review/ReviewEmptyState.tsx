"use client";

import { useTranslations } from "next-intl";

import EmptyState from "@/components/common/EmptyState/EmptyState";

type ReviewEmptyVariant = "writable" | "my";

interface ReviewEmptyStateProps {
  variant: ReviewEmptyVariant;
}

// 2026.07.27 정슬기 - [추가] 리뷰 목록 빈 상태
export default function ReviewEmptyState({ variant }: ReviewEmptyStateProps) {
  const t = useTranslations("reviews");

  return (
    <EmptyState
      imageSrc="/images/empty/moving-car.png"
      description={
        <>
          {t(`${variant}EmptyTitle`)}
          <br />
          {t(`${variant}EmptyDescription`)}
        </>
      }
      imageAlt=""
    />
  );
}
