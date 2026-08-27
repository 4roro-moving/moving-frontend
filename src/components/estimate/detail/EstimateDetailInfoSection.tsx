import { useTranslations } from "next-intl";
import { Text } from "@/components/common/Text";

export interface EstimateDetailInfoRowItem {
  label: string;
  value: string;
}

interface EstimateDetailInfoRowProps {
  label: string;
  value: string;
}

/**
 * 견적 상세 정보 행 (라벨 90 + gap 23)
 * // 2026.07.29 정슬기 - [추가] 견적/요청 상세 공통 Info Row
 */
export function EstimateDetailInfoRow({ label, value }: EstimateDetailInfoRowProps) {
  return (
    // 2026.07.24 정슬기 - [수정] Mobile에서도 라벨·값 가로 배치, 긴 주소 줄바꿈
    // 2026.07.25 정슬기 - [수정] Desktop 라벨 90 + gap 23 (값 x=113), 좌측 정렬 (Figma 8091:48009)
    <div className="flex w-full items-start justify-between md:items-center md:justify-start md:gap-12 xl:gap-23">
      <Text as="dt" variant="lg-regular" className="text-text-weak w-90 shrink-0">
        {label}
      </Text>
      <Text
        as="dd"
        variant="lg-semibold"
        className="text-text-primary min-w-0 text-right wrap-break-word sm:text-left"
      >
        {value}
      </Text>
    </div>
  );
}

interface EstimateDetailInfoSectionProps {
  title?: string;
  rows: EstimateDetailInfoRowItem[];
  /** 섹션 접근성 이름. 기본은 title */
  "aria-label"?: string;
}

/**
 * 견적 정보 섹션 — 제목 + Info Row 목록
 * // 2026.07.29 정슬기 - [추가] EstimateDetailInfo·요청 상세 공통
 */
export function EstimateDetailInfoSection({
  title,
  rows,
  "aria-label": ariaLabel,
}: EstimateDetailInfoSectionProps) {
  const t = useTranslations("estimates");
  const resolvedTitle = title ?? t("detail.infoTitle");
  return (
    <section
      className="flex w-full flex-col gap-20 md:gap-28"
      aria-label={ariaLabel ?? resolvedTitle}
    >
      <h2 className="text-text-primary">
        <Text as="span" variant="lg-semibold" className="md:hidden">
          {resolvedTitle}
        </Text>
        <Text as="span" variant="xl-semibold" className="hidden md:inline">
          {resolvedTitle}
        </Text>
      </h2>

      <dl className="flex w-full flex-col gap-16">
        {rows.map((row) => (
          <EstimateDetailInfoRow key={row.label} label={row.label} value={row.value} />
        ))}
      </dl>
    </section>
  );
}
