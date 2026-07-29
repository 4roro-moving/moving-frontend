"use client";

import { useRouter } from "next/navigation";

import Modal from "@/components/common/Modal/Modal";
import { getLoginRedirectPath } from "@/lib/auth/session";

const PANEL_CLASSNAME = [
  "items-stretch text-left",
  "rounded-24 md:rounded-32",
  "w-full max-w-[292px] gap-30 px-16 py-24",
  "md:max-w-[608px] md:gap-40 md:px-24 md:pt-32 md:pb-40",
].join(" ");

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

  if (!open) {
    return null;
  }

  return (
    <Modal onClose={onClose} className={PANEL_CLASSNAME}>
      <div className="flex w-full items-center justify-between gap-12">
        <Modal.Title variant={{ base: "2lg-bold", md: "2xl-semibold" }}>
          로그인이 필요해요
        </Modal.Title>
        <Modal.Close onClose={onClose} />
      </div>
      <div className="flex w-full flex-col items-stretch gap-30 md:gap-40">
        <Modal.Desc variant="2lg-medium">{description}</Modal.Desc>
        <Modal.Button fullWidth size="cta" className="md:hidden" onClick={handleLogin}>
          로그인하기
        </Modal.Button>
        <Modal.Button
          fullWidth
          size="detail"
          className="hidden md:inline-flex"
          onClick={handleLogin}
        >
          로그인하기
        </Modal.Button>
      </div>
    </Modal>
  );
}
