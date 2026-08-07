import { Text } from "@/components/common/Text";
import { MoveTypeChip } from "@/components/common/Chip/MoveTypeChip";
import DesignatedChip from "@/components/estimate/DesignatedChip";
import { formatKoreanDateTime } from "@/lib/utils/date";
import type { RejectedEstimateRequestItem } from "@/types/moverEstimateRequest";

interface RejectedRequestCardProps {
  item: RejectedEstimateRequestItem;
}

export default function RejectedRequestCard({ item }: RejectedRequestCardProps) {
  const { request } = item;

  return (
    <article className="border-border-subtle bg-background-surface shadow-estimate-card rounded-20 relative flex min-h-[333px] flex-col gap-24 overflow-hidden border px-20 py-24 md:min-h-[322px] md:gap-32 md:px-40 md:py-32">
      <div className="flex flex-1 flex-col gap-16 md:gap-24">
        <div className="flex flex-wrap gap-8">
          <MoveTypeChip moveType={request.moveType} size="sm" />
          {request.isDesignated ? <DesignatedChip size="sm" /> : null}
        </div>

        <div className="flex flex-col gap-12">
          <Text as="h2" variant="xl-semibold" className="text-text-primary">
            {request.customer.name} 고객님
          </Text>
          <div className="bg-border-subtle h-px" />
        </div>

        <dl className="flex flex-col gap-12 md:flex-row md:justify-between md:gap-20">
          <div className="flex items-end gap-12">
            <div>
              <Text as="dt" variant="md-regular" className="text-text-muted">
                출발지
              </Text>
              <Text as="dd" variant="lg-semibold" className="text-text-secondary">
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
              <Text as="dd" variant="lg-semibold" className="text-text-secondary">
                {request.toRegion}
              </Text>
            </div>
          </div>

          <div>
            <Text as="dt" variant="md-regular" className="text-text-muted">
              이사일
            </Text>
            <Text as="dd" variant="lg-semibold" className="text-text-secondary whitespace-nowrap">
              {formatKoreanDateTime(request.moveDate)}
            </Text>
          </div>
        </dl>
      </div>

      <div className="border-border-default flex h-47 items-end justify-between border-t md:h-52">
        <Text variant={{ base: "md-medium", md: "lg-medium" }} className="text-text-muted">
          견적 금액
        </Text>
        <Text variant={{ base: "2lg-bold", md: "2xl-bold" }} className="text-text-secondary">
          -
        </Text>
      </div>

      <div className="bg-overlay-card-disabled border-border-dimmed rounded-20 absolute inset-0 flex items-center justify-center border">
        <Text variant="2lg-semibold" className="text-text-inverse">
          반려된 요청이에요
        </Text>
      </div>
    </article>
  );
}
