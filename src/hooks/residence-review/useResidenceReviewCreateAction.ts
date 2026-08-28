"use client";

import { useCallback, useState } from "react";

import { useResolvedAuthRole } from "@/hooks/auth/useResolvedAuthRole";
import { useCustomerAuthReady } from "@/hooks/useCustomerAuthReady";
import type { AuthRole } from "@/lib/auth/role";

export const useResidenceReviewCreateAction = (
  initialRole: AuthRole | null = null,
  initialIsLogin = false,
) => {
  const { isPending, isAuthenticated, isCustomer, isMover } = useCustomerAuthReady();
  const resolvedRole = useResolvedAuthRole(initialRole);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isLoginRequiredOpen, setIsLoginRequiredOpen] = useState(false);
  const hasLoginHint = Boolean(initialIsLogin || initialRole);

  const canShowCreateButton = resolvedRole !== "MOVER";

  const openCreate = useCallback(() => {
    if (isMover || resolvedRole === "MOVER") {
      return;
    }

    if (!isAuthenticated) {
      if (isPending && hasLoginHint) {
        return;
      }

      setIsLoginRequiredOpen(true);
      return;
    }

    if (isPending || !isCustomer) {
      return;
    }

    setIsCreateOpen(true);
  }, [hasLoginHint, isAuthenticated, isCustomer, isMover, isPending, resolvedRole]);

  const closeCreate = useCallback(() => {
    setIsCreateOpen(false);
  }, []);

  const closeLoginRequired = useCallback(() => {
    setIsLoginRequiredOpen(false);
  }, []);

  return {
    canShowCreateButton,
    isCreateOpen,
    isLoginRequiredOpen,
    openCreate,
    closeCreate,
    closeLoginRequired,
  };
};
