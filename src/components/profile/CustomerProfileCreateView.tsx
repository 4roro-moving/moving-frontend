"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import CustomerProfileForm from "@/components/profile/CustomerProfileForm";
import ProfileFormSkeleton from "@/components/profile/ProfileFormSkeleton";
import { Text } from "@/components/common/Text";
import { useCustomerAuthReady } from "@/hooks/useCustomerAuthReady";
import { useCustomerProfileStatus } from "@/hooks/profile/useCustomerProfileStatus";
import { getRoleHomePath } from "@/lib/auth/redirect";

const CustomerProfileCreateView = () => {
  const router = useRouter();
  const { canFetch, isPending: isAuthPending, user } = useCustomerAuthReady();
  const { data: status, isPending: isStatusPending, isError } = useCustomerProfileStatus(canFetch);

  useEffect(() => {
    if (!status?.isProfileCompleted) return;
    router.replace(getRoleHomePath(user?.role));
  }, [status?.isProfileCompleted, user?.role, router]);

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

  if (status.isProfileCompleted) {
    return (
      <ProfileFormSkeleton
        title="프로필 등록"
        description="추가 정보를 입력하여 회원가입을 완료해주세요."
        layout="single"
      />
    );
  }

  // 일반 가입/로그인 사용자는 세션에 phone이 있음. status만 보면 캐시·타이밍에 따라 잘못 노출될 수 있음
  const hasPhone = status.hasPhone === true || Boolean(user?.phone?.trim());

  return <CustomerProfileForm key={String(hasPhone)} requiresPhone={!hasPhone} />;
};

export default CustomerProfileCreateView;
