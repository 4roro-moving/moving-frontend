"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import MoverProfileEditForm from "@/components/profile/MoverProfileEditForm";
import ProfileEmptyState from "@/components/profile/ProfileEmptyState";
import ProfileFormSkeleton from "@/components/profile/ProfileFormSkeleton";
import { useMoverAuthReady } from "@/hooks/useMoverAuthReady";
import { useMoverProfileMe } from "@/hooks/profile/useMoverProfileMe";
import { APP_ROUTES } from "@/lib/constants/appRoutes";
import { getRoleHomePath } from "@/lib/auth/redirect";
import { isProfileMissingError } from "@/lib/profile/isProfileMissingError";
import { toMoverProfileFormValues } from "@/lib/profile/toMoverProfileFormValues";

const MoverProfileEditView = () => {
  const router = useRouter();
  const { canFetch, isPending: isAuthPending, user } = useMoverAuthReady();
  const canLoadProfile = canFetch && Boolean(user?.id);
  const {
    data: moverProfile,
    isPending: isProfilePending,
    isError,
    error,
  } = useMoverProfileMe(canFetch);

  const isMissingProfile = isError && isProfileMissingError(error);

  useEffect(() => {
    if (!isMissingProfile) return;
    router.replace(APP_ROUTES.MOVER_PROFILE);
  }, [isMissingProfile, router]);

  // RoleGuard가 비인증·역할 불일치를 처리. 비활성 쿼리 isPending은 로딩으로 보지 않음
  if (isAuthPending || (canLoadProfile && isProfilePending)) {
    return <ProfileFormSkeleton title="프로필 수정" layout="twoColumn" />;
  }

  if (!canLoadProfile) {
    return null;
  }

  if (isMissingProfile) {
    return <ProfileFormSkeleton title="프로필 수정" layout="twoColumn" />;
  }

  if (isError || !moverProfile) {
    return (
      <ProfileEmptyState
        description="프로필을 불러오지 못했습니다."
        href={getRoleHomePath(user?.role)}
      />
    );
  }

  return (
    <MoverProfileEditForm
      key={moverProfile.id}
      defaultValues={toMoverProfileFormValues(moverProfile)}
      initialImageUrl={moverProfile.imageUrl}
    />
  );
};

export default MoverProfileEditView;
