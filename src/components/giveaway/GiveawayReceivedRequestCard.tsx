import Button from "@/components/common/Button/Button";
import { Text } from "@/components/common/Text";
import GiveawayProfileAvatar from "@/components/giveaway/GiveawayProfileAvatar";
import GiveawayReportButton from "@/components/giveaway/GiveawayReportButton";
import ResidenceReviewInfoItem from "@/components/residence-review/ResidenceReviewInfoItem";
import {
  GIVEAWAY_REJECT_BUTTON_LABEL,
  GIVEAWAY_REQUEST_CONTENT_LABEL,
  GIVEAWAY_REQUEST_DATE_LABEL,
  GIVEAWAY_REQUEST_EMPTY_MESSAGE,
  GIVEAWAY_REQUEST_STATUS_FIELD_LABEL,
  GIVEAWAY_REQUEST_STATUS_FIELD_LABEL_COMPACT,
  GIVEAWAY_SHARE_BUTTON_LABEL,
  canRejectGiveawayRequest,
  canSelectGiveawayRequest,
  getGiveawayRequestStatusLabel,
} from "@/lib/constants/giveaway";
import { formatKoreanDateTime } from "@/lib/utils/date";
import type { GiveawayRequestItem, GiveawayStatus } from "@/types/giveaway";

interface GiveawayReceivedRequestCardProps {
  request: GiveawayRequestItem;
  giveawayStatus: GiveawayStatus;
  isActionPending?: boolean;
  onSelect: (request: GiveawayRequestItem) => void;
  onReject: (request: GiveawayRequestItem) => void;
}

const InfoDivider = () => {
  return (
    <span className="bg-border-subtle hidden h-50 w-px shrink-0 md:block" aria-hidden="true" />
  );
};

const formatRequestDate = (value: string): string => {
  try {
    return formatKoreanDateTime(value);
  } catch {
    return "";
  }
};

const GiveawayReceivedRequestCard = ({
  request,
  giveawayStatus,
  isActionPending = false,
  onSelect,
  onReject,
}: GiveawayReceivedRequestCardProps) => {
  const canSelect = canSelectGiveawayRequest(giveawayStatus, request.status);
  const canReject = canRejectGiveawayRequest(giveawayStatus, request.status);
  const message = request.message?.trim() || GIVEAWAY_REQUEST_EMPTY_MESSAGE;
  const statusLabel = getGiveawayRequestStatusLabel(request.status);
  const appliedDate = formatRequestDate(request.createdAt);
  const titleId = `giveaway-request-${String(request.id)}-title`;

  return (
    <article
      aria-labelledby={titleId}
      className="bg-background-default border-border-subtle shadow-estimate-card rounded-20 flex w-full flex-col gap-16 border-[0.5px] px-20 py-24 md:gap-24 md:px-32 md:py-32 xl:px-40"
    >
      <div className="flex w-full flex-col gap-16 xl:flex-row xl:items-center xl:gap-12">
        <div className="flex min-w-0 flex-1 flex-col gap-8">
          <div className="flex items-center gap-12 md:gap-20">
            <GiveawayProfileAvatar
              imageUrl={request.requester.imageUrl}
              className="rounded-12 size-64 md:size-80"
              sizes="80px"
            />

            <div className="flex min-w-0 flex-1 flex-col">
              <Text
                as="h3"
                id={titleId}
                variant={{ base: "lg-bold", md: "2lg-bold" }}
                className="text-text-secondary"
              >
                {GIVEAWAY_REQUEST_CONTENT_LABEL}
              </Text>
              <Text
                as="p"
                variant={{ base: "xs-regular", md: "md-regular" }}
                className="text-text-secondary line-clamp-2"
              >
                {message}
              </Text>
              <Text
                as="p"
                variant={{ base: "xs-medium", md: "xs-medium" }}
                className="text-text-muted"
              >
                {request.requester.name}
              </Text>
            </div>
          </div>

          <dl className="flex w-full flex-col gap-16 md:flex-row md:items-center md:gap-20">
            <ResidenceReviewInfoItem
              label={GIVEAWAY_REQUEST_STATUS_FIELD_LABEL_COMPACT}
              value={statusLabel}
              className="md:hidden"
              labelVariant={{ base: "xs-regular", md: "md-regular" }}
              valueVariant={{ base: "sm-medium", md: "lg-regular" }}
            />
            <ResidenceReviewInfoItem
              label={GIVEAWAY_REQUEST_STATUS_FIELD_LABEL}
              value={statusLabel}
              className="hidden md:flex"
              labelVariant={{ base: "xs-regular", md: "md-regular" }}
              valueVariant={{ base: "sm-medium", md: "lg-regular" }}
            />
            <InfoDivider />
            <ResidenceReviewInfoItem
              label={GIVEAWAY_REQUEST_DATE_LABEL}
              value={appliedDate}
              labelVariant={{ base: "xs-regular", md: "md-regular" }}
              valueVariant={{ base: "sm-medium", md: "lg-regular" }}
            />
          </dl>

          <GiveawayReportButton className="w-fit" />
        </div>

        {canSelect || canReject ? (
          <div className="flex w-full flex-col gap-8 xl:w-160 xl:shrink-0">
            {canSelect ? (
              <Button
                type="button"
                variant="solid"
                size="cta"
                fullWidth
                disabled={isActionPending}
                onClick={() => onSelect(request)}
              >
                {GIVEAWAY_SHARE_BUTTON_LABEL}
              </Button>
            ) : null}
            {canReject ? (
              <Button
                type="button"
                variant="outline"
                size="cta"
                fullWidth
                disabled={isActionPending}
                onClick={() => onReject(request)}
              >
                {GIVEAWAY_REJECT_BUTTON_LABEL}
              </Button>
            ) : null}
          </div>
        ) : null}
      </div>
    </article>
  );
};

export default GiveawayReceivedRequestCard;
