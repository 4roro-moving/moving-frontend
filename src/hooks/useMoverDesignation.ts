"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useLoginRequiredModal } from "@/components/auth/LoginRequiredModalProvider";
import { useActiveEstimateRequest } from "@/hooks/useActiveEstimateRequest";
import { useDesignateMover } from "@/hooks/useDesignateMover";
import { useIsClient } from "@/hooks/useIsClient";
import { hasAuthSession } from "@/lib/auth/session";
import { APP_ROUTES } from "@/lib/constants/appRoutes";
import { getDesignateCtaState, isDesignateCtaDisabled } from "@/lib/utils/getDesignateCtaState";

interface UseMoverDesignationOptions {
  moverId: string;
  onError: (message: string) => void;
}

export function useMoverDesignation({ moverId, onError }: UseMoverDesignationOptions) {
  const router = useRouter();

  const [isEstimateRequestModalOpen, setIsEstimateRequestModalOpen] = useState(false);
  const [isDesignateSuccessModalOpen, setIsDesignateSuccessModalOpen] = useState(false);
  const isClient = useIsClient();
  const isLoggedIn = isClient && hasAuthSession();
  const loginRequiredModal = useLoginRequiredModal();

  const {
    data: activeRequest,
    isLoading: isActiveLoading,
    isError: isActiveError,
    isFetching: isActiveFetching,
    refetch: refetchActiveRequest,
  } = useActiveEstimateRequest({
    enabled: isLoggedIn,
  });

  const designateMutation = useDesignateMover({
    onSuccess: () => {
      setIsDesignateSuccessModalOpen(true);
    },
    onError,
  });

  const ctaState =
    isLoggedIn && !isActiveLoading && !isActiveError
      ? getDesignateCtaState(activeRequest ?? null, moverId)
      : null;

  // 지정 불가 상태(완료·불가·만료·한도)는 버튼을 비활성화합니다.
  const isRequestDisabled =
    designateMutation.isPending ||
    (isLoggedIn && isActiveLoading) ||
    (isLoggedIn && isActiveError && isActiveFetching) ||
    (ctaState !== null && isDesignateCtaDisabled(ctaState.status));

  const requestButtonLabel =
    ctaState?.buttonLabel ??
    (designateMutation.isPending || (isActiveError && isActiveFetching)
      ? "요청 중..."
      : "지정 견적 요청하기");

  const requestEstimate = async () => {
    if (!hasAuthSession()) {
      loginRequiredModal?.openLoginRequiredModal("지정 견적 요청은 로그인 후 이용할 수 있어요.");
      return;
    }

    if (isActiveLoading || designateMutation.isPending || (isActiveError && isActiveFetching)) {
      return;
    }

    let request = activeRequest ?? null;

    // 조회 실패 상태면 재클릭 시 refetch 후 최신 결과로 CTA를 판단합니다.
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
  };
}
