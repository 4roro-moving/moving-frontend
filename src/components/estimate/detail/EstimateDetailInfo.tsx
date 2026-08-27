import { useLocale, useTranslations } from "next-intl";
import {
  formatDetailDateLabel,
  formatMoveDateLabel,
  getMoveTypeLabel,
} from "@/lib/utils/estimateFormat";
import type { EstimateDetail } from "@/types/estimate";

import { EstimateDetailInfoSection } from "./EstimateDetailInfoSection";

interface EstimateDetailInfoProps {
  detail: EstimateDetail;
}

export default function EstimateDetailInfo({ detail }: EstimateDetailInfoProps) {
  const t = useTranslations("estimates");
  const locale = useLocale();
  const { estimateRequest, createdAt } = detail;

  return (
    <EstimateDetailInfoSection
      rows={[
        { label: t("detail.requestedAt"), value: formatDetailDateLabel(createdAt) },
        { label: t("detail.service"), value: getMoveTypeLabel(estimateRequest.moveType, locale) },
        {
          label: t("detail.useDate"),
          value: formatMoveDateLabel(estimateRequest.moveDate, locale),
        },
        { label: t("fromAddress"), value: estimateRequest.fromAddress },
        { label: t("toAddress"), value: estimateRequest.toAddress },
      ]}
    />
  );
}
