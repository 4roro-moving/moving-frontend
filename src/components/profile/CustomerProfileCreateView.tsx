"use client";

import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect } from "react";

import CustomerProfileForm from "@/components/profile/CustomerProfileForm";
import ProfileEmptyState from "@/components/profile/ProfileEmptyState";
import ProfileFormSkeleton from "@/components/profile/ProfileFormSkeleton";
import { useCustomerAuthReady } from "@/hooks/useCustomerAuthReady";
import { useCustomerProfileStatus } from "@/hooks/profile/useCustomerProfileStatus";
import { buildLoginPath, getRoleHomePath } from "@/lib/auth/redirect";

const CustomerProfileCreateView = () => {
  const t = useTranslations("profile");
  const router = useRouter();
  const pathname = usePathname();
  const { canFetch, isPending: isAuthPending, isAuthenticated, user } = useCustomerAuthReady();
  /** status 쿼리는 canFetch + userId 가 모두 있어야 enabled */
  const canLoadProfile = canFetch && Boolean(user?.id);
  const { data: status, isPending: isStatusPending, isError } = useCustomerProfileStatus(canFetch);
  const createSkeleton = {
    title: t("createTitle"),
    description: t("createDescription"),
    loadingLabel: t("loading"),
    layout: "single" as const,
  };

  useEffect(() => {
    if (!status?.isProfileCompleted) return;
    router.replace(getRoleHomePath(user?.role));
  }, [status?.isProfileCompleted, user?.role, router]);

  if (isAuthPending || (canLoadProfile && isStatusPending)) {
    return <ProfileFormSkeleton {...createSkeleton} />;
  }

  if (!canLoadProfile) {
    const fallbackHref = isAuthenticated ? getRoleHomePath(user?.role) : buildLoginPath(pathname);

    return <ProfileEmptyState description={t("accessDenied")} href={fallbackHref} />;
  }

  if (isError || !status) {
    return (
      <ProfileEmptyState description={t("createLoadFailed")} href={getRoleHomePath(user?.role)} />
    );
  }

  if (status.isProfileCompleted) {
    return <ProfileFormSkeleton {...createSkeleton} />;
  }

  // 일반 가입/로그인 사용자는 세션에 phone이 있음. status만 보면 캐시·타이밍에 따라 잘못 노출될 수 있음
  const hasPhone = status.hasPhone === true || Boolean(user?.phone?.trim());

  return <CustomerProfileForm key={String(hasPhone)} requiresPhone={!hasPhone} />;
};

export default CustomerProfileCreateView;
