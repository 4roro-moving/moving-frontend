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
        disabled && "cursor-not-allowed opacity-40",
        "text-icon-default rounded-8 absolute top-30 right-30 flex size-36 cursor-pointer items-center justify-center transition-colors",
        "hover:bg-background-hover hover:text-icon-default",
        "active:bg-background-hover",
        "focus-visible:ring-border-brand focus-visible:ring-2 focus-visible:outline-none",
      )}
      onClick={onClose}
      disabled={disabled}
      aria-label="모달 닫기"
    >
      <CloseIcon className="size-18" aria-hidden="true" />
    </button>
  );
};

export default ModalClose;
