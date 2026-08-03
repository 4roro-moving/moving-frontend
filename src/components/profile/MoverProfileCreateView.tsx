"use client";

import MoverProfileForm from "@/components/profile/MoverProfileForm";
import ProfileFormSkeleton from "@/components/profile/ProfileFormSkeleton";
import { Text } from "@/components/common/Text";
import { useMoverAuthReady } from "@/hooks/useMoverAuthReady";
import { useMoverProfileStatus } from "@/hooks/profile/useMoverProfileStatus";

const MoverProfileCreateView = () => {
  const { canFetch, isPending: isAuthPending } = useMoverAuthReady();
  const { data: status, isPending: isStatusPending, isError } = useMoverProfileStatus(canFetch);

  if (isAuthPending || isStatusPending) {
    return (
      <ProfileFormSkeleton
        title="기사님 프로필 등록"
        description="추가 정보를 입력하여 회원가입을 완료해주세요."
        layout="twoColumn"
      />
    );
  }

  if (isError || !status) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center px-24">
        <Text as="p" role="alert" variant="md-medium" className="text-text-error">
          프로필 정보를 불러오지 못했습니다.
        </Text>
      </div>
    );
  }

  return <MoverProfileForm key={String(status.hasPhone)} requiresPhone={!status.hasPhone} />;
};

export default MoverProfileCreateView;
