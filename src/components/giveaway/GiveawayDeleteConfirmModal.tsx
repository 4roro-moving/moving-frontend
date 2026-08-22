import AlertModal from "@/components/common/Modal/AlertModal";
import Modal from "@/components/common/Modal/Modal";
import { Text } from "@/components/common/Text";

interface GiveawayDeleteConfirmModalProps {
  open: boolean;
  isPending?: boolean;
  error?: string;
  onClose: () => void;
  onConfirm: () => void;
}

const GiveawayDeleteConfirmModal = ({
  open,
  isPending = false,
  error,
  onClose,
  onConfirm,
}: GiveawayDeleteConfirmModalProps) => {
  return (
    <AlertModal
      open={open}
      onClose={onClose}
      closeDisabled={isPending}
      size="sm"
      title="나눔 글 삭제"
      description={
        <>
          작성한 나눔 글을 삭제할까요? 삭제하면 되돌릴 수 없습니다.
          {error ? (
            <Text
              as="span"
              variant="sm-medium"
              className="text-text-error mt-12 block"
              role="alert"
            >
              {error}
            </Text>
          ) : null}
        </>
      }
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

export default GiveawayDeleteConfirmModal;
