"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import AlertModal from "@/components/common/Modal/AlertModal";
import Modal from "@/components/common/Modal/Modal";
import { GIVEAWAY_REQUEST_STATUS } from "@/types/giveaway";
import type { MyGiveawayRequestItem } from "@/types/giveaway";

interface GiveawayRequestCancelConfirmModalProps {
  open: boolean;
  request: MyGiveawayRequestItem | null;
  isPending?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const GiveawayRequestCancelConfirmModal = ({
  open,
  request,
  isPending = false,
  onClose,
  onConfirm,
}: GiveawayRequestCancelConfirmModalProps) => {
  const t = useTranslations("giveaway");
  const [cachedRequest, setCachedRequest] = useState(request);

  if (request !== null && request !== cachedRequest) {
    setCachedRequest(request);
  }

  const displayedRequest = request ?? cachedRequest;
  const isSelected = displayedRequest?.status === GIVEAWAY_REQUEST_STATUS.SELECTED;
  const description = isSelected
    ? t("requestCancelSelectedDescription")
    : t("requestCancelDescription");

  return (
    <AlertModal
      open={open}
      onClose={onClose}
      closeDisabled={isPending}
      size="sm"
      title={t("requestCancelTitle")}
      description={description}
      actions={
        <div className="flex w-full flex-col-reverse gap-10 md:flex-row md:gap-12">
          <Modal.Button
            type="button"
            variant="outline"
            size="cta"
            fullWidth
            disabled={isPending}
            onClick={onClose}
            className="md:flex-1"
          >
            {t("close")}
          </Modal.Button>
          <Modal.Button
            type="button"
            variant="solid"
            size="cta"
            fullWidth
            disabled={isPending}
            onClick={onConfirm}
            className="md:flex-1"
          >
            {isPending ? t("canceling") : t("cancelRequest")}
          </Modal.Button>
        </div>
      }
    />
  );
};

export default GiveawayRequestCancelConfirmModal;
