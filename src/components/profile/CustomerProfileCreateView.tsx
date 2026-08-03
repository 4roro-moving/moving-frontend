"use client";

import CustomerProfileForm from "@/components/profile/CustomerProfileForm";
import { Text } from "@/components/common/Text";
import { useCustomerAuthReady } from "@/hooks/useCustomerAuthReady";
import { useCustomerProfileStatus } from "@/hooks/profile/useCustomerProfileStatus";

const CustomerProfileCreateView = () => {
  const { canFetch, isPending: isAuthPending } = useCustomerAuthReady();
  const { data: status, isPending: isStatusPending, isError } = useCustomerProfileStatus(canFetch);

  if (isAuthPending || isStatusPending) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center px-24">
        <Text as="p" variant="md-medium" className="text-text-description">
          프로필 정보를 불러오는 중입니다.
        </Text>
      </div>
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
