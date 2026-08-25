"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";

import { Text } from "@/components/common/Text";
import { FavoriteButton } from "@/components/mover/FavoriteButton";
import { MoverServiceTypeChips } from "@/components/mover/MoverServiceTypeChips";
import ReportMoreMenu from "@/components/report/ReportMoreMenu";
import { DriverBadgeIcon, StarIcon } from "@/icons";
import { formatRating } from "@/lib/utils/estimateFormat";
import { cn } from "@/lib/utils/cn";
import type { MoverDetail } from "@/types/moverDetail";

interface MoverDetailProfileProps {
  detail: MoverDetail;
  onToggleFavorite: () => void;
  onReport: () => void;
  showFavoriteAction?: boolean;
  showReportAction?: boolean;
}

export default function MoverDetailProfile({
  detail,
  onToggleFavorite,
  onReport,
  showFavoriteAction = true,
  showReportAction = false,
}: MoverDetailProfileProps) {
  const t = useTranslations("profile");
  return (
    <section className="flex w-full flex-col gap-36 md:gap-32" aria-label={t("moverDetailIntro")}>
      <div className="flex w-full flex-col gap-16 md:gap-20">
        <div className="flex w-full flex-col gap-12">
          <MoverServiceTypeChips serviceTypes={detail.serviceTypes} size="md" />

          <Text
            as="h1"
            variant={{
              base: "2lg-semibold",
              md: "2xl-semibold",
            }}
            className="text-text-secondary wrap-break-word"
          >
            {detail.title}
          </Text>
        </div>

        <div className="flex w-full items-center justify-between gap-8">
          <div className="flex min-w-0 items-center gap-4">
            <DriverBadgeIcon className="text-icon-brand size-20 shrink-0" aria-hidden="true" />

            <Text
              as="p"
              variant={{
                base: "lg-semibold",
                md: "2lg-semibold",
              }}
              className="text-text-primary"
            >
              {t("moverName", { name: detail.name })}
            </Text>
          </div>

          <div className="flex shrink-0 items-center gap-8">
            <FavoriteButton
              moverName={detail.name}
              isFavorite={detail.isFavorite}
              favoriteCount={detail.favoriteCount}
              showCount
              interactive={showFavoriteAction}
              countPosition="before"
              countVariant={{
                base: "md-semibold",
                md: "2lg-medium",
              }}
              className="min-h-44 gap-4 px-4 py-2"
              onToggle={onToggleFavorite}
            />

            {showReportAction ? (
              <ReportMoreMenu
                ariaLabel={t("moverDetailMenuAria")}
                onReport={onReport}
                triggerSizeClassName="size-36"
                triggerIconClassName="text-[24px] leading-none"
              />
            ) : null}
          </div>
        </div>

        <Text
          as="p"
          variant={{
            base: "md-regular",
            md: "lg-regular",
          }}
          className="text-text-muted whitespace-pre-line"
        >
          {detail.description}
        </Text>
      </div>

      <div
        className={cn(
          "border-border-default bg-background-surface flex w-full items-center justify-between border",
          "rounded-12 px-40 py-22",
          "md:rounded-16 md:px-[100px] md:py-28",
        )}
        aria-label={t("moverDetailPerformance")}
      >
        <StatItem
          label={t("myPageCompleted")}
          value={t("myPageCompletedCount", { count: detail.confirmedCount })}
        />

        <StatItem
          label={t("myPageReviews")}
          value={
            <span className="flex items-center gap-2 md:gap-6">
              <StarIcon
                className="text-rating-fill size-20 shrink-0 md:size-24"
                aria-hidden="true"
              />

              <span className="flex items-center gap-2 md:gap-6">
                <Text
                  as="span"
                  variant={{
                    base: "lg-semibold",
                    md: "xl-bold",
                  }}
                  className="text-text-primary"
                >
                  {formatRating(detail.rating)}
                </Text>

                <Text
                  as="span"
                  variant={{
                    base: "md-medium",
                    md: "lg-medium",
                  }}
                  className="text-text-weak"
                >
                  ({detail.reviewCount})
                </Text>
              </span>
            </span>
          }
        />

        <StatItem
          label={t("myPageCareer")}
          value={t("myPageCareerYears", { years: detail.careerYears })}
        />
      </div>
    </section>
  );
}

interface StatItemProps {
  label: string;
  value: ReactNode;
}

function StatItem({ label, value }: StatItemProps) {
  return (
    <div className="flex min-w-0 flex-col items-center gap-0 md:gap-4">
      <Text
        as="p"
        variant={{
          base: "md-regular",
          md: "lg-regular",
        }}
        className="text-text-muted md:text-text-tertiary text-center"
      >
        {label}
      </Text>

      {typeof value === "string" ? (
        <Text
          as="p"
          variant={{
            base: "lg-semibold",
            md: "xl-bold",
          }}
          className="text-text-primary text-center"
        >
          {value}
        </Text>
      ) : (
        value
      )}
    </div>
  );
}
