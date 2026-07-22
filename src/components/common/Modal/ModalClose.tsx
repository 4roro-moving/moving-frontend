import Image from "next/image";

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
      <Image src="/icons/ic_close.svg" alt="" width={18} height={18} aria-hidden />
    </button>
  );
};

export default ModalClose;
