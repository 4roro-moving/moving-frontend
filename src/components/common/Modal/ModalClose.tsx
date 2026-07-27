import { CloseIcon } from "@/icons";
import { cn } from "@/lib/utils/cn";

interface ModalCloseProps {
  onClose: () => void;
  disabled?: boolean;
}

const ModalClose = ({ onClose, disabled = false }: ModalCloseProps) => {
  return (
    <button
      type="button"
      className={cn(
        "text-icon-default absolute top-30 right-30",
        disabled && "cursor-not-allowed opacity-40",
      )}
      onClick={onClose}
      disabled={disabled}
      aria-label="모달 닫기"
    >
      <CloseIcon className="size-18" />
    </button>
  );
};

export default ModalClose;
