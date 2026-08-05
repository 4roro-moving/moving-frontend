"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import CustomerProfileEditForm from "@/components/profile/CustomerProfileEditForm";
import ProfileEmptyState from "@/components/profile/ProfileEmptyState";
import ProfileFormSkeleton from "@/components/profile/ProfileFormSkeleton";
import { useCustomerAuthReady } from "@/hooks/useCustomerAuthReady";
import { useCustomerProfileMe } from "@/hooks/profile/useCustomerProfileMe";
import { APP_ROUTES } from "@/lib/constants/appRoutes";
import { getRoleHomePath } from "@/lib/auth/redirect";
import { isProfileMissingError } from "@/lib/profile/isProfileMissingError";
import { toCustomerProfileEditFormValues } from "@/lib/profile/toCustomerProfileEditFormValues";

const CustomerProfileEditView = () => {
  const router = useRouter();
  const { canFetch, isPending: isAuthPending, user } = useCustomerAuthReady();
  const canLoadProfile = canFetch && Boolean(user?.id);
  const {
    data: customerProfile,
    isPending: isProfilePending,
    isError,
    error,
  } = useCustomerProfileMe(canFetch);

  const isMissingProfile = isError && isProfileMissingError(error);
  console.log("isMissingProfile", isMissingProfile ? "ㅇㅇ" : "ㄴㄴ");

  useEffect(() => {
    if (!isMissingProfile) return;
    router.replace(APP_ROUTES.PROFILE);
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

  if (isError || !customerProfile) {
    return (
      <ProfileEmptyState
        description="프로필을 불러오지 못했습니다."
        href={getRoleHomePath(user?.role)}
      />
    );
  }

  return (
    <CustomerProfileEditForm
      key={customerProfile.id}
      email={customerProfile.email}
      hasPassword={customerProfile.hasPassword}
      defaultValues={toCustomerProfileEditFormValues(customerProfile)}
      initialImageUrl={customerProfile.imageUrl}
    />
  );
};

export default CustomerProfileEditView;
