import Button from "@/components/common/Button/Button";
import { Text } from "@/components/common/Text";
import GiveawayProfileAvatar from "@/components/giveaway/GiveawayProfileAvatar";
import GiveawayReportButton from "@/components/giveaway/GiveawayReportButton";
import GiveawayRequestCardLayout from "@/components/giveaway/GiveawayRequestCardLayout";
import {
  GIVEAWAY_REJECT_BUTTON_LABEL,
  GIVEAWAY_REQUEST_CONTENT_LABEL,
  GIVEAWAY_REQUEST_EMPTY_MESSAGE,
  GIVEAWAY_SHARE_BUTTON_LABEL,
  canRejectGiveawayRequest,
  canSelectGiveawayRequest,
  getGiveawayRequestStatusLabel,
} from "@/lib/constants/giveaway";
import type { GiveawayRequestItem, GiveawayStatus } from "@/types/giveaway";

interface GiveawayReceivedRequestCardProps {
  request: GiveawayRequestItem;
  giveawayStatus: GiveawayStatus;
  isActionPending?: boolean;
  onSelect: (request: GiveawayRequestItem) => void;
  onReject: (request: GiveawayRequestItem) => void;
}

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
  const titleId = `giveaway-request-${String(request.id)}-title`;
  const hasActions = canSelect || canReject;

  return (
    <GiveawayRequestCardLayout
      labelledBy={titleId}
      statusLabel={statusLabel}
      createdAt={request.createdAt}
      extra={<GiveawayReportButton className="w-fit" />}
      actions={
        hasActions ? (
          <>
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
          </>
        ) : undefined
      }
    >
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
            {request.requester.name}
          </Text>
          <Text as="p" variant={{ base: "xs-medium", md: "xs-medium" }} className="text-text-muted">
            {GIVEAWAY_REQUEST_CONTENT_LABEL}
          </Text>
          <Text
            as="p"
            variant={{ base: "xs-regular", md: "md-regular" }}
            className="text-text-secondary line-clamp-2"
          >
            {message}
          </Text>
        </div>
      </div>
    </GiveawayRequestCardLayout>
  );
};

export default GiveawayReceivedRequestCard;
