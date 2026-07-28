import Image from "next/image";

import Button from "@/components/common/Button/Button";
import { Text } from "@/components/common/Text";
import { MoveTypeChip, DesignatedChip } from "@/components/estimate/received/MoveTypeChip";
import { formatKoreanDateTime } from "@/lib/utils/date";
import type { MoverEstimateRequest } from "@/types/moverEstimateRequest";

function formatElapsedTime(date: string) {
  const minutes = Math.max(1, Math.floor((Date.now() - new Date(date).getTime()) / 60000));
  if (minutes < 60) return `${minutes}분 전`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;
  return `${Math.floor(hours / 24)}일 전`;
}

interface ReceivedRequestCardProps {
  request: MoverEstimateRequest;
  onSendEstimate: (request: MoverEstimateRequest) => void;
}

export default function ReceivedRequestCard({ request, onSendEstimate }: ReceivedRequestCardProps) {
  return (
    <article className="border-border-subtle bg-background-surface rounded-20 flex flex-col gap-24 border px-20 py-24 shadow-[0_0_10px_rgba(220,220,220,0.2)] min-[744px]:gap-32 min-[744px]:px-40 min-[744px]:py-32 lg:px-40 lg:py-32">
      <div className="flex flex-col gap-16 min-[744px]:gap-24">
        <div className="flex min-h-32 items-center justify-between gap-12">
          <div className="flex flex-wrap gap-8">
            <MoveTypeChip moveType={request.moveType} />
            {request.isDesignated ? <DesignatedChip /> : null}
          </div>
          <Text as="span" variant="md-regular" className="text-text-muted shrink-0">
            {formatElapsedTime(request.createdAt)}
          </Text>
        </div>

        <div className="flex flex-col gap-12">
          <Text as="h2" variant="xl-semibold" className="text-text-tertiary">
            {request.customer.name} 고객님
          </Text>
          <div className="bg-border-subtle h-px" />
        </div>

        <dl className="flex flex-col gap-12 sm:flex-row sm:justify-between sm:gap-20">
          <div className="flex items-end gap-12">
            <div>
              <Text as="dt" variant="md-regular" className="text-text-muted">
                출발지
              </Text>
              <Text as="dd" variant="lg-semibold" className="text-text-primary">
                {request.fromRegion}
              </Text>
            </div>
            <span className="mb-[9px] flex w-[18px] items-center" aria-hidden="true">
              <span className="bg-text-secondary h-px flex-1" />
              <span className="border-text-secondary -ml-1 h-1.5 w-1.5 rotate-45 border-t border-r" />
            </span>
            <div>
              <Text as="dt" variant="md-regular" className="text-text-muted">
                도착지
              </Text>
              <Text as="dd" variant="lg-semibold" className="text-text-primary">
                {request.toRegion}
              </Text>
            </div>
          </div>
          <div>
            <Text as="dt" variant="md-regular" className="text-text-muted">
              이사일
            </Text>
            <Text as="dd" variant="lg-semibold" className="text-text-primary whitespace-nowrap">
              {formatKoreanDateTime(request.moveDate)}
            </Text>
          </div>
        </dl>
      </div>

      <div className="flex flex-col gap-[11px] sm:grid sm:grid-cols-2 sm:gap-[11px]">
        <Button variant="outline" size="cta" fullWidth className="order-2 sm:order-1">
          반려하기
        </Button>
        <Button
          size="cta"
          fullWidth
          className="order-1"
          onClick={() => onSendEstimate(request)}
          rightIcon={<Image src="/icons/write.svg" alt="" width={24} height={24} />}
        >
          견적 보내기
        </Button>
      </div>
    </article>
  );
}
