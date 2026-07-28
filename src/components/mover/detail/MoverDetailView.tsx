"use client";

import { useState } from "react";

import Toast from "@/components/common/Toast/Toast";
import EstimateDetailHero from "@/components/estimate/detail/EstimateDetailHero";
import EstimateDetailShare from "@/components/estimate/detail/EstimateDetailShare";
import ReceivedEstimatesStatus from "@/components/estimate/received/ReceivedEstimatesStatus";
import MoverDetailActions from "@/components/mover/detail/MoverDetailActions";
import MoverDetailProfile from "@/components/mover/detail/MoverDetailProfile";
import MoverDetailReviews from "@/components/mover/detail/MoverDetailReviews";
import MoverDetailServices from "@/components/mover/detail/MoverDetailServices";
import { useFavoriteMover } from "@/hooks/useFavoriteMover";
import { isMoverDetailId, useMoverDetail } from "@/hooks/useMoverDetail";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";

interface MoverDetailViewProps {
  moverId: string;
}

export default function MoverDetailView({ moverId }: MoverDetailViewProps) {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const { data: detail, isLoading, isError, error, refetch } = useMoverDetail(moverId);
  const favoriteMutation = useFavoriteMover({ onError: setToastMessage });

  if (!isMoverDetailId(moverId)) {
    return (
      <div className="bg-background-default flex w-full flex-col">
        <ReceivedEstimatesStatus message="유효하지 않은 기사님 ID입니다." />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-background-default flex w-full flex-col">
        <ReceivedEstimatesStatus message="기사님 정보를 불러오는 중입니다." />
      </div>
    );
  }

  if (isError || !detail) {
    return (
      <div className="bg-background-default flex w-full flex-col">
        <ReceivedEstimatesStatus
          message={getApiErrorMessage(error, "기사님 정보를 불러오지 못했습니다.")}
          actionLabel="다시 시도"
          onAction={() => {
            void refetch();
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

  const handleRequestEstimate = () => {
    setToastMessage("지정 견적 요청은 준비 중입니다.");
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
            <MoverDetailActions
              layout="sidebar"
              moverName={detail.name}
              isFavorite={detail.isFavorite}
              onToggleFavorite={toggleFavorite}
              onRequestEstimate={handleRequestEstimate}
            />
            <EstimateDetailShare
              title="나만 알기엔 아쉬운 기사님인가요?"
              onToastMessage={setToastMessage}
            />
          </aside>
        </div>
      </div>

      <MoverDetailActions
        layout="sticky"
        moverName={detail.name}
        isFavorite={detail.isFavorite}
        onToggleFavorite={toggleFavorite}
        onRequestEstimate={handleRequestEstimate}
      />

      {toastMessage ? <Toast onClose={() => setToastMessage(null)}>{toastMessage}</Toast> : null}
    </div>
  );
}
