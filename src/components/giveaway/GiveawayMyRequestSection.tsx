import Button from "@/components/common/Button/Button";
import { Text } from "@/components/common/Text";
import GiveawayRequestCardLayout from "@/components/giveaway/GiveawayRequestCardLayout";
import {
  GIVEAWAY_EDIT_BUTTON_LABEL,
  GIVEAWAY_MY_REQUEST_SECTION_ID,
  GIVEAWAY_MY_REQUEST_TITLE,
  GIVEAWAY_MY_REQUEST_TITLE_ID,
  GIVEAWAY_REQUEST_CONTENT_LABEL,
  GIVEAWAY_REQUEST_EMPTY_MESSAGE,
  canCancelGiveawayRequest,
  canEditGiveawayRequest,
  getGiveawayRequestStatusLabel,
} from "@/lib/constants/giveaway";
import type { GiveawayDetail, MyGiveawayRequestItem } from "@/types/giveaway";

interface GiveawayMyRequestSectionProps {
  giveaway: GiveawayDetail;
  onEdit: (request: MyGiveawayRequestItem) => void;
  onCancel: (request: MyGiveawayRequestItem) => void;
}

const MY_REQUEST_CONTENT_TITLE_ID = "giveaway-my-request-content-title";

const toMyGiveawayRequestItem = (giveaway: GiveawayDetail): MyGiveawayRequestItem | null => {
  if (giveaway.myRequest === null) {
    return null;
  }

  return {
    id: giveaway.myRequest.id,
    status: giveaway.myRequest.status,
    message: giveaway.myRequest.message,
    createdAt: giveaway.myRequest.createdAt,
    updatedAt: giveaway.myRequest.updatedAt,
    giveaway: {
      id: giveaway.id,
      title: giveaway.title,
      status: giveaway.status,
      author: giveaway.author,
      region: giveaway.region,
      thumbnailUrl: giveaway.images[0]?.imageUrl ?? null,
    },
  };
};

const GiveawayMyRequestSection = ({
  giveaway,
  onEdit,
  onCancel,
}: GiveawayMyRequestSectionProps) => {
  const request = toMyGiveawayRequestItem(giveaway);

  if (request === null) {
    return null;
  }

  const canEdit = canEditGiveawayRequest(request);
  const canCancel = canCancelGiveawayRequest(request);
  const hasActions = canEdit || canCancel;
  const message = request.message?.trim() || GIVEAWAY_REQUEST_EMPTY_MESSAGE;
  const statusLabel = getGiveawayRequestStatusLabel(request.status);

  return (
    <section
      id={GIVEAWAY_MY_REQUEST_SECTION_ID}
      className="flex w-full flex-col gap-20"
      aria-labelledby={GIVEAWAY_MY_REQUEST_TITLE_ID}
    >
      <Text
        as="h2"
        id={GIVEAWAY_MY_REQUEST_TITLE_ID}
        tabIndex={-1}
        variant={{ base: "xl-bold", md: "2xl-bold" }}
        className="text-text-primary focus-visible:ring-border-brand rounded-4 focus-visible:ring-2 focus-visible:outline-none"
      >
        {GIVEAWAY_MY_REQUEST_TITLE}
      </Text>

      <GiveawayRequestCardLayout
        labelledBy={MY_REQUEST_CONTENT_TITLE_ID}
        statusLabel={statusLabel}
        createdAt={request.createdAt}
        actions={
          hasActions ? (
            <>
              {canEdit ? (
                <Button
                  type="button"
                  variant="solid"
                  size="cta"
                  fullWidth
                  onClick={() => onEdit(request)}
                >
                  {GIVEAWAY_EDIT_BUTTON_LABEL}
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
                  취소하기
                </Button>
              ) : null}
            </>
          ) : undefined
        }
      >
        <div className="flex min-w-0 flex-col">
          <Text
            as="p"
            id={MY_REQUEST_CONTENT_TITLE_ID}
            variant={{ base: "lg-semibold", md: "2lg-bold" }}
            className="text-text-secondary"
          >
            {GIVEAWAY_REQUEST_CONTENT_LABEL}
          </Text>
          <Text
            as="p"
            variant={{ base: "xs-regular", md: "md-regular" }}
            className="text-text-secondary whitespace-pre-wrap"
          >
            {message}
          </Text>
        </div>
      </GiveawayRequestCardLayout>
    </section>
  );
};

export default GiveawayMyRequestSection;
