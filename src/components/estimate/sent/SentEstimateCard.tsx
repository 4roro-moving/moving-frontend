import { Text } from "@/components/common/Text";
import { DesignatedChip, MoveTypeChip } from "@/components/estimate/received/MoveTypeChip";
import FrameIcon from "@/icons/frame.svg";
import { formatKoreanDateTime } from "@/lib/utils/date";
import type { MoveType } from "@/types/move";

export interface SentEstimateItem {
  id: number;
  customerName: string;
  moveType: MoveType;
  isDesignated: boolean;
  fromRegion: string;
  toRegion: string;
  moveDate: string;
  price: number;
  status: "SENT" | "CONFIRMED" | "COMPLETED";
}

interface SentEstimateCardProps {
  estimate: SentEstimateItem;
  onViewDetail?: (estimateId: number) => void;
}

function RouteArrow() {
  return (
    <span className="mb-[9px] flex w-[18px] items-center" aria-hidden="true">
      <span className="bg-text-secondary h-px flex-1" />
      <span className="border-text-secondary -ml-1 size-1.5 rotate-45 border-t border-r" />
    </span>
  );
}

export default function SentEstimateCard({ estimate, onViewDetail }: SentEstimateCardProps) {
  const isConfirmed = estimate.status !== "SENT";
  const isCompleted = estimate.status === "COMPLETED";

  return (
    <article className="border-border-subtle bg-background-default shadow-estimate-card rounded-20 relative flex min-h-[333px] w-full flex-col gap-24 overflow-hidden border-[0.5px] px-20 py-24 md:min-h-[322px] md:gap-32 md:px-40 md:py-32 lg:min-h-[324px]">
      <div className="flex flex-1 flex-col gap-16 md:gap-24">
        <div className="flex min-h-26 items-center justify-between">
          <div className="flex items-center gap-8">
            <MoveTypeChip moveType={estimate.moveType} size="sm" className="md:hidden" />
            <MoveTypeChip
              moveType={estimate.moveType}
              size="md"
              className="hidden md:inline-flex"
            />
            {estimate.isDesignated ? (
              <>
                <DesignatedChip size="sm" className="md:hidden" />
                <DesignatedChip size="md" className="hidden md:inline-flex" />
              </>
            ) : null}
          </div>

          {isConfirmed ? (
            <span className="text-text-brand flex shrink-0 items-center gap-4">
              <FrameIcon className="size-20 shrink-0" aria-hidden="true" />
              <Text variant="lg-bold">확정견적</Text>
            </span>
          ) : null}
        </div>

        <div className="flex flex-col gap-12">
          <Text as="h2" variant="xl-semibold" className="text-text-primary">
            {estimate.customerName} 고객님
          </Text>
          <div className="bg-border-subtle h-px" />
        </div>

        <dl className="flex flex-col gap-12 md:flex-row md:items-start md:justify-between md:gap-20">
          <div className="flex items-end gap-12">
            <div>
              <Text as="dt" variant="md-regular" className="text-text-muted">
                출발지
              </Text>
              <Text as="dd" variant="lg-semibold" className="text-text-secondary whitespace-nowrap">
                {estimate.fromRegion}
              </Text>
            </div>
            <RouteArrow />
            <div>
              <Text as="dt" variant="md-regular" className="text-text-muted">
                도착지
              </Text>
              <Text as="dd" variant="lg-semibold" className="text-text-secondary whitespace-nowrap">
                {estimate.toRegion}
              </Text>
            </div>
          </div>

          <div>
            <Text as="dt" variant="md-regular" className="text-text-muted">
              이사일
            </Text>
            <Text as="dd" variant="lg-semibold" className="text-text-secondary whitespace-nowrap">
              {formatKoreanDateTime(estimate.moveDate)}
            </Text>
          </div>
        </dl>
      </div>

      <div className="border-border-default flex h-47 items-end justify-between border-t md:h-52">
        <Text variant={{ base: "md-medium", md: "lg-medium" }} className="text-text-muted">
          견적 금액
        </Text>
        <Text variant={{ base: "2lg-bold", md: "2xl-bold" }} className="text-text-secondary">
          {estimate.price.toLocaleString("ko-KR")}원
        </Text>
      </div>

      {isCompleted ? (
        <div className="bg-overlay-card-disabled border-border-dimmed rounded-20 absolute inset-[-0.5px] flex items-center justify-center border">
          <div className="flex w-[200px] flex-col items-center gap-20">
            <Text variant="2lg-semibold" className="text-text-inverse">
              이사 완료된 견적이에요
            </Text>
            <button
              type="button"
              className="bg-background-brand-muted border-border-brand text-text-brand shadow-cta rounded-12 flex h-54 w-full items-center justify-center border"
              onClick={() => onViewDetail?.(estimate.id)}
            >
              <Text variant="lg-semibold">견적 상세보기</Text>
            </button>
          </div>
        </div>
      ) : null}
    </article>
  );
}
