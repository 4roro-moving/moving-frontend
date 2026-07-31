"use client";

import Modal from "@/components/common/Modal/Modal";

const PANEL_CLASSNAME = [
  "items-stretch text-left",
  "rounded-24 md:rounded-32",
  "w-full max-w-[292px] gap-30 px-16 py-24",
  "md:max-w-[480px] md:gap-40 md:px-24 md:pt-32 md:pb-40",
].join(" ");

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
  if (!open) {
    return null;
  }

  return (
    <Modal onClose={isPending ? undefined : onClose} className={PANEL_CLASSNAME}>
      <div className="flex w-full items-center justify-between gap-12">
        <Modal.Title variant={{ base: "2lg-bold", md: "2xl-semibold" }}>찜 해제 확인</Modal.Title>
        <Modal.Close onClose={onClose} disabled={isPending} />
      </div>

      <div className="flex w-full flex-col items-stretch gap-30 md:gap-40">
        <Modal.Desc variant="2lg-medium">찜한 기사님 {count}명의 찜을 모두 해제할까요?</Modal.Desc>

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
      </div>
    </Modal>
  );
}
