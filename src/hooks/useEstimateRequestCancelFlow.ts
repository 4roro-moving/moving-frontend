"use client";

import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";

import { ESTIMATE_REQUEST_CANCELED_TOAST_KEY } from "@/components/estimate/requests/estimateRequestCancelToast";
import { useCancelEstimateRequest } from "@/hooks/useCancelEstimateRequest";
import { APP_ROUTES } from "@/lib/constants/appRoutes";

/**
 * 견적 요청 취소 공통 플로우 (Modal·Toast·포커스·목록 이동)
 * // 2026.08.04 정슬기 - [추가] 상세 화면 중복 로직 훅 분리
 */
export function useEstimateRequestCancelFlow(estimateRequestId: number) {
  const router = useRouter();
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const closeCancelModal = useCallback(() => {
    setIsCancelModalOpen(false);
    queueMicrotask(() => {
      cancelButtonRef.current?.focus();
    });
  }, []);

  const openCancelModal = useCallback(() => {
    setIsCancelModalOpen(true);
  }, []);

  const cancelMutation = useCancelEstimateRequest(estimateRequestId, {
    onSuccess: () => {
      setIsCancelModalOpen(false);
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

  const confirmCancel = useCallback(() => {
    if (cancelMutation.isPending) {
      return;
    }
    cancelMutation.mutate();
  }, [cancelMutation]);

  const clearToast = useCallback(() => {
    setToastMessage(null);
  }, []);

  return {
    cancelButtonRef,
    isCancelModalOpen,
    openCancelModal,
    closeCancelModal,
    confirmCancel,
    isCancelPending: cancelMutation.isPending,
    toastMessage,
    clearToast,
  };
}
