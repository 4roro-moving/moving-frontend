import Image from "next/image";

import { Text } from "@/components/common/Text";
import { ConfirmedCheckIcon, LikeIcon, ProfileDefaultIcon, StarIcon } from "@/icons";
import { cn } from "@/lib/utils/cn";
import type { EstimateOffer } from "@/types/estimate";

import MoveTypeChip, { DesignatedChip } from "./MoveTypeChip";

interface EstimateOfferCardProps {
  offer: EstimateOffer;
  className?: string;
}

function formatPrice(price: number): string {
  return `${price.toLocaleString("ko-KR")}원`;
}

function formatRating(rating: number): string {
  return rating.toFixed(1);
}

export default function EstimateOfferCard({ offer, className }: EstimateOfferCardProps) {
  const { mover, status, isDesignated, moveType, price } = offer;
  const displayName = mover.name;
  const intro = mover.shortIntro ?? "고객님의 물품을 안전하게 운송해 드립니다.";

  return (
    <article
      className={cn(
        "bg-background-default flex w-full flex-col items-end gap-8 px-8 py-20",
        className,
      )}
    >
      <div className="flex w-full flex-col gap-20">
        <div className="flex items-center gap-8">
          <MoveTypeChip moveType={moveType} />
          {isDesignated && <DesignatedChip />}
        </div>

        <div className="flex w-full flex-col gap-16">
          <div className="flex w-full items-center justify-between gap-12">
            <Text as="p" variant="2lg-semibold" className="text-text-secondary truncate">
              {intro}
            </Text>

            {status === "confirmed" ? (
              <span className="flex shrink-0 items-center gap-4">
                <ConfirmedCheckIcon
                  className="text-icon-brand size-20 shrink-0"
                  aria-hidden="true"
                />
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

          <div className="border-border-muted rounded-12 flex w-full flex-col justify-center gap-10 border border-solid py-12 pr-20 pl-12">
            <div className="flex w-full items-end gap-12">
              <div className="bg-background-avatar rounded-12 relative size-[50px] shrink-0 overflow-hidden">
                {mover.imageUrl ? (
                  <Image
                    src={mover.imageUrl}
                    alt={`${displayName} 기사님 프로필`}
                    fill
                    sizes="50px"
                    className="object-cover"
                  />
                ) : (
                  <ProfileDefaultIcon className="size-full" aria-hidden="true" />
                )}
              </div>

              <div className="flex min-w-0 flex-1 flex-col gap-8">
                <div className="flex w-full items-center justify-between gap-8">
                  <Text as="p" variant="lg-semibold" className="text-text-primary">
                    {displayName} 기사님
                  </Text>
                  <div className="flex shrink-0 items-center justify-center gap-2">
                    <LikeIcon className="text-icon-default size-24" aria-hidden="true" />
                    <Text as="span" variant="md-regular" className="text-text-muted">
                      {mover.favoriteCount}
                    </Text>
                  </div>
                </div>

                <div className="flex w-full items-center gap-8">
                  <div className="flex items-center gap-2">
                    <StarIcon className="text-rating-fill size-20 shrink-0" aria-hidden="true" />
                    <div className="flex items-center gap-2">
                      <Text as="span" variant="sm-medium" className="text-text-secondary">
                        {formatRating(mover.averageRating)}
                      </Text>
                      <Text as="span" variant="sm-medium" className="text-text-muted">
                        ({mover.reviewCount})
                      </Text>
                    </div>
                  </div>

                  <span className="bg-border-muted h-14 w-px shrink-0" aria-hidden="true" />

                  <div className="flex items-center gap-4">
                    <Text as="span" variant="sm-medium" className="text-text-muted">
                      경력
                    </Text>
                    <Text as="span" variant="sm-medium" className="text-text-secondary">
                      {mover.career}년
                    </Text>
                  </div>

                  <span className="bg-border-muted h-14 w-px shrink-0" aria-hidden="true" />

                  <div className="flex items-center gap-4">
                    <Text as="span" variant="sm-medium" className="text-text-secondary">
                      {mover.confirmedCount}건
                    </Text>
                    <Text as="span" variant="sm-medium" className="text-text-muted">
                      확정
                    </Text>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex h-32 w-full items-center justify-end gap-12">
          <Text as="span" variant="md-medium" className="text-text-muted">
            견적 금액
          </Text>
          <Text as="p" variant="2xl-bold" className="text-text-primary">
            {formatPrice(price)}
          </Text>
        </div>
      </div>
    </article>
  );
}
