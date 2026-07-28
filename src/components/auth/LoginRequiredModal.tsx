"use client";

import { useRouter } from "next/navigation";

import Modal from "@/components/common/Modal/Modal";
import { getTextVariantClass } from "@/components/common/Text";
import { getLoginRedirectPath } from "@/lib/auth/session";

interface LoginRequiredModalProps {
  open: boolean;
  onClose: () => void;
}

/**
 * 비로그인 사용자가 인증 필요 액션(찜 등)을 눌렀을 때 안내
 */
export function LoginRequiredModal({ open, onClose }: LoginRequiredModalProps) {
  const router = useRouter();

  const handleLogin = () => {
    onClose();
    router.push(getLoginRedirectPath());
  };

  if (!open) {
    return null;
  }

  return (
    <Modal
      onClose={onClose}
      className="rounded-24 md:rounded-32 w-full max-w-[292px] gap-30 px-16 py-24 md:max-w-[608px] md:gap-40 md:px-24 md:pt-32 md:pb-40"
    >
      <Modal.Close onClose={onClose} />
      <Modal.Title>로그인이 필요해요</Modal.Title>
      <Modal.Desc className={getTextVariantClass("2lg-medium")}>
        찜하기는 로그인 후 이용할 수 있어요.
      </Modal.Desc>
      <Modal.Button fullWidth size="detail" onClick={handleLogin}>
        로그인하기
      </Modal.Button>
    </Modal>
  );
}
