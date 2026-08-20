"use client";

import { useCallback, useState } from "react";

import { useResolvedAuthRole } from "@/hooks/auth/useResolvedAuthRole";
import { useCustomerProfileMe } from "@/hooks/profile/useCustomerProfileMe";
import { useCustomerAuthReady } from "@/hooks/useCustomerAuthReady";
import type { AuthRole } from "@/lib/auth/role";
import type { RegionId } from "@/lib/constants/region";

export const useResidenceReviewCreateAction = (initialRole: AuthRole | null = null) => {
  const { isPending, isAuthenticated, isCustomer, isMover, canFetch } = useCustomerAuthReady();
  const resolvedRole = useResolvedAuthRole(initialRole);
  const { data: profile } = useCustomerProfileMe(canFetch);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isLoginRequiredOpen, setIsLoginRequiredOpen] = useState(false);

  const defaultRegionId: RegionId | null = profile?.regions[0]?.id ?? null;
  const canShowCreateButton = resolvedRole !== "MOVER";

  const openCreate = useCallback(() => {
    if (isMover || resolvedRole === "MOVER") {
      return;
    }

    if (!isAuthenticated) {
      setIsLoginRequiredOpen(true);
      return;
    }

    if (isPending || !isCustomer) {
      return;
    }

    setIsCreateOpen(true);
  }, [isAuthenticated, isCustomer, isMover, isPending, resolvedRole]);

  const closeCreate = useCallback(() => {
    setIsCreateOpen(false);
  }, []);

  const closeLoginRequired = useCallback(() => {
    setIsLoginRequiredOpen(false);
  }, []);

  return {
    canShowCreateButton,
    defaultRegionId,
    isCreateOpen,
    isLoginRequiredOpen,
    openCreate,
    closeCreate,
    closeLoginRequired,
  };
};
