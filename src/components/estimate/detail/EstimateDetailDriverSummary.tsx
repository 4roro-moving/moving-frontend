import { Text } from "@/components/common/Text";
import MoveTypeChip, { DesignatedChip } from "@/components/estimate/received/MoveTypeChip";
import { ConfirmedCheckIcon, LikeIcon, StarIcon } from "@/icons";
import { formatRating } from "@/lib/utils/estimateFormat";
import type { EstimateDetail } from "@/types/estimate";

interface EstimateDetailDriverSummaryProps {
  detail: EstimateDetail;
}

export default function EstimateDetailDriverSummary({ detail }: EstimateDetailDriverSummaryProps) {
  const { mover, isConfirmed, isDesignated, estimateRequest } = detail;
  const displayName = mover.nickname || mover.name;
  const intro = mover.shortIntro ?? "고객님의 물품을 안전하게 운송해 드립니다.";

  return (
    <section className="flex w-full flex-col gap-20" aria-label="기사 정보">
      <div className="flex w-full flex-col gap-12">
        <div className="flex items-center gap-12">
          <MoveTypeChip moveType={estimateRequest.moveType} />
          {isDesignated ? <DesignatedChip /> : null}
        </div>

        <div className="flex w-full items-start justify-between gap-12">
          <Text as="p" variant="2xl-semibold" className="text-text-secondary">
            {intro}
          </Text>

          {isConfirmed ? (
            <span className="flex shrink-0 items-center gap-4">
              <ConfirmedCheckIcon className="text-icon-brand size-20 shrink-0" aria-hidden="true" />
              <Text as="span" variant="lg-bold" className="text-text-brand">
                확정견적
              </Text>
            </span>
          ) : (
            <Text as="span" variant="lg-semibold" className="text-text-subtle shrink-0">
              견적대기
            </Text>
          )}
        </div>
      </div>

      <div className="border-border-subtle w-full border-t" aria-hidden="true" />

      <div className="flex w-full flex-col gap-8">
        <div className="flex w-full items-start justify-between gap-8">
          <Text as="p" variant="2lg-semibold" className="text-text-primary">
            {displayName} 기사님
          </Text>
          <div className="flex shrink-0 items-center gap-4">
            <Text as="span" variant="2lg-medium" className="text-text-muted">
              {mover.favoriteCount}
            </Text>
            {/* 2026.07.24 정슬기 - [수정] 상세 찜 표시에도 isFavorite fill 연동 */}
            <LikeIcon
              isFavorite={mover.isFavorite}
              className={mover.isFavorite ? "text-text-brand size-24" : "text-icon-default size-24"}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-8">
          <div className="flex items-center gap-2">
            <StarIcon className="text-rating-fill size-20 shrink-0" aria-hidden="true" />
            <div className="flex items-center gap-2">
              <Text as="span" variant="md-medium" className="text-text-secondary">
                {formatRating(mover.averageRating)}
              </Text>
              <Text as="span" variant="md-medium" className="text-text-weak">
                ({mover.reviewCount})
              </Text>
            </div>
          </div>

          <span className="bg-border-muted h-14 w-px shrink-0" aria-hidden="true" />

          <div className="flex items-center gap-4">
            <Text as="span" variant="md-medium" className="text-text-muted">
              경력
            </Text>
            <Text as="span" variant="md-medium" className="text-text-secondary">
              {mover.career}년
            </Text>
          </div>

          <span className="bg-border-muted h-14 w-px shrink-0" aria-hidden="true" />

          <div className="flex items-center gap-4">
            <Text as="span" variant="md-medium" className="text-text-secondary">
              {mover.confirmedCount}건
            </Text>
            <Text as="span" variant="md-medium" className="text-text-muted">
              확정
            </Text>
          </div>
        </div>
      </div>
    </section>
  );
}
