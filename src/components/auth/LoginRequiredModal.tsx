"use client";

import { useRouter } from "next/navigation";

import Modal from "@/components/common/Modal";
import { Text } from "@/components/common/Text";
import { getLoginRedirectPath } from "@/lib/auth/session";

interface LoginRequiredModalProps {
  open: boolean;
  onClose: () => void;
}

/**
 * 비로그인 사용자가 인증 필요 액션(찜 등)을 눌렀을 때 안내.
 * Figma Modal/general/RequestRequired(sm·md) 구조를 공통 Modal로 재사용.
 */
export function LoginRequiredModal({ open, onClose }: LoginRequiredModalProps) {
  const router = useRouter();

  const handleLogin = () => {
    onClose();
    router.push(getLoginRedirectPath());
  };

  return (
    <Modal
      open={open}
      title="로그인이 필요해요"
      confirmLabel="로그인하기"
      onConfirm={handleLogin}
      onClose={onClose}
      // Figma sm: max 292 / rounded-24 / gap-30 / px-16 py-24
      // Figma md: max 608 / rounded-32 / gap-40 / px-24 pt-32 pb-40
      className="rounded-24 md:rounded-32 max-w-[292px] gap-30 px-16 py-24 md:max-w-[608px] md:gap-40 md:px-24 md:pt-32 md:pb-40"
    >
      <Text as="p" variant="2lg-medium" className="text-text-secondary">
        찜하기는 로그인 후 이용할 수 있어요.
      </Text>
    </Modal>
  );
}
