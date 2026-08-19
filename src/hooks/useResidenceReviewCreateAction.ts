"use client";

import { useCallback, useState } from "react";

import { useCustomerProfileMe } from "@/hooks/profile/useCustomerProfileMe";
import { useCustomerAuthReady } from "@/hooks/useCustomerAuthReady";
import type { RegionId } from "@/lib/constants/region";

export const useResidenceReviewCreateAction = () => {
  const { isPending, isAuthenticated, isCustomer, isMover, canFetch } = useCustomerAuthReady();
  const { data: profile } = useCustomerProfileMe(canFetch);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isLoginRequiredOpen, setIsLoginRequiredOpen] = useState(false);

  const defaultRegionId: RegionId | null = profile?.regions[0]?.id ?? null;
  const canShowCreateButton = !isPending && !isMover;

  const openCreate = useCallback(() => {
    if (isPending || isMover) {
      return;
    }

    if (!isAuthenticated) {
      setIsLoginRequiredOpen(true);
      return;
    }

    if (!isCustomer) {
      return;
    }

    setIsCreateOpen(true);
  }, [isAuthenticated, isCustomer, isMover, isPending]);

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
