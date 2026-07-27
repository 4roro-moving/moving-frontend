import { Text } from "@/components/common/Text";
import {
  formatDetailDateLabel,
  formatMoveDateLabel,
  getMoveTypeLabel,
} from "@/lib/utils/estimateFormat";
import type { EstimateDetail } from "@/types/estimate";

interface EstimateDetailInfoProps {
  detail: EstimateDetail;
}

interface InfoRowProps {
  label: string;
  value: string;
}

function InfoRow({ label, value }: InfoRowProps) {
  return (
    // 2026.07.24 정슬기 - [수정] Mobile에서도 라벨·값 가로 배치, 긴 주소 줄바꿈
    // 2026.07.25 정슬기 - [수정] Desktop 라벨 90 + gap 23 (값 x=113), 좌측 정렬 (Figma 8091:48009)
    <div className="flex w-full items-start justify-between gap-12 sm:items-center sm:justify-start sm:gap-24 lg:gap-23">
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

export default function EstimateDetailInfo({ detail }: EstimateDetailInfoProps) {
  const { estimateRequest, createdAt } = detail;

  return (
    <section className="flex w-full flex-col gap-20 md:gap-28" aria-label="견적 정보">
      <h2 className="text-text-primary">
        <Text as="span" variant="lg-semibold" className="md:hidden">
          견적 정보
        </Text>
        <Text as="span" variant="xl-semibold" className="hidden md:inline">
          견적 정보
        </Text>
      </h2>

      <dl className="flex w-full flex-col gap-16">
        <InfoRow label="견적 요청일" value={formatDetailDateLabel(createdAt)} />
        <InfoRow label="서비스" value={getMoveTypeLabel(estimateRequest.moveType)} />
        <InfoRow label="이용일" value={formatMoveDateLabel(estimateRequest.moveDate)} />
        <InfoRow label="출발지" value={estimateRequest.fromAddress} />
        <InfoRow label="도착지" value={estimateRequest.toAddress} />
      </dl>
    </section>
  );
}
