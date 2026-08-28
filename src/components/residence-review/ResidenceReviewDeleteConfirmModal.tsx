"use client";

import { useTranslations } from "next-intl";

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
  const t = useTranslations("residenceReview");
  return (
    <AlertModal
      open={open}
      onClose={onClose}
      closeDisabled={isPending}
      size="sm"
      title={t("deleteTitle")}
      description={t("deleteDescription")}
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
            {t("cancel")}
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
            {isPending ? t("deleting") : t("delete")}
          </Modal.Button>
        </div>
      }
    />
  );
};

export default ResidenceReviewDeleteConfirmModal;
