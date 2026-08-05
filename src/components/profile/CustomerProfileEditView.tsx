"use client";

import CustomerProfileEditForm from "@/components/profile/CustomerProfileEditForm";
import ProfileEmptyState from "@/components/profile/ProfileEmptyState";
import ProfileFormSkeleton from "@/components/profile/ProfileFormSkeleton";
import { useCustomerAuthReady } from "@/hooks/useCustomerAuthReady";
import { useCustomerProfileMe } from "@/hooks/profile/useCustomerProfileMe";
import { getRoleHomePath } from "@/lib/auth/redirect";
import { toCustomerProfileEditFormValues } from "@/lib/profile/toCustomerProfileEditFormValues";

const CustomerProfileEditView = () => {
  const { canFetch, isPending: isAuthPending, user } = useCustomerAuthReady();
  const canLoadProfile = canFetch && Boolean(user?.id);
  const {
    data: customerProfile,
    isPending: isProfilePending,
    isError,
  } = useCustomerProfileMe(canFetch);

  // RoleGuard가 비인증·역할 불일치를 처리. 비활성 쿼리 isPending은 로딩으로 보지 않음
  if (isAuthPending || (canLoadProfile && isProfilePending)) {
    return <ProfileFormSkeleton title="프로필 수정" layout="twoColumn" />;
  }

  if (!canLoadProfile) {
    return null;
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
