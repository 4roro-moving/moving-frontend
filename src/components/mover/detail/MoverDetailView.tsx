"use client";

import { useState } from "react";

import { useLoginRequiredModal } from "@/components/auth/LoginRequiredModalProvider";
import Toast from "@/components/common/Toast/Toast";
import EstimateDetailHero from "@/components/estimate/detail/EstimateDetailHero";
import EstimateDetailShare from "@/components/estimate/detail/EstimateDetailShare";
import DesignateSuccessModal from "@/components/estimate/DesignateSuccessModal";
import EstimateRequestRequiredModal from "@/components/estimate/EstimateRequestRequiredModal";
import MoverDetailActions from "@/components/mover/detail/MoverDetailActions";
import MoverDetailNotFoundStatus from "@/components/mover/detail/MoverDetailNotFoundStatus";
import MoverDetailPageSkeleton from "@/components/mover/detail/MoverDetailPageSkeleton";
import MoverDetailProfile from "@/components/mover/detail/MoverDetailProfile";
import MoverDetailReviews from "@/components/mover/detail/MoverDetailReviews";
import MoverDetailServices from "@/components/mover/detail/MoverDetailServices";
import MoversErrorPanel from "@/components/mover/MoversErrorPanel";
import { useActiveEstimateRequest } from "@/hooks/useActiveEstimateRequest";
import { useDesignateMover } from "@/hooks/useDesignateMover";
import { useFavoriteMover } from "@/hooks/useFavoriteMover";
import { useIsClient } from "@/hooks/useIsClient";
import { useMoverDetail } from "@/hooks/useMoverDetail";
import { hasAuthSession } from "@/lib/auth/session";
import { getDesignateCtaState } from "@/lib/utils/getDesignateCtaState";
import { ApiError } from "@/types/api";

interface MoverDetailViewProps {
  moverId: string;
}

function isMoverNotFoundError(error: unknown): boolean {
  return error instanceof ApiError && (error.status === 404 || error.code === "MOVER_NOT_FOUND");
}

export default function MoverDetailView({ moverId }: MoverDetailViewProps) {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isEstimateRequestModalOpen, setIsEstimateRequestModalOpen] = useState(false);
  const [isDesignateSuccessModalOpen, setIsDesignateSuccessModalOpen] = useState(false);

  const isClient = useIsClient();
  const isLoggedIn = isClient && hasAuthSession();
  const loginRequiredModal = useLoginRequiredModal();

  const { data: detail, isLoading, error, isFetching, refetch } = useMoverDetail(moverId);
  const favoriteMutation = useFavoriteMover({ onError: setToastMessage });

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
    onError: setToastMessage,
  });

  if (isLoading) {
    return <MoverDetailPageSkeleton />;
  }

  if (!detail) {
    if (isMoverNotFoundError(error)) {
      return <MoverDetailNotFoundStatus />;
    }

    return (
      <div className="bg-background-default flex w-full flex-1 flex-col items-center justify-center">
        <MoversErrorPanel
          title="불러오지 못했어요"
          description="기사님 정보를 가져오는 중 문제가 발생했습니다."
          actionLabel="다시 시도"
          isRetrying={isFetching}
          onRetry={() => {
            void refetch();
          }}
        />
      </div>
    );
  }

  const ctaState =
    isLoggedIn && !isActiveLoading && !isActiveError
      ? getDesignateCtaState(activeRequest ?? null, detail.id)
      : null;

  // 이미 지정 완료만 버튼 비활성. 한도·확정 등은 클릭 후 toast
  const isRequestDisabled =
    designateMutation.isPending ||
    (isLoggedIn && isActiveLoading) ||
    (isLoggedIn && isActiveError && isActiveFetching) ||
    ctaState?.status === "alreadyDesignated";

  const requestButtonLabel =
    ctaState?.status === "alreadyDesignated"
      ? "지정 견적 요청 완료"
      : designateMutation.isPending || (isActiveError && isActiveFetching)
        ? "요청 중..."
        : "지정 견적 요청하기";

  const toggleFavorite = () => {
    if (favoriteMutation.isPending) {
      return;
    }

    favoriteMutation.mutate({
      moverId: detail.id,
      nextIsFavorite: !detail.isFavorite,
    });
  };

  const handleRequestEstimate = async () => {
    if (!hasAuthSession()) {
      loginRequiredModal?.openLoginRequiredModal("지정 견적 요청은 로그인 후 이용할 수 있어요.");
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
        setToastMessage("견적 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.");
        return;
      }
      request = result.data ?? null;
    }

    const nextCtaState = getDesignateCtaState(request, detail.id);

    if (nextCtaState.status === "needEstimateRequest") {
      setIsEstimateRequestModalOpen(true);
      return;
    }

    if (nextCtaState.status === "alreadyDesignated") {
      return;
    }

    if (nextCtaState.message) {
      setToastMessage(nextCtaState.message);
      return;
    }

    if (!nextCtaState.canSubmit || nextCtaState.estimateRequestId === null) {
      return;
    }

    designateMutation.mutate({
      estimateRequestId: nextCtaState.estimateRequestId,
      moverId: detail.id,
    });
  };

  const actionsProps = {
    moverName: detail.name,
    isFavorite: detail.isFavorite,
    onToggleFavorite: toggleFavorite,
    onRequestEstimate: handleRequestEstimate,
    requestDisabled: isRequestDisabled,
    requestButtonLabel,
  };

  return (
    <div className="bg-background-default flex w-full max-w-full flex-col items-start overflow-x-hidden pb-[110px] lg:pb-0">
      <EstimateDetailHero imageUrl={detail.profileImageSrc} name={detail.name} />

      <div className="px-margin-mobile md:px-margin-tablet flex w-full flex-col items-center pt-24 pb-64 md:pt-28 md:pb-80 lg:px-0 lg:pb-[150px]">
        <div className="max-w-container-desktop flex w-full flex-col items-stretch gap-32 md:gap-40 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex w-full min-w-0 flex-col gap-40 md:gap-40 lg:w-[766px]">
            <MoverDetailProfile detail={detail} onToggleFavorite={toggleFavorite} />
            <MoverDetailServices detail={detail} />

            <div className="border-border-subtle w-full border-t lg:hidden" aria-hidden="true" />

            <div className="lg:hidden">
              <EstimateDetailShare
                title="나만 알기엔 아쉬운 기사님인가요?"
                onToastMessage={setToastMessage}
              />
            </div>

            <div className="border-border-subtle w-full border-t" aria-hidden="true" />

            <MoverDetailReviews
              moverId={detail.id}
              rating={detail.rating}
              reviewCount={detail.reviewCount}
              ratingDistribution={detail.ratingDistribution}
            />
          </div>

          <aside className="hidden w-full min-w-0 flex-col items-start gap-40 lg:flex lg:w-[320px] lg:gap-70 lg:pt-40">
            <MoverDetailActions layout="sidebar" {...actionsProps} />
            <EstimateDetailShare
              title="나만 알기엔 아쉬운 기사님인가요?"
              onToastMessage={setToastMessage}
            />
          </aside>
        </div>
      </div>

      <MoverDetailActions layout="sticky" {...actionsProps} />

      <EstimateRequestRequiredModal
        open={isEstimateRequestModalOpen}
        onClose={() => setIsEstimateRequestModalOpen(false)}
      />

      <DesignateSuccessModal
        open={isDesignateSuccessModalOpen}
        onClose={() => setIsDesignateSuccessModalOpen(false)}
      />

      {toastMessage ? <Toast onClose={() => setToastMessage(null)}>{toastMessage}</Toast> : null}
    </div>
  );
}
