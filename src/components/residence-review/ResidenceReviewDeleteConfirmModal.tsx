"use client";

import AlertModal from "@/components/common/Modal/AlertModal";
import Modal from "@/components/common/Modal/Modal";

interface ResidenceReviewDeleteConfirmModalProps {
  open: boolean;
  isPending?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ResidenceReviewDeleteConfirmModal = ({
  open,
  isPending = false,
  onClose,
  onConfirm,
}: ResidenceReviewDeleteConfirmModalProps) => {
  return (
    <AlertModal
      open={open}
      onClose={onClose}
      closeDisabled={isPending}
      size="sm"
      title="후기 삭제"
      description="작성한 거주 후기를 삭제할까요? 삭제하면 되돌릴 수 없습니다."
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
            {isPending ? "삭제 중..." : "삭제"}
          </Modal.Button>
        </div>
      }
    />
  );
};

export default ResidenceReviewDeleteConfirmModal;
