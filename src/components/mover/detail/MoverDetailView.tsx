"use client";

import { useState } from "react";

import { useFavoriteMover } from "@/hooks/useFavoriteMover";
import { useMoverDesignation } from "@/hooks/useMoverDesignation";
import { useMoverDetail } from "@/hooks/useMoverDetail";

import Toast from "@/components/common/Toast/Toast";
import DetailHeroBanner from "@/components/common/DetailHeroBanner";
import DesignateSuccessModal from "@/components/estimate/DesignateSuccessModal";
import EstimateRequestRequiredModal from "@/components/estimate/EstimateRequestRequiredModal";

import MoverDetailActions from "@/components/mover/detail/MoverDetailActions";
import MoverDetailNotFoundStatus from "@/components/mover/detail/MoverDetailNotFoundStatus";
import MoverDetailPageSkeleton from "@/components/mover/detail/MoverDetailPageSkeleton";
import MoverDetailProfile from "@/components/mover/detail/MoverDetailProfile";
import MoverDetailReviews from "@/components/mover/detail/MoverDetailReviews";
import MoverDetailServices from "@/components/mover/detail/MoverDetailServices";
import MoverDetailShare from "@/components/mover/detail/MoverDetailShare";
import MoversErrorPanel from "@/components/mover/MoversErrorPanel";

interface MoverDetailViewProps {
  moverId: string;
}

export default function MoverDetailView({ moverId }: MoverDetailViewProps) {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const { detail, isInitialLoading, isNotFound, query } = useMoverDetail(moverId);
  const favoriteMutation = useFavoriteMover({ onError: setToastMessage });
  const designation = useMoverDesignation({
    moverId,
    onError: setToastMessage,
  });

  // SSR guest 상세가 로그인 사용자 정보보다 먼저 노출되지 않도록 세션 확인 완료까지 대기합니다.
  if (isInitialLoading) {
    return <MoverDetailPageSkeleton />;
  }

  if (!detail) {
    if (isNotFound) {
      return <MoverDetailNotFoundStatus />;
    }

    return (
      <div className="bg-background-default flex w-full flex-1 flex-col items-center justify-center">
        <MoversErrorPanel
          title="불러오지 못했어요"
          description="기사님 정보를 가져오는 중 문제가 발생했습니다."
          actionLabel="다시 시도"
          isRetrying={query.isFetching}
          onRetry={() => {
            void query.refetch();
          }}
        />
      </div>
    );
  }

  const toggleFavorite = () => {
    if (favoriteMutation.isPending) {
      return;
    }

    favoriteMutation.mutate({
      moverId: detail.id,
      nextIsFavorite: !detail.isFavorite,
    });
  };

  const actionsProps = {
    moverName: detail.name,
    isFavorite: detail.isFavorite,
    onToggleFavorite: toggleFavorite,
    onRequestEstimate: designation.requestEstimate,
    requestDisabled: designation.isRequestDisabled,
    requestButtonLabel: designation.requestButtonLabel,
  };

  const shareProps = {
    favoriteCount: detail.favoriteCount,
    moverName: detail.name,
    profileImageSrc: detail.profileImageSrc,
  };

  return (
    <div className="bg-background-default flex w-full max-w-full flex-col items-start overflow-x-hidden pb-[110px] lg:pb-0">
      <DetailHeroBanner imageUrl={detail.profileImageSrc} name={detail.name} />

      <div className="px-margin-mobile md:px-margin-tablet flex w-full flex-col items-center pt-24 pb-64 md:pt-28 md:pb-80 lg:px-0 lg:pb-[150px]">
        <div className="max-w-container-desktop flex w-full flex-col items-stretch gap-32 md:gap-40 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex w-full min-w-0 flex-col gap-40 md:gap-40 lg:w-[766px]">
            <MoverDetailProfile
              detail={detail}
              onToggleFavorite={toggleFavorite}
              showFavoriteAction={designation.showCustomerActions}
            />
            <MoverDetailServices detail={detail} />

            <div className="border-border-subtle w-full border-t lg:hidden" aria-hidden="true" />

            <div className="lg:hidden">
              <MoverDetailShare {...shareProps} onToastMessage={setToastMessage} />
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
            {designation.showCustomerActions ? (
              <MoverDetailActions layout="sidebar" {...actionsProps} />
            ) : null}
            <MoverDetailShare {...shareProps} onToastMessage={setToastMessage} />
          </aside>
        </div>
      </div>

      {designation.showCustomerActions ? (
        <MoverDetailActions layout="sticky" {...actionsProps} />
      ) : null}

      <EstimateRequestRequiredModal
        open={designation.isEstimateRequestModalOpen}
        onClose={designation.closeEstimateRequestModal}
      />

      <DesignateSuccessModal
        open={designation.isDesignateSuccessModalOpen}
        onClose={designation.closeDesignateSuccessModal}
      />

      {toastMessage ? <Toast onClose={() => setToastMessage(null)}>{toastMessage}</Toast> : null}
    </div>
  );
}
