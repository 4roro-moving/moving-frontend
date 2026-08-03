"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useLoginRequiredModal } from "@/components/auth/LoginRequiredModalProvider";
import { useActiveEstimateRequest } from "@/hooks/useActiveEstimateRequest";
import { useCustomerAuthReady } from "@/hooks/useCustomerAuthReady";
import { useDesignateMover } from "@/hooks/useDesignateMover";

import { APP_ROUTES } from "@/lib/constants/appRoutes";
import { getDesignateCtaState, isDesignateCtaDisabled } from "@/lib/utils/getDesignateCtaState";

interface UseMoverDesignationOptions {
  moverId: string;
  onError: (message: string) => void;
}

/**
 * 기사님 상세의 지정 견적 CTA 상태와 동작을 관리합니다.
 *
 * - 비회원: 로그인 안내 모달
 * - 활성 요청 없음: 일반 견적 요청 안내 모달
 * - CONFIRMED 요청: 진행 중인 견적 상세로 이동
 * - PENDING·OPEN 요청: 지정 가능 여부 확인 후 지정 API 호출
 */
export function useMoverDesignation({ moverId, onError }: UseMoverDesignationOptions) {
  const router = useRouter();

  const [isEstimateRequestModalOpen, setIsEstimateRequestModalOpen] = useState(false);
  const [isDesignateSuccessModalOpen, setIsDesignateSuccessModalOpen] = useState(false);
  const loginRequiredModal = useLoginRequiredModal();
  const { isPending: isAuthPending, isAuthenticated, user } = useCustomerAuthReady();
  const isCustomer = user?.role === "CUSTOMER";
  const isCustomerLoggedIn = !isAuthPending && isAuthenticated && isCustomer;

  const {
    data: activeRequest,
    isLoading: isActiveLoading,
    isError: isActiveError,
    isFetching: isActiveFetching,
    refetch: refetchActiveRequest,
  } = useActiveEstimateRequest({
    enabled: isCustomerLoggedIn,
  });

  const designateMutation = useDesignateMover({
    onSuccess: () => {
      setIsDesignateSuccessModalOpen(true);
    },
    onError,
  });

  const ctaState =
    isCustomerLoggedIn && !isActiveLoading && !isActiveError
      ? getDesignateCtaState(activeRequest ?? null, moverId)
      : null;

  // 이미 기사를 지정했거나 만료·한도 초과 등 상태에서는 CTA 버튼 비활성화
  const isRequestDisabled =
    designateMutation.isPending ||
    (isCustomerLoggedIn && isActiveLoading) ||
    (isCustomerLoggedIn && isActiveError && isActiveFetching) ||
    (ctaState !== null && isDesignateCtaDisabled(ctaState.status));

  const requestButtonLabel =
    ctaState?.buttonLabel ??
    (designateMutation.isPending || (isActiveError && isActiveFetching)
      ? "요청 중..."
      : "지정 견적 요청하기");

  const requestEstimate = async () => {
    if (isAuthPending) {
      return;
    }

    if (!isAuthenticated) {
      loginRequiredModal?.openLoginRequiredModal("지정 견적 요청은 로그인 후 이용할 수 있어요.");
      return;
    }

    if (!isCustomer) {
      return;
    }

    if (isActiveLoading || designateMutation.isPending || (isActiveError && isActiveFetching)) {
      return;
    }

    let request = activeRequest ?? null;

    // 조회 실패 상태면 재클릭 시 refetch 후 최신 결과로 CTA 판단
    if (isActiveError) {
      const result = await refetchActiveRequest();
      if (result.error) {
        onError("견적 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.");
        return;
      }
      request = result.data ?? null;
    }

    const nextCtaState = getDesignateCtaState(request, moverId);

    if (nextCtaState.status === "needEstimateRequest") {
      setIsEstimateRequestModalOpen(true);
      return;
    }

    // 확정 견적이 있으면 추가 지정을 막고 현재 진행 중인 견적 상세로 안내
    if (nextCtaState.status === "confirmed" && nextCtaState.estimateRequestId !== null) {
      router.push(APP_ROUTES.ESTIMATES.REQUEST_DETAIL(nextCtaState.estimateRequestId));
      return;
    }

    if (isDesignateCtaDisabled(nextCtaState.status)) {
      return;
    }

    if (nextCtaState.message) {
      onError(nextCtaState.message);
      return;
    }

    if (!nextCtaState.canSubmit || nextCtaState.estimateRequestId === null) {
      return;
    }

    designateMutation.mutate({
      estimateRequestId: nextCtaState.estimateRequestId,
      moverId,
    });
  };

  return {
    closeDesignateSuccessModal: () => setIsDesignateSuccessModalOpen(false),
    closeEstimateRequestModal: () => setIsEstimateRequestModalOpen(false),
    isDesignateSuccessModalOpen,
    isEstimateRequestModalOpen,
    isRequestDisabled,
    requestButtonLabel,
    requestEstimate,
    showCustomerActions: !isAuthPending && (!isAuthenticated || isCustomer),
  };
}
