"use client";

import { useTranslations } from "next-intl";

import AutoTranslatedText from "@/components/common/AutoTranslatedText";
import { Text } from "@/components/common/Text";

interface EstimateDetailCommentProps {
  comment: string;
}

/**
 * 견적 상세 — 기사님 코멘트 (상세 정보 블록 최하단)
 * SentEstimateComment와 동일 spacing/타이포 (gap-20 md:gap-28)
 * // 2026.08.03 정슬기 - [추가] 받았던/대기 견적 상세용
 */
export default function EstimateDetailComment({ comment }: EstimateDetailCommentProps) {
  const t = useTranslations("estimates");
  const trimmed = comment.trim();

  if (!trimmed) {
    return null;
  }

  return (
    <section
      className="flex w-full flex-col gap-20 md:gap-28"
      aria-labelledby="estimate-detail-mover-comment-title"
    >
      <h2 id="estimate-detail-mover-comment-title" className="text-text-primary">
        <Text as="span" variant="lg-semibold" className="md:hidden">
          {t("moverComment")}
        </Text>

        <Text as="span" variant="xl-semibold" className="hidden md:inline">
          {t("moverComment")}
        </Text>
      </h2>

      <Text
        as="p"
        variant="lg-medium"
        className="text-text-muted wrap-break-word whitespace-pre-wrap"
      >
        <AutoTranslatedText text={trimmed} />
      </Text>
    </section>
  );
}
