import Button from "@/components/common/Button/Button";
import {
  GIVEAWAY_COMPLETE_BUTTON_LABEL,
  GIVEAWAY_DELETE_BUTTON_LABEL,
  GIVEAWAY_EDIT_BUTTON_LABEL,
  GIVEAWAY_THUMBNAIL_OVERLAY_LABEL,
  canCompleteGiveaway,
  canDeleteGiveaway,
  canEditGiveaway,
} from "@/lib/constants/giveaway";
import { GIVEAWAY_STATUS, type GiveawayStatus } from "@/types/giveaway";

interface GiveawayDetailActionsProps {
  status: GiveawayStatus;
  isAuthor: boolean;
  isCompletePending?: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onComplete: () => void;
}

const GiveawayDetailActions = ({
  status,
  isAuthor,
  isCompletePending = false,
  onEdit,
  onDelete,
  onComplete,
}: GiveawayDetailActionsProps) => {
  if (isAuthor) {
    if (canEditGiveaway(status) && canDeleteGiveaway(status)) {
      return (
        <div className="flex w-full gap-10">
          <Button type="button" variant="solid" size="cta" fullWidth onClick={onEdit}>
            {GIVEAWAY_EDIT_BUTTON_LABEL}
          </Button>
          <Button type="button" variant="outline" size="cta" fullWidth onClick={onDelete}>
            {GIVEAWAY_DELETE_BUTTON_LABEL}
          </Button>
        </div>
      );
    }

    if (canCompleteGiveaway(status)) {
      return (
        <Button
          type="button"
          variant="solid"
          size="cta"
          fullWidth
          disabled={isCompletePending}
          onClick={onComplete}
        >
          {isCompletePending ? "완료 중..." : GIVEAWAY_COMPLETE_BUTTON_LABEL}
        </Button>
      );
    }

    if (status === GIVEAWAY_STATUS.COMPLETED) {
      return (
        <Button type="button" variant="solid" size="cta" fullWidth disabled>
          {GIVEAWAY_THUMBNAIL_OVERLAY_LABEL.COMPLETED}
        </Button>
      );
    }

    return null;
  }

  if (status === GIVEAWAY_STATUS.IN_PROGRESS) {
    return (
      <Button type="button" variant="solid" size="cta" fullWidth disabled>
        {GIVEAWAY_THUMBNAIL_OVERLAY_LABEL.IN_PROGRESS}
      </Button>
    );
  }

  if (status === GIVEAWAY_STATUS.COMPLETED) {
    return (
      <Button type="button" variant="solid" size="cta" fullWidth disabled>
        {GIVEAWAY_THUMBNAIL_OVERLAY_LABEL.COMPLETED}
      </Button>
    );
  }

  return null;
};

export default GiveawayDetailActions;
