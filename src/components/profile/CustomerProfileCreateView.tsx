"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import CustomerProfileForm from "@/components/profile/CustomerProfileForm";
import ProfileEmptyState from "@/components/profile/ProfileEmptyState";
import ProfileFormSkeleton from "@/components/profile/ProfileFormSkeleton";
import { useCustomerAuthReady } from "@/hooks/useCustomerAuthReady";
import { useCustomerProfileStatus } from "@/hooks/profile/useCustomerProfileStatus";
import { buildLoginPath, getRoleHomePath } from "@/lib/auth/redirect";

const CREATE_SKELETON = {
  title: "프로필 등록",
  description: "추가 정보를 입력하여 회원가입을 완료해주세요.",
  layout: "single" as const,
};

const CustomerProfileCreateView = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { canFetch, isPending: isAuthPending, isAuthenticated, user } = useCustomerAuthReady();
  /** status 쿼리는 canFetch + userId 가 모두 있어야 enabled */
  const canLoadProfile = canFetch && Boolean(user?.id);
  const { data: status, isPending: isStatusPending, isError } = useCustomerProfileStatus(canFetch);

  useEffect(() => {
    if (!status?.isProfileCompleted) return;
    router.replace(getRoleHomePath(user?.role));
  }, [status?.isProfileCompleted, user?.role, router]);

  if (isAuthPending || (canLoadProfile && isStatusPending)) {
    return <ProfileFormSkeleton {...CREATE_SKELETON} />;
  }

  if (!canLoadProfile) {
    const fallbackHref = isAuthenticated ? getRoleHomePath(user?.role) : buildLoginPath(pathname);

    return <ProfileEmptyState description="접근할 수 없습니다." href={fallbackHref} />;
  }

  if (isError || !status) {
    return (
      <ProfileEmptyState
        description="프로필 정보를 불러오지 못했습니다."
        href={getRoleHomePath(user?.role)}
      />
    );
  }

  if (status.isProfileCompleted) {
    return <ProfileFormSkeleton {...CREATE_SKELETON} />;
  }

  // 일반 가입/로그인 사용자는 세션에 phone이 있음. status만 보면 캐시·타이밍에 따라 잘못 노출될 수 있음
  const hasPhone = status.hasPhone === true || Boolean(user?.phone?.trim());

  return <CustomerProfileForm key={String(hasPhone)} requiresPhone={!hasPhone} />;
};

export default CustomerProfileCreateView;
