"use client";

import AutoTranslatedText from "@/components/common/AutoTranslatedText";

import { useFormatter, useTranslations } from "next-intl";
import Link from "next/link";

import Button from "@/components/common/Button/Button";
import { Text } from "@/components/common/Text";
import GiveawayThumbnailImage from "@/components/giveaway/GiveawayThumbnailImage";
import ResidenceReviewInfoItem from "@/components/residence-review/ResidenceReviewInfoItem";
import { APP_ROUTES } from "@/lib/constants/appRoutes";
import { canCancelGiveawayRequest, canEditGiveawayRequest } from "@/lib/constants/giveaway";
import { markInternalDetailNavigationOnClick } from "@/lib/utils/detailNavigation";
import type { MyGiveawayRequestItem } from "@/types/giveaway";

interface MyGiveawayRequestCardProps {
  request: MyGiveawayRequestItem;
  onEdit: (request: MyGiveawayRequestItem) => void;
  onCancel: (request: MyGiveawayRequestItem) => void;
}

const InfoDivider = () => {
  return (
    <span className="bg-border-subtle hidden h-50 w-px shrink-0 md:block" aria-hidden="true" />
  );
};

const MyGiveawayRequestCard = ({ request, onEdit, onCancel }: MyGiveawayRequestCardProps) => {
  const t = useTranslations("giveaway");
  const format = useFormatter();
  const titleId = `my-giveaway-request-${String(request.id)}-title`;
  const detailHref = APP_ROUTES.COMMUNITY.GIVEAWAY_DETAIL(request.giveaway.id);
  const statusLabel = t(`requestStatusValues.${request.status}`);
  const date = new Date(request.createdAt);
  const appliedDate = Number.isNaN(date.getTime())
    ? ""
    : format.dateTime(date, { year: "numeric", month: "2-digit", day: "2-digit" });
  const canEdit = canEditGiveawayRequest(request);
  const canCancel = canCancelGiveawayRequest(request);
  const hasActions = canEdit || canCancel;
  const message = request.message?.trim() || t("none");

  return (
    <article
      aria-labelledby={titleId}
      className="bg-background-default border-border-subtle shadow-estimate-card rounded-20 flex w-full flex-col gap-20 border-[0.5px] px-20 py-24 md:gap-40 md:p-32 xl:flex-row xl:items-center xl:justify-between xl:gap-12 xl:px-40"
    >
      <div className="flex min-w-0 flex-1 flex-col gap-12 md:gap-8">
        <div className="flex items-center gap-8 md:gap-20">
          <div className="bg-background-avatar rounded-12 relative size-64 shrink-0 overflow-hidden md:size-80">
            <GiveawayThumbnailImage
              src={request.giveaway.thumbnailUrl}
              sizes="(min-width: 768px) 80px, 64px"
              iconClassName="size-32"
            />
          </div>

          <div className="flex min-w-0 flex-1 flex-col">
            <Link
              href={detailHref}
              className="hover:text-text-brand focus-visible:ring-border-brand rounded-4 min-w-0 focus-visible:ring-2 focus-visible:outline-none"
              onClick={(event) => markInternalDetailNavigationOnClick(event, detailHref)}
            >
              <Text
                as="h2"
                id={titleId}
                variant={{ base: "lg-semibold", md: "2lg-bold" }}
                className="text-text-secondary line-clamp-1"
              >
                <AutoTranslatedText text={request.giveaway.title} />
              </Text>
            </Link>
            <Text
              as="p"
              variant={{ base: "xs-regular", md: "md-regular" }}
              className="text-text-secondary md:text-text-muted line-clamp-1"
            >
              {request.giveaway.author.name}
            </Text>
          </div>
        </div>

        <dl className="flex w-full flex-col gap-16 md:flex-row md:items-center md:gap-20">
          <ResidenceReviewInfoItem
            label={t("requestStatusCompact")}
            value={statusLabel}
            className="md:hidden"
          />
          <ResidenceReviewInfoItem
            label={t("requestStatus")}
            value={statusLabel}
            className="hidden md:flex"
          />
          <InfoDivider />
          <ResidenceReviewInfoItem label={t("requestDate")} value={appliedDate} />
        </dl>

        <div className="flex min-w-0 flex-col">
          <Text
            as="p"
            variant={{ base: "lg-semibold", md: "2lg-bold" }}
            className="text-text-secondary"
          >
            {t("requestContent")}
          </Text>
          <Text
            as="p"
            variant={{ base: "xs-regular", md: "md-regular" }}
            className="text-text-secondary line-clamp-1"
          >
            {message}
          </Text>
        </div>
      </div>

      {hasActions ? (
        <div className="flex w-full flex-col gap-8 md:flex-row md:gap-12 xl:w-160 xl:shrink-0 xl:flex-col xl:gap-8">
          {canEdit ? (
            <Button
              type="button"
              variant="solid"
              size="cta"
              fullWidth
              onClick={() => onEdit(request)}
            >
              {t("edit")}
            </Button>
          ) : null}
          {canCancel ? (
            <Button
              type="button"
              variant="outline"
              size="cta"
              fullWidth
              onClick={() => onCancel(request)}
            >
              {t("cancelRequest")}
            </Button>
          ) : null}
        </div>
      ) : null}
    </article>
  );
};

export default MyGiveawayRequestCard;
