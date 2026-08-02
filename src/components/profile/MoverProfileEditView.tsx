"use client";

import MoverProfileForm from "@/components/profile/MoverProfileForm";
import { Text } from "@/components/common/Text";
import { useMoverAuthReady } from "@/hooks/useMoverAuthReady";
import { useMoverProfileMe } from "@/hooks/profile/useMoverProfileMe";
import { toMoverProfileFormValues } from "@/lib/profile/toMoverProfileFormValues";

const MoverProfileEditView = () => {
  const { canFetch, isPending: isAuthPending } = useMoverAuthReady();
  const { data: moverProfile, isPending: isProfilePending, isError } = useMoverProfileMe(canFetch);

  if (isAuthPending || isProfilePending) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center px-24">
        <Text as="p" variant="md-medium" className="text-text-description">
          프로필을 불러오는 중입니다.
        </Text>
      </div>
    );
  }

  if (isError || !moverProfile) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center px-24">
        <Text as="p" role="alert" variant="md-medium" className="text-text-error">
          프로필을 불러오지 못했습니다.
        </Text>
      </div>
    );
  }

  return (
    <MoverProfileForm
      key={moverProfile.id}
      mode="edit"
      defaultValues={toMoverProfileFormValues(moverProfile)}
      initialImageUrl={moverProfile.imageUrl}
    />
  );
};

export default MoverProfileEditView;
