"use client";

import { useLocale, useTranslations } from "next-intl";

import AutoTranslatedText from "@/components/common/AutoTranslatedText";
import Button from "@/components/common/Button/Button";
import { MoveTypeChip } from "@/components/common/Chip/MoveTypeChip";
import ProfileAvatar from "@/components/common/ProfileAvatar/ProfileAvatar";
import { Text } from "@/components/common/Text";
import { DriverBadgeIcon } from "@/icons";
import {
  formatMoveDateLabelSafe,
  formatPrice,
  getReviewMoverDisplayName,
} from "@/lib/utils/estimateFormat";
import type { ReviewableEstimateItem } from "@/types/review";

interface WritableReviewCardProps {
  item: ReviewableEstimateItem;
  onWriteClick: (item: ReviewableEstimateItem) => void;
}

interface InfoFieldProps {
  label: string;
  value: string;
  fullValue?: string;
}

function summarizeAddress(address: string): string {
  const [region = "", district = ""] = address.trim().split(/\s+/);
  const shortenedRegion = region
    .replace(/특별시$/, "시")
    .replace(/광역시$/, "시")
    .replace(/특별자치시$/, "시")
    .replace(/특별자치도$/, "도");

  return [shortenedRegion, district].filter(Boolean).join(" ");
}

function InfoField({ label, value, fullValue = value }: InfoFieldProps) {
  return (
    <div className="flex min-w-0 flex-col items-start justify-center">
      <Text as="dt" variant={{ base: "xs-regular", xl: "md-regular" }} className="text-text-muted">
        {label}
      </Text>
      <Text
        as="dd"
        variant={{ base: "sm-medium", xl: "lg-regular" }}
        className="text-text-secondary m-0 max-w-full truncate"
        title={fullValue}
      >
        {value}
      </Text>
    </div>
  );
}

// 2026.07.27 정슬기 - [추가] 작성 가능 리뷰 카드
// 2026.07.27 정슬기 - [수정] Mobile 세로 / Tablet 강화 / Desktop 가로 CTA 반응형
// 2026.07.30 정슬기 - [수정] 기사님 표시명 공통 헬퍼 사용
// 2026.08.07 정슬기 - [수정] Figma 작성 가능 리뷰 카드 내부 레이아웃 반영
export default function WritableReviewCard({ item, onWriteClick }: WritableReviewCardProps) {
  const t = useTranslations("reviews");
  const locale = useLocale();
  const { mover, estimateRequest, price } = item;
  const moverLabel = getReviewMoverDisplayName(mover, locale);
  const titleId = `writable-review-${item.estimateId}-title`;
  const shortIntro = mover.shortIntro?.trim() ?? "";

  return (
    <article
      aria-labelledby={titleId}
      className="bg-background-surface border-border-subtle shadow-estimate-card rounded-16 md:rounded-20 flex w-full flex-col gap-20 border-[0.5px] px-16 py-20 md:gap-28 md:px-24 md:py-28 xl:flex-row xl:items-center xl:justify-between xl:gap-40 xl:px-32 xl:py-32"
    >
      <div className="flex w-full min-w-0 flex-col gap-20 xl:gap-24">
        {/* 상단: 프로필 + 기사 정보 / 견적 금액 */}
        <div className="flex w-full items-end gap-16 md:gap-24">
          <ProfileAvatar
            imageUrl={mover.imageUrl}
            alt={t("moverProfileImageAlt", { name: moverLabel })}
            sizes="(min-width: 1280px) 100px, (min-width: 768px) 80px, 64px"
            className="rounded-12 size-64 md:size-80 xl:size-100"
            imageClassName="object-contain"
          />

          <div className="flex min-w-0 flex-1 items-end gap-8">
            <div className="flex min-w-0 flex-1 flex-col items-start gap-8">
              <div className="flex w-full min-w-0 flex-col items-start">
                <div className="flex min-w-0 items-center gap-6">
                  <DriverBadgeIcon
                    className="h-18 w-16 shrink-0 xl:h-23 xl:w-20"
                    aria-hidden="true"
                  />
                  <Text
                    as="h3"
                    id={titleId}
                    variant={{ base: "md-semibold", xl: "2lg-bold" }}
                    className="text-text-primary truncate"
                  >
                    {moverLabel}
                  </Text>
                </div>

                {shortIntro ? (
                  <Text
                    as="p"
                    variant={{ base: "xs-regular", xl: "md-regular" }}
                    className="text-text-muted w-full truncate"
                    title={shortIntro}
                  >
                    <AutoTranslatedText text={shortIntro} />
                  </Text>
                ) : null}
              </div>

              <MoveTypeChip moveType={estimateRequest.moveType} size="sm" className="xl:hidden" />
              <MoveTypeChip
                moveType={estimateRequest.moveType}
                size="md"
                className="hidden xl:inline-flex"
              />
            </div>

            <div className="hidden w-160 shrink-0 flex-col items-end xl:flex">
              <Text as="span" variant="lg-medium" className="text-text-muted w-full text-right">
                {t("estimatePrice")}
              </Text>
              <Text as="p" variant="2xl-bold" className="text-text-secondary w-full text-right">
                {formatPrice(price, locale)}
              </Text>
            </div>
          </div>
        </div>

        {/* 모바일/태블릿 금액 */}
        <div className="flex items-end justify-between gap-12 xl:hidden">
          <Text as="span" variant="sm-medium" className="text-text-muted">
            {t("estimatePrice")}
          </Text>
          <Text as="p" variant={{ base: "xl-bold", md: "2xl-bold" }} className="text-text-primary">
            {formatPrice(price, locale)}
          </Text>
        </div>

        {/* 하단: 출발지 | 도착지 | 이사일 / 리뷰 작성 버튼 */}
        <div className="flex w-full flex-col gap-16 xl:flex-row xl:items-start xl:justify-between">
          <dl className="grid min-w-0 flex-1 grid-cols-1 gap-12 md:grid-cols-[1fr_auto_1fr_auto_1.4fr] md:items-center md:gap-20">
            <InfoField
              label={t("fromAddress")}
              value={summarizeAddress(estimateRequest.fromAddress)}
              fullValue={estimateRequest.fromAddress}
            />

            <div
              className="bg-border-subtle hidden h-50 w-px shrink-0 md:block"
              aria-hidden="true"
            />

            <InfoField
              label={t("toAddress")}
              value={summarizeAddress(estimateRequest.toAddress)}
              fullValue={estimateRequest.toAddress}
            />

            <div
              className="bg-border-subtle hidden h-50 w-px shrink-0 md:block"
              aria-hidden="true"
            />

            <InfoField
              label={t("moveDate")}
              value={formatMoveDateLabelSafe(estimateRequest.moveDate, "-", locale)}
            />
          </dl>

          <Button
            type="button"
            variant="solid"
            size="cta"
            fullWidth
            className="xl:w-160 xl:shrink-0"
            onClick={() => onWriteClick(item)}
            aria-label={t("writeReviewAria", { name: moverLabel })}
          >
            {t("writeReview")}
          </Button>
        </div>
      </div>
    </article>
  );
}
