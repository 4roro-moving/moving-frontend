"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import AlertModal from "@/components/common/Modal/AlertModal";

interface ProfileRequiredModalProps {
  open: boolean;
  profileCreatePath: string;
}

/** 프로필 미완료 사용자가 보호 라우트에 들어왔을 때 안내 (닫기 불가) */
const ProfileRequiredModal = ({ open, profileCreatePath }: ProfileRequiredModalProps) => {
  const t = useTranslations("profile");
  const router = useRouter();

  return (
    <AlertModal
      open={open}
      title={t("requiredTitle")}
      description={t("requiredDescription")}
      primaryAction={{
        label: t("goToCreate"),
        onClick: () => {
          router.replace(profileCreatePath);
        },
      }}
    />
  );
};

export default ProfileRequiredModal;
