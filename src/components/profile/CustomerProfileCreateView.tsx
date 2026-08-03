"use client";

import CustomerProfileForm from "@/components/profile/CustomerProfileForm";
import ProfileFormSkeleton from "@/components/profile/ProfileFormSkeleton";
import { Text } from "@/components/common/Text";
import { useCustomerAuthReady } from "@/hooks/useCustomerAuthReady";
import { useCustomerProfileStatus } from "@/hooks/profile/useCustomerProfileStatus";

const CustomerProfileCreateView = () => {
  const { canFetch, isPending: isAuthPending } = useCustomerAuthReady();
  const { data: status, isPending: isStatusPending, isError } = useCustomerProfileStatus(canFetch);

  if (isAuthPending || isStatusPending) {
    return (
      <ProfileFormSkeleton
        title="프로필 등록"
        description="추가 정보를 입력하여 회원가입을 완료해주세요."
        layout="single"
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

  return <CustomerProfileForm key={String(status.hasPhone)} requiresPhone={!status.hasPhone} />;
};

export default CustomerProfileCreateView;
