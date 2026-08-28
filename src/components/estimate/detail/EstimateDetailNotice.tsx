"use client";

import { useTranslations } from "next-intl";

import { Text } from "@/components/common/Text";
import { InfoIcon } from "@/icons";

/**
 * 받았던 견적 상세 — 미확정 견적 notice 배너 (Figma 8093:49271)
 * // 2026.07.29 정슬기 - [추가]
 * // 2026.07.29 정슬기 - [수정] notice 텍스트 토큰으로 아이콘 색·Figma 패딩 맞춤
 */
export default function EstimateDetailNotice() {
  const t = useTranslations("estimates");
  return (
    <div
      role="status"
      className="bg-notice-background rounded-12 flex w-full items-center gap-12 px-28 py-20"
    >
      <InfoIcon className="text-notice-text size-24 shrink-0" aria-hidden="true" />
      <Text as="p" variant="lg-semibold" className="text-notice-text min-w-0 wrap-break-word">
        {t("unconfirmedNotice")}
      </Text>
    </div>
  );
}
