import { CloseIcon } from "@/icons";

interface ModalCloseProps {
  onClose: () => void;
}

const ModalClose = ({ onClose }: ModalCloseProps) => {
  return (
    <button
      type="button"
      className="text-icon-default absolute top-30 right-30"
      onClick={onClose}
      aria-label="모달 닫기"
    >
      <CloseIcon className="size-18" />
    </button>
  );
};

export default ModalClose;
