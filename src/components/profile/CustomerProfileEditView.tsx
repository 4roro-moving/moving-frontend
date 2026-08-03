"use client";

import CustomerProfileEditForm from "@/components/profile/CustomerProfileEditForm";
import ProfileFormSkeleton from "@/components/profile/ProfileFormSkeleton";
import { Text } from "@/components/common/Text";
import { useCustomerAuthReady } from "@/hooks/useCustomerAuthReady";
import { useCustomerProfileMe } from "@/hooks/profile/useCustomerProfileMe";
import { toCustomerProfileEditFormValues } from "@/lib/profile/toCustomerProfileEditFormValues";

const CustomerProfileEditView = () => {
  const { canFetch, isPending: isAuthPending } = useCustomerAuthReady();
  const {
    data: customerProfile,
    isPending: isProfilePending,
    isError,
  } = useCustomerProfileMe(canFetch);

  if (isAuthPending || isProfilePending) {
    return <ProfileFormSkeleton title="프로필 수정" layout="twoColumn" />;
  }

  if (isError || !customerProfile) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center px-24">
        <Text as="p" role="alert" variant="md-medium" className="text-text-error">
          프로필을 불러오지 못했습니다.
        </Text>
      </div>
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
