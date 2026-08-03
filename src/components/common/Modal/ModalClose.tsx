import { CloseIcon } from "@/icons";
import { cn } from "@/lib/utils/cn";

interface ModalCloseProps {
  onClose: () => void;
  disabled?: boolean;
  className?: string;
  iconClassName?: string;
  /** sm: 24px 고정 / md: 36px 고정 / responsive: 모바일·태블릿 24px, PC 36px */
  size?: "sm" | "md" | "responsive";
}

/** 제목 row 안에서 사용 (Figma Frame 2610183: title + X, justify-between) */
const ModalClose = ({
  onClose,
  disabled = false,
  size = "responsive",
  className,
  iconClassName,
}: ModalCloseProps) => {
  return (
    <button
      type="button"
      className={cn(
        disabled && "cursor-not-allowed opacity-40",
        "text-icon-default rounded-8 flex shrink-0 cursor-pointer items-center justify-center transition-colors",
        size === "sm" && "size-24",
        size === "md" && "size-36",
        size === "responsive" && "size-24 xl:size-36",
        "hover:bg-background-hover hover:text-icon-default",
        "active:bg-background-hover",
        "focus-visible:ring-border-brand focus-visible:ring-2 focus-visible:outline-none",
        className,
      )}
      onClick={onClose}
      disabled={disabled}
      aria-label="모달 닫기"
    >
      <CloseIcon
        className={cn(
          size === "sm" && "size-24",
          size === "md" && "size-36",
          size === "responsive" && "size-24 xl:size-36",
          iconClassName,
        )}
      />
    </button>
  );
};

export default ModalClose;
