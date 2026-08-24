import type { MouseEvent } from "react";

import Button from "@/components/common/Button/Button";
import {
  GIVEAWAY_APPLY_BUTTON_LABEL,
  GIVEAWAY_COMPLETE_BUTTON_LABEL,
  GIVEAWAY_DELETE_BUTTON_LABEL,
  GIVEAWAY_EDIT_BUTTON_LABEL,
  GIVEAWAY_MY_REQUEST_SECTION_ID,
  GIVEAWAY_MY_REQUEST_TITLE_ID,
  GIVEAWAY_THUMBNAIL_OVERLAY_LABEL,
  GIVEAWAY_VIEW_MY_REQUEST_BUTTON_LABEL,
  canCompleteGiveaway,
  canDeleteGiveaway,
  canEditGiveaway,
} from "@/lib/constants/giveaway";
import { GIVEAWAY_STATUS, type GiveawayStatus } from "@/types/giveaway";

interface GiveawayDetailActionsProps {
  status: GiveawayStatus;
  isAuthor: boolean;
  canRequest: boolean;
  hasApplied: boolean;
  isCompletePending?: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onComplete: () => void;
  onApply: () => void;
}

const PREFERS_REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

const handleViewMyRequestClick = (event: MouseEvent<HTMLAnchorElement>) => {
  const heading = document.getElementById(GIVEAWAY_MY_REQUEST_TITLE_ID);
  if (!heading) {
    return;
  }

  const prefersReducedMotion = window.matchMedia(PREFERS_REDUCED_MOTION_QUERY).matches;
  if (!prefersReducedMotion) {
    event.preventDefault();
    heading.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  heading.focus({ preventScroll: true });
};

const GiveawayDetailActions = ({
  status,
  isAuthor,
  canRequest,
  hasApplied,
  isCompletePending = false,
  onEdit,
  onDelete,
  onComplete,
  onApply,
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

  if (status === GIVEAWAY_STATUS.COMPLETED) {
    return (
      <Button type="button" variant="solid" size="cta" fullWidth disabled>
        {GIVEAWAY_THUMBNAIL_OVERLAY_LABEL.COMPLETED}
      </Button>
    );
  }

  if (hasApplied) {
    return (
      <Button
        href={`#${GIVEAWAY_MY_REQUEST_SECTION_ID}`}
        variant="solid"
        size="cta"
        fullWidth
        onClick={handleViewMyRequestClick}
      >
        {GIVEAWAY_VIEW_MY_REQUEST_BUTTON_LABEL}
      </Button>
    );
  }

  if (status === GIVEAWAY_STATUS.IN_PROGRESS) {
    return (
      <Button type="button" variant="solid" size="cta" fullWidth disabled>
        {GIVEAWAY_THUMBNAIL_OVERLAY_LABEL.IN_PROGRESS}
      </Button>
    );
  }

  if (canRequest) {
    return (
      <Button type="button" variant="solid" size="cta" fullWidth onClick={onApply}>
        {GIVEAWAY_APPLY_BUTTON_LABEL}
      </Button>
    );
  }

  return null;
};

export default GiveawayDetailActions;
