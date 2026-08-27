"use client";

import MoverBasicInfoEditForm from "@/components/profile/MoverBasicInfoEditForm";
import { useTranslations } from "next-intl";
import ProfileEmptyState from "@/components/profile/ProfileEmptyState";
import ProfileFormSkeleton from "@/components/profile/ProfileFormSkeleton";
import { useMoverAuthReady } from "@/hooks/useMoverAuthReady";
import { useMoverProfileMe } from "@/hooks/profile/useMoverProfileMe";
import { getRoleHomePath } from "@/lib/auth/redirect";
import { toMoverBasicInfoEditFormValues } from "@/lib/profile/toMoverBasicInfoEditFormValues";

const MoverBasicInfoEditView = () => {
  const t = useTranslations("profile");
  const { canFetch, isPending: isAuthPending, user } = useMoverAuthReady();
  const canLoadProfile = canFetch && Boolean(user?.id);
  const { data: moverProfile, isPending: isProfilePending, isError } = useMoverProfileMe(canFetch);

  // RoleGuard가 비인증·역할 불일치를 처리. 비활성 쿼리 isPending은 로딩으로 보지 않음
  // 프로필 미완료 접근은 ProfileCompletionGuard(모달)가 담당
  if (isAuthPending || (canLoadProfile && isProfilePending)) {
    return (
      <ProfileFormSkeleton
        title={t("basicInfoTitle")}
        loadingLabel={t("loading")}
        layout="twoColumn"
      />
    );
  }

  if (!canLoadProfile) {
    return null;
  }

  if (isError || !moverProfile) {
    return (
      <ProfileEmptyState
        description={t("basicInfoLoadFailed")}
        href={getRoleHomePath(user?.role)}
      />
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
