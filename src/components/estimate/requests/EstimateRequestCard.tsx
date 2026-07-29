import Link from "next/link";

import { Text } from "@/components/common/Text";
import { DesignatedChip, MoveTypeChip } from "@/components/estimate/received/MoveTypeChip";
import { cn } from "@/lib/utils/cn";
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
 * 보낸 견적 요청 목록 카드
 * 받았던 견적 패널(EstimateDetailPanel)과 동일 border/radius/padding/shadow 토큰을 사용합니다.
 * // 2026.07.29 정슬기 - [추가]
 * // 2026.07.29 정슬기 - [수정] 패널 스타일 정합·상세 Link·표시 필드를 API 실존 값으로 정리
 */
export default function EstimateRequestCard({ request }: EstimateRequestCardProps) {
  const designatedCount = request.designatedMovers.length;
  const titleId = `estimate-request-${request.id}-title`;
  const href = `/estimates/requests/${request.id}`;

  return (
    <Link
      href={href}
      aria-labelledby={titleId}
      className={cn(
        "bg-background-default md:bg-background-surface md:rounded-20 md:border-border-subtle",
        "flex w-full flex-col border-0 px-0 py-0 shadow-none",
        "md:border-[0.5px] md:px-28 md:py-32",
        "md:shadow-[-2px_-2px_10px_0_rgba(220,220,220,0.14),2px_2px_10px_0_rgba(220,220,220,0.14)]",
        "lg:px-40 lg:pt-48 lg:pb-40",
        "focus-visible:ring-border-brand rounded-0 md:rounded-20 focus-visible:ring-2 focus-visible:outline-none",
        "hover:bg-background-subtle/40 md:hover:bg-background-surface transition-colors",
      )}
    >
      <article className="flex w-full flex-col gap-16 md:gap-20">
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
            견적 요청일 {formatRequestDateLabel(request.createdAt)}
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
        </dl>
      </article>
    </Link>
  );
}
