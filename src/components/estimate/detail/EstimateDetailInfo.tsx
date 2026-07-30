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
  const { estimateRequest, createdAt } = detail;

  return (
    <EstimateDetailInfoSection
      rows={[
        { label: "견적 요청일", value: formatDetailDateLabel(createdAt) },
        { label: "서비스", value: getMoveTypeLabel(estimateRequest.moveType) },
        { label: "이용일", value: formatMoveDateLabel(estimateRequest.moveDate) },
        { label: "출발지", value: estimateRequest.fromAddress },
        { label: "도착지", value: estimateRequest.toAddress },
      ]}
    />
  );
}
