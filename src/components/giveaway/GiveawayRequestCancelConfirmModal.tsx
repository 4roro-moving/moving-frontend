"use client";

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
  const [cachedRequest, setCachedRequest] = useState(request);

  if (request !== null && request !== cachedRequest) {
    setCachedRequest(request);
  }

  const displayedRequest = request ?? cachedRequest;
  const isSelected = displayedRequest?.status === GIVEAWAY_REQUEST_STATUS.SELECTED;
  const description = isSelected
    ? "선정된 신청을 취소할까요? 나눔이 다시 신청 가능 상태로 돌아갑니다."
    : "나눔 신청을 취소할까요? 취소 후에도 다시 신청할 수 있습니다.";

  return (
    <AlertModal
      open={open}
      onClose={onClose}
      closeDisabled={isPending}
      size="sm"
      title="신청 취소"
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
            닫기
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
            {isPending ? "취소 중..." : "취소하기"}
          </Modal.Button>
        </div>
      }
    />
  );
};

export default GiveawayRequestCancelConfirmModal;
