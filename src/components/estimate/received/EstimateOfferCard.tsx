"use client";

import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";

import AutoTranslatedText from "@/components/common/AutoTranslatedText";
import { Text } from "@/components/common/Text";
import { MoveTypeChip } from "@/components/common/Chip/MoveTypeChip";
import DesignatedChip from "@/components/estimate/DesignatedChip";
import { FavoriteButton } from "@/components/mover/FavoriteButton";
import { useFavoriteMover } from "@/hooks/useFavoriteMover";
import { ConfirmedCheckIcon, ProfileDefaultIcon, StarIcon } from "@/icons";
import { APP_ROUTES } from "@/lib/constants/appRoutes";
import { markInternalDetailNavigationOnClick } from "@/lib/utils/detailNavigation";
import { cn } from "@/lib/utils/cn";
import { formatPrice, formatRating } from "@/lib/utils/estimateFormat";
import { resolveMoverProfileImageSrc } from "@/lib/utils/moverProfileImage";
import type { ReceivedEstimateListItem } from "@/types/estimate";
import type { MoveType } from "@/types/move";

interface EstimateOfferCardProps {
  offer: ReceivedEstimateListItem;
  moveType: MoveType;
  className?: string;
  onFavoriteError?: (message: string) => void;
}

function EstimateStatusBadge({ status }: { status: ReceivedEstimateListItem["status"] }) {
  const t = useTranslations("estimates");
  if (status === "CONFIRMED") {
    return (
      <span className="flex shrink-0 items-center gap-4">
        <ConfirmedCheckIcon className="text-icon-brand size-20 shrink-0" />
        <Text as="span" variant="lg-bold" className="text-text-brand">
          {t("detail.confirmedStatus")}
        </Text>
      </span>
    );
  }

  return (
    <Text as="span" variant="lg-semibold" className="text-text-subtle shrink-0">
      {t("detail.waitingStatus")}
    </Text>
  );
}

export default function EstimateOfferCard({
  offer,
  moveType,
  className,
  onFavoriteError,
}: EstimateOfferCardProps) {
  const t = useTranslations("estimates");
  const locale = useLocale();
  const { mover, status, isDesignated, price } = offer;
  const displayName = mover.nickname || mover.name;
  const intro = mover.shortIntro ?? t("received.defaultIntro");
  const detailHref = APP_ROUTES.ESTIMATES.DETAIL(offer.id);
  const favoriteMutation = useFavoriteMover({ onError: onFavoriteError });

  return (
    <article
      // 2026.07.24 정슬기 - [수정] Mobile 카드는 border/shadow 없이 flat, 내부 프로필 박스만 muted border
      className={cn(
        "bg-background-default flex w-full flex-col items-stretch gap-8 border-0 py-20 shadow-none md:px-8",
        className,
      )}
    >
      <div className="flex w-full flex-col gap-16 md:gap-20">
        <div className="flex items-center gap-8">
          <MoveTypeChip moveType={moveType} />
          {isDesignated ? <DesignatedChip /> : null}
        </div>

        <div className="flex w-full flex-col gap-16">
          <div className="flex w-full items-start justify-between gap-12">
            {/* 2026.07.24 정슬기 - [수정] 반응형 타이포를 Text variant로 분리 */}
            <Text
              as="p"
              variant="lg-semibold"
              className="text-text-secondary min-w-0 break-words md:hidden"
            >
              <AutoTranslatedText text={intro} />
            </Text>
            <Text
              as="p"
              variant="2lg-semibold"
              className="text-text-secondary hidden min-w-0 truncate md:block"
            >
              <AutoTranslatedText text={intro} />
            </Text>

            <div className="hidden shrink-0 md:block">
              <EstimateStatusBadge status={status} />
            </div>
          </div>

          {/* 2026.07.24 정슬기 - [수정] 상세 이동과 찜 동작이 충돌하지 않도록 Link와 버튼 영역 분리 */}
          <div className="border-border-muted rounded-12 flex w-full items-end justify-between gap-12 border border-solid py-12 pr-20 pl-12 shadow-none">
            <Link
              href={detailHref}
              onClick={(event) => markInternalDetailNavigationOnClick(event, detailHref)}
              className="focus-visible:ring-border-brand rounded-8 flex min-w-0 flex-1 items-end gap-12 focus-visible:ring-2 focus-visible:outline-none"
              aria-label={t("received.detailAria", { name: displayName })}
            >
              <div className="bg-background-avatar rounded-12 relative size-50 shrink-0 overflow-hidden">
                {mover.imageUrl ? (
                  <Image
                    src={resolveMoverProfileImageSrc(mover.imageUrl)}
                    alt={t("received.profileAlt", { name: displayName })}
                    fill
                    sizes="50px"
                    className="object-cover"
                  />
                ) : (
                  <ProfileDefaultIcon className="size-full" />
                )}
              </div>

              <div className="flex min-w-0 flex-1 flex-col gap-4 md:gap-8">
                <Text
                  as="p"
                  variant="md-semibold"
                  className="text-text-primary break-words md:hidden"
                >
                  {t("detail.moverName", { name: displayName })}
                </Text>
                <Text
                  as="p"
                  variant="lg-semibold"
                  className="text-text-primary hidden break-words md:block"
                >
                  {t("detail.moverName", { name: displayName })}
                </Text>

                <div className="flex w-full flex-wrap items-center gap-x-8 gap-y-4">
                  <div className="flex items-center gap-2">
                    <StarIcon className="text-rating-fill size-20 shrink-0" />
                    <div className="flex items-center gap-2">
                      <Text as="span" variant="sm-medium" className="text-text-secondary">
                        <span className="sr-only">{t("detail.rating")} </span>
                        {formatRating(mover.averageRating)}
                        <span className="sr-only">{t("detail.pointsReviews")} </span>
                      </Text>
                      <Text as="span" variant="sm-medium" className="text-text-muted">
                        <span aria-hidden="true">({mover.reviewCount})</span>
                        <span className="sr-only">
                          {t("detail.reviewCount", { count: mover.reviewCount })}
                        </span>
                      </Text>
                    </div>
                  </div>

                  <span className="bg-border-muted h-14 w-px shrink-0" aria-hidden="true" />

                  <div className="flex items-center gap-4">
                    <Text as="span" variant="sm-medium" className="text-text-muted">
                      {t("detail.career")}
                    </Text>
                    <Text as="span" variant="sm-medium" className="text-text-secondary">
                      {t("detail.careerYears", { count: mover.career })}
                    </Text>
                  </div>

                  <span
                    className="bg-border-muted hidden h-14 w-px shrink-0 sm:block"
                    aria-hidden="true"
                  />

                  <div className="flex items-center gap-4">
                    <Text as="span" variant="sm-medium" className="text-text-secondary">
                      {t("detail.confirmedCount", { count: mover.confirmedCount })}
                    </Text>
                    <Text as="span" variant="sm-medium" className="text-text-muted">
                      {t("detail.confirmed")}
                    </Text>
                  </div>
                </div>
              </div>
            </Link>

            <FavoriteButton
              moverName={displayName}
              isFavorite={mover.isFavorite}
              favoriteCount={mover.favoriteCount}
              showCount
              interactive={favoriteMutation.canToggleFavorite}
              className="min-h-44 min-w-44 justify-center gap-2 px-4 py-2"
              onToggle={(nextIsFavorite) => {
                favoriteMutation.mutate({ moverId: mover.id, nextIsFavorite });
              }}
            />
          </div>
        </div>

        <div className="flex h-32 w-full items-center justify-between gap-12 md:justify-end">
          <div className="md:hidden">
            <EstimateStatusBadge status={status} />
          </div>
          <div className="flex items-center gap-8 md:gap-12">
            <Text as="span" variant="md-medium" className="text-text-muted shrink-0">
              {t("detail.price")}
            </Text>
            <Text as="p" variant="2lg-bold" className="text-text-primary break-words md:hidden">
              {formatPrice(price, locale)}
            </Text>
            <Text
              as="p"
              variant="2xl-bold"
              className="text-text-primary hidden break-words md:block"
            >
              {formatPrice(price, locale)}
            </Text>
          </div>
        </div>
      </div>
    </article>
  );
}
