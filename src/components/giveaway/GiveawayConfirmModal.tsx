import AlertModal from "@/components/common/Modal/AlertModal";
import Modal from "@/components/common/Modal/Modal";
import { Text } from "@/components/common/Text";

interface GiveawayConfirmModalProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  pendingLabel: string;
  isPending?: boolean;
  error?: string;
  onClose: () => void;
  onConfirm: () => void;
}

const GiveawayConfirmModal = ({
  open,
  title,
  description,
  confirmLabel,
  pendingLabel,
  isPending = false,
  error,
  onClose,
  onConfirm,
}: GiveawayConfirmModalProps) => {
  return (
    <AlertModal
      open={open}
      onClose={onClose}
      closeDisabled={isPending}
      size="sm"
      title={title}
      description={
        <>
          {description}
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
            {isPending ? pendingLabel : confirmLabel}
          </Modal.Button>
        </div>
      }
    />
  );
};

export default GiveawayConfirmModal;
