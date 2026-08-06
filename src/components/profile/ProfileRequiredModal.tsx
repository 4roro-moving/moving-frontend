"use client";

import { useRouter } from "next/navigation";

import AlertModal from "@/components/common/Modal/AlertModal";

interface ProfileRequiredModalProps {
  open: boolean;
  profileCreatePath: string;
}

/** 프로필 미완료 사용자가 보호 라우트에 들어왔을 때 안내 (닫기 불가) */
const ProfileRequiredModal = ({ open, profileCreatePath }: ProfileRequiredModalProps) => {
  const router = useRouter();

  return (
    <AlertModal
      open={open}
      title="프로필 생성이 필요해요"
      description="해당 기능은 프로필을 완성한 뒤 이용할 수 있어요."
      primaryAction={{
        label: "프로필 만들러 가기",
        onClick: () => {
          router.replace(profileCreatePath);
        },
      }}
    />
  );
};

export default ProfileRequiredModal;
