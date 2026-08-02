"use client";

import { useRouter } from "next/navigation";

import AlertModal from "@/components/common/Modal/AlertModal";
import { getLoginRedirectPath } from "@/lib/auth/session";

interface LoginRequiredModalProps {
  open: boolean;
  onClose: () => void;
  /** 호출부에서 맥락에 맞는 안내 문구를 전달. 미지정 시 기본값 사용 */
  description?: string;
}

/**
 * 비로그인 사용자가 인증 필요 액션(찜 등)을 눌렀을 때 안내
 * Figma: modal/general-request-required 계열 레이아웃
 */
const DEFAULT_DESCRIPTION = "찜하기는 로그인 후 이용할 수 있어요.";

export function LoginRequiredModal({
  open,
  onClose,
  description = DEFAULT_DESCRIPTION,
}: LoginRequiredModalProps) {
  const router = useRouter();

  const handleLogin = () => {
    onClose();
    router.push(getLoginRedirectPath());
  };

  return (
    <AlertModal
      open={open}
      onClose={onClose}
      title="로그인이 필요해요"
      description={description}
      primaryAction={{ label: "로그인하기", onClick: handleLogin }}
    />
  );
}
