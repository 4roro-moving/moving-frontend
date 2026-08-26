"use client";

import { useTranslations } from "next-intl";

import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";

import { ESTIMATE_REQUEST_CANCELED_TOAST_KEY } from "@/components/estimate/requests/estimateRequestCancelToast";
import { useCancelDesignatedMover } from "@/hooks/useCancelDesignatedMover";
import { useCancelEstimateRequest } from "@/hooks/useCancelEstimateRequest";
import { APP_ROUTES } from "@/lib/constants/appRoutes";
import { getDesignatedMoverDisplayName } from "@/lib/utils/estimateFormat";
import type { MyEstimateRequestDesignatedMover } from "@/types/estimate";

type ConfirmStep = "none" | "full" | "designate";

/**
 * 보낸 견적 요청 상세 — 취소 허브 + 지정/전체 확인 모달 플로우
 * // 2026.08.07 정슬기 - [추가]
 */
export function useEstimateRequestCancelHubFlow(
  estimateRequestId: number,
  designatedMovers: MyEstimateRequestDesignatedMover[],
) {
  const t = useTranslations("estimates");
  const router = useRouter();
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  const [isHubOpen, setIsHubOpen] = useState(false);
  const [confirmStep, setConfirmStep] = useState<ConfirmStep>("none");
  const [designateMoverId, setDesignateMoverId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const focusCancelButton = useCallback(() => {
    queueMicrotask(() => {
      cancelButtonRef.current?.focus();
    });
  }, []);

  const openHub = useCallback(() => {
    setConfirmStep("none");
    setDesignateMoverId(null);
    setIsHubOpen(true);
  }, []);

  const closeAll = useCallback(() => {
    setIsHubOpen(false);
    setConfirmStep("none");
    setDesignateMoverId(null);
    focusCancelButton();
  }, [focusCancelButton]);

  const closeConfirmBackToHub = useCallback(() => {
    setConfirmStep("none");
    setDesignateMoverId(null);
    setIsHubOpen(true);
  }, []);

  const openDesignateConfirm = useCallback((moverId: string) => {
    setDesignateMoverId(moverId);
    setIsHubOpen(false);
    setConfirmStep("designate");
  }, []);

  const openFullConfirm = useCallback(() => {
    setDesignateMoverId(null);
    setIsHubOpen(false);
    setConfirmStep("full");
  }, []);

  const fullCancelMutation = useCancelEstimateRequest(estimateRequestId, {
    onSuccess: () => {
      setIsHubOpen(false);
      setConfirmStep("none");
      setDesignateMoverId(null);
      try {
        sessionStorage.setItem(ESTIMATE_REQUEST_CANCELED_TOAST_KEY, "1");
      } catch {
        // sessionStorage 불가 환경에서는 Toast 없이 이동
      }
      router.push(APP_ROUTES.ESTIMATES.REQUESTS);
    },
    onError: (message) => {
      setToastMessage(message);
    },
  });

  const designateCancelMutation = useCancelDesignatedMover({
    onSuccess: () => {
      setConfirmStep("none");
      setDesignateMoverId(null);
      setIsHubOpen(true);
      setToastMessage(t("designatedCancelSuccess"));
    },
    onError: (message) => {
      setToastMessage(message);
    },
  });

  const confirmFullCancel = useCallback(() => {
    if (fullCancelMutation.isPending) {
      return;
    }
    fullCancelMutation.mutate();
  }, [fullCancelMutation]);

  const confirmDesignateCancel = useCallback(() => {
    if (!designateMoverId || designateCancelMutation.isPending) {
      return;
    }
    designateCancelMutation.mutate({
      estimateRequestId,
      moverId: designateMoverId,
    });
  }, [designateCancelMutation, designateMoverId, estimateRequestId]);

  const clearToast = useCallback(() => {
    setToastMessage(null);
  }, []);

  const designateTarget =
    designateMoverId === null
      ? null
      : (designatedMovers.find((item) => item.moverId === designateMoverId) ?? null);

  const isBusy = fullCancelMutation.isPending || designateCancelMutation.isPending;

  return {
    cancelButtonRef,
    isHubOpen,
    isFullConfirmOpen: confirmStep === "full",
    isDesignateConfirmOpen: confirmStep === "designate" && designateTarget !== null,
    designateDisplayName: designateTarget
      ? getDesignatedMoverDisplayName(designateTarget.mover)
      : "",
    openHub,
    closeAll,
    closeConfirmBackToHub,
    openDesignateConfirm,
    openFullConfirm,
    confirmFullCancel,
    confirmDesignateCancel,
    isFullCancelPending: fullCancelMutation.isPending,
    isDesignateCancelPending: designateCancelMutation.isPending,
    isBusy,
    toastMessage,
    clearToast,
  };
}
