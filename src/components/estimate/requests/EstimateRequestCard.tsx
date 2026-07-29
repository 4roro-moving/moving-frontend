import { Text } from "@/components/common/Text";
import { DesignatedChip, MoveTypeChip } from "@/components/estimate/received/MoveTypeChip";
import {
  formatMoveDateLabelSafe,
  formatRequestDateLabel,
  getEstimateRequestStatusLabel,
  getMoveTypeLabel,
} from "@/lib/utils/estimateFormat";
import type { MyEstimateRequestItem } from "@/types/estimate";

interface EstimateRequestCardProps {
  request: MyEstimateRequestItem;
}

/**
 * 보낸 견적 요청 목록 카드 (EstimateRequest 엔티티)
 * 상세 이동은 후속 작업 — 클릭/링크 없음
 * // 2026.07.29 정슬기 - [추가]
 */
export default function EstimateRequestCard({ request }: EstimateRequestCardProps) {
  const designatedCount = request.designatedMovers.length;
  const estimateCount = request._count.estimates;
  const titleId = `estimate-request-${request.id}-title`;

  return (
    <article
      aria-labelledby={titleId}
      className="bg-background-surface border-border-subtle shadow-estimate-card rounded-16 md:rounded-20 flex w-full flex-col gap-16 border-[0.5px] px-16 py-20 md:gap-20 md:px-24 md:py-28 lg:px-32 lg:py-32"
    >
      <div className="flex w-full flex-wrap items-center justify-between gap-8">
        <div className="flex flex-wrap items-center gap-8">
          <MoveTypeChip moveType={request.moveType} size="sm" className="md:hidden" />
          <MoveTypeChip
            moveType={request.moveType}
            size="md"
            className="hidden py-4 pr-7 pl-5 md:inline-flex"
          />
          {designatedCount > 0 ? (
            <>
              <DesignatedChip size="sm" className="md:hidden" />
              <DesignatedChip size="md" className="hidden md:inline-flex" />
            </>
          ) : null}
        </div>
        <Text as="span" variant="md-semibold" className="text-text-brand shrink-0">
          {getEstimateRequestStatusLabel(request.status)}
        </Text>
      </div>

      <div className="flex min-w-0 flex-col gap-4">
        <Text
          as="h3"
          id={titleId}
          variant={{ base: "lg-semibold", md: "2lg-semibold" }}
          className="text-text-primary"
        >
          {getMoveTypeLabel(request.moveType)}
        </Text>
        <Text as="p" variant="xs-regular" className="text-text-muted">
          요청일 {formatRequestDateLabel(request.createdAt)}
        </Text>
      </div>

      <dl className="flex w-full flex-col gap-8 md:gap-12">
        <div className="flex w-full items-start justify-between gap-12">
          <Text as="dt" variant="md-regular" className="text-text-muted shrink-0">
            출발지
          </Text>
          <Text
            as="dd"
            variant="md-semibold"
            className="text-text-primary m-0 min-w-0 text-right break-words"
          >
            {request.fromAddress}
          </Text>
        </div>
        <div className="flex w-full items-start justify-between gap-12">
          <Text as="dt" variant="md-regular" className="text-text-muted shrink-0">
            도착지
          </Text>
          <Text
            as="dd"
            variant="md-semibold"
            className="text-text-primary m-0 min-w-0 text-right break-words"
          >
            {request.toAddress}
          </Text>
        </div>
        <div className="flex w-full items-center justify-between gap-12">
          <Text as="dt" variant="md-regular" className="text-text-muted shrink-0">
            이사 예정일
          </Text>
          <Text as="dd" variant="md-semibold" className="text-text-primary m-0 text-right">
            {formatMoveDateLabelSafe(request.moveDate)}
          </Text>
        </div>
        <div className="flex w-full items-center justify-between gap-12">
          <Text as="dt" variant="md-regular" className="text-text-muted shrink-0">
            받은 견적
          </Text>
          <Text as="dd" variant="md-semibold" className="text-text-primary m-0 text-right">
            {estimateCount}건
          </Text>
        </div>
        <div className="flex w-full items-center justify-between gap-12">
          <Text as="dt" variant="md-regular" className="text-text-muted shrink-0">
            지정 요청
          </Text>
          <Text as="dd" variant="md-semibold" className="text-text-primary m-0 text-right">
            {designatedCount}건
          </Text>
        </div>
      </dl>
    </article>
  );
}
