"use client";

import CustomerProfileEditForm from "@/components/profile/CustomerProfileEditForm";
import ProfileEmptyState from "@/components/profile/ProfileEmptyState";
import ProfileFormSkeleton from "@/components/profile/ProfileFormSkeleton";
import { useCustomerAuthReady } from "@/hooks/useCustomerAuthReady";
import { useCustomerProfileMe } from "@/hooks/profile/useCustomerProfileMe";
import { getRoleHomePath } from "@/lib/auth/redirect";
import { toCustomerProfileEditFormValues } from "@/lib/profile/toCustomerProfileEditFormValues";
import { useTranslations } from "next-intl";

const CustomerProfileEditView = () => {
  const t = useTranslations("profile");
  const { canFetch, isPending: isAuthPending, user } = useCustomerAuthReady();
  const canLoadProfile = canFetch && Boolean(user?.id);
  const {
    data: customerProfile,
    isPending: isProfilePending,
    isError,
  } = useCustomerProfileMe(canFetch);

  // RoleGuard가 비인증·역할 불일치를 처리. 비활성 쿼리 isPending은 로딩으로 보지 않음
  // 프로필 미완료 접근은 ProfileCompletionGuard(모달)가 담당
  if (isAuthPending || (canLoadProfile && isProfilePending)) {
    return (
      <ProfileFormSkeleton title={t("editTitle")} loadingLabel={t("loading")} layout="twoColumn" />
    );
  }

  if (!canLoadProfile) {
    return null;
  }

  if (isError || !customerProfile) {
    return (
      <ProfileEmptyState description={t("editLoadFailed")} href={getRoleHomePath(user?.role)} />
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
