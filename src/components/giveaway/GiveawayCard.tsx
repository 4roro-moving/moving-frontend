"use client";

import AutoTranslatedText from "@/components/common/AutoTranslatedText";

import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";

import { Text } from "@/components/common/Text";
import GiveawayThumbnailImage from "@/components/giveaway/GiveawayThumbnailImage";
import { UserIcon } from "@/icons";
import { APP_ROUTES } from "@/lib/constants/appRoutes";
import { cn } from "@/lib/utils/cn";
import { formatRelativeTime } from "@/lib/utils/date";
import { markInternalDetailNavigationOnClick } from "@/lib/utils/detailNavigation";
import type { GiveawayListItem } from "@/types/giveaway";

interface GiveawayCardProps {
  giveaway: GiveawayListItem;
  preloadThumbnail?: boolean;
}

const GiveawayCard = ({ giveaway, preloadThumbnail = false }: GiveawayCardProps) => {
  const t = useTranslations("giveaway");
  const locale = useLocale();
  const detailHref = APP_ROUTES.COMMUNITY.GIVEAWAY_DETAIL(giveaway.id);
  const overlayLabel =
    giveaway.status === "IN_PROGRESS"
      ? t("statusInProgress")
      : giveaway.status === "COMPLETED"
        ? t("statusCompleted")
        : null;
  const writtenAt = formatRelativeTime(giveaway.createdAt, locale);
  const titleId = `giveaway-${String(giveaway.id)}-title`;
  const statusId = `giveaway-${String(giveaway.id)}-status`;

  return (
    <Link
      href={detailHref}
      aria-labelledby={overlayLabel ? `${titleId} ${statusId}` : titleId}
      className={cn(
        "bg-background-default border-border-subtle shadow-estimate-card rounded-20 flex w-full flex-col border-[0.5px] text-left",
        "gap-20 p-40",
        "hover:bg-background-hover focus-visible:ring-border-brand transition-colors focus-visible:ring-2 focus-visible:outline-none",
      )}
      onClick={(event) => markInternalDetailNavigationOnClick(event, detailHref)}
    >
      <div className="bg-background-muted rounded-6 relative h-[219px] w-full overflow-hidden">
        <GiveawayThumbnailImage
          src={giveaway.thumbnailUrl}
          sizes="(min-width: 1280px) 265px, (min-width: 768px) 45vw, 90vw"
          preload={preloadThumbnail}
        />
        {overlayLabel ? (
          <div className="bg-overlay-card-disabled pointer-events-none absolute inset-0 flex items-center justify-center">
            <Text as="span" id={statusId} variant="2lg-semibold" className="text-text-inverse">
              {overlayLabel}
            </Text>
          </div>
        ) : null}
      </div>

      <div className="flex w-full flex-col gap-12">
        <Text
          as="span"
          id={titleId}
          variant={{ base: "lg-semibold", xl: "xl-semibold" }}
          className="text-text-primary line-clamp-1 text-center"
        >
          <AutoTranslatedText text={giveaway.title} />
        </Text>
        <div className="flex w-full items-center justify-between">
          {writtenAt ? (
            <Text
              as="time"
              dateTime={giveaway.createdAt}
              variant="md-medium"
              className="text-text-muted"
            >
              {writtenAt}
            </Text>
          ) : (
            <span />
          )}
          <span
            className="flex items-center gap-2"
            aria-label={t("requestCountAria", { count: giveaway.activeRequestCount })}
          >
            <UserIcon className="size-16" aria-hidden="true" />
            <Text as="span" variant="md-medium" className="text-text-muted">
              {giveaway.activeRequestCount}
            </Text>
          </span>
        </div>
      </div>
    </Link>
  );
};

export default GiveawayCard;
