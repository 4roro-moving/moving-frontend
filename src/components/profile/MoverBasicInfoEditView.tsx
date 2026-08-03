"use client";

import MoverBasicInfoEditForm from "@/components/profile/MoverBasicInfoEditForm";
import ProfileFormSkeleton from "@/components/profile/ProfileFormSkeleton";
import { Text } from "@/components/common/Text";
import { useMoverAuthReady } from "@/hooks/useMoverAuthReady";
import { useMoverProfileMe } from "@/hooks/profile/useMoverProfileMe";
import { toMoverBasicInfoEditFormValues } from "@/lib/profile/toMoverBasicInfoEditFormValues";

const MoverBasicInfoEditView = () => {
  const { canFetch, isPending: isAuthPending } = useMoverAuthReady();
  const { data: moverProfile, isPending: isProfilePending, isError } = useMoverProfileMe(canFetch);

  if (isAuthPending || isProfilePending) {
    return <ProfileFormSkeleton title="기본정보 수정" layout="twoColumn" />;
  }

  if (isError || !moverProfile) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center px-24">
        <Text as="p" role="alert" variant="md-medium" className="text-text-error">
          기본정보를 불러오지 못했습니다.
        </Text>
      </div>
    );
  }

  return (
    <MoverBasicInfoEditForm
      key={moverProfile.id}
      email={moverProfile.email ?? ""}
      hasPassword={moverProfile.hasPassword}
      defaultValues={toMoverBasicInfoEditFormValues(moverProfile)}
    />
  );
};

export default MoverBasicInfoEditView;
