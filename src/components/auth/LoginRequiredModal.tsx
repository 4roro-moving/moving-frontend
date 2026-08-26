"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

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
export function LoginRequiredModal({ open, onClose, description }: LoginRequiredModalProps) {
  const t = useTranslations("auth");
  const router = useRouter();

  const handleLogin = () => {
    onClose();
    router.push(getLoginRedirectPath());
  };

  return (
    <AlertModal
      open={open}
      onClose={onClose}
      title={t("loginRequiredTitle")}
      description={description ?? t("loginRequiredDefaultDescription")}
      primaryAction={{ label: t("loginRequiredAction"), onClick: handleLogin }}
    />
  );
}
