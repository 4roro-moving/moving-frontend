import { CloseIcon } from "@/icons";
import { cn } from "@/lib/utils/cn";

interface ModalCloseProps {
  onClose: () => void;
  disabled?: boolean;
}

/** 제목 row 안에서 사용 (Figma Frame 2610183: title + X, justify-between) */
const ModalClose = ({ onClose, disabled = false }: ModalCloseProps) => {
  return (
    <button
      type="button"
      className={cn(
        disabled && "cursor-not-allowed opacity-40",
        "text-icon-default rounded-8 flex size-24 shrink-0 cursor-pointer items-center justify-center transition-colors md:size-36",
        "hover:bg-background-hover hover:text-icon-default",
        "active:bg-background-hover",
        "focus-visible:ring-border-brand focus-visible:ring-2 focus-visible:outline-none",
      )}
      onClick={onClose}
      disabled={disabled}
      aria-label="모달 닫기"
    >
      <CloseIcon className="size-24 md:size-36" />
    </button>
  );
};

export default ModalClose;
