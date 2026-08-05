"use client";

import AlertModal from "@/components/common/Modal/AlertModal";
import Modal from "@/components/common/Modal/Modal";

export interface FavoriteMoversDeleteConfirmModalProps {
  open: boolean;
  count: number;
  isPending?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

/** 찜한 기사님 전체(또는 다건) 해제 전 확인 */
export default function FavoriteMoversDeleteConfirmModal({
  open,
  count,
  isPending = false,
  onClose,
  onConfirm,
}: FavoriteMoversDeleteConfirmModalProps) {
  return (
    <AlertModal
      open={open}
      onClose={onClose}
      closeDisabled={isPending}
      size="sm"
      title="찜 해제 확인"
      description={`찜한 기사님 ${count}명의 찜을 모두 해제할까요?`}
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
            취소
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
            {isPending ? "해제 중..." : "모두 해제"}
          </Modal.Button>
        </div>
      }
    />
  );
}
