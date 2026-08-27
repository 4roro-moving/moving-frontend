"use client";

import AlertModal from "@/components/common/Modal/AlertModal";
import Modal from "@/components/common/Modal/Modal";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("favorites");
  return (
    <AlertModal
      open={open}
      onClose={onClose}
      closeDisabled={isPending}
      size="sm"
      title={t("deleteConfirmTitle")}
      description={t("deleteConfirmDescription", { count })}
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
            {isPending ? t("deleting") : t("deleteAll")}
          </Modal.Button>
        </div>
      }
    />
  );
}
