"use client";

import { useMemo, useState } from "react";

import Toast from "@/components/common/Toast/Toast";
import EstimateDetailHero from "@/components/estimate/detail/EstimateDetailHero";
import EstimateDetailShare from "@/components/estimate/detail/EstimateDetailShare";
import MoverDetailActions from "@/components/mover/detail/MoverDetailActions";
import MoverDetailProfile from "@/components/mover/detail/MoverDetailProfile";
import MoverDetailReviews from "@/components/mover/detail/MoverDetailReviews";
import MoverDetailServices from "@/components/mover/detail/MoverDetailServices";
import { getMockMoverDetail } from "@/components/mover/detail/moverDetailMock";
import type { MoverDetail } from "@/types/moverDetail";

interface MoverDetailViewProps {
  moverId: string;
}

export default function MoverDetailView({ moverId }: MoverDetailViewProps) {
  const initialDetail = useMemo(() => getMockMoverDetail(moverId), [moverId]);
  const [detail, setDetail] = useState<MoverDetail | null>(initialDetail);
  const [reviewPage, setReviewPage] = useState(1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!detail) {
    return (
      <div className="bg-background-default px-margin-mobile flex w-full flex-col items-center py-80">
        <p className="text-text-muted">기사님 정보를 찾을 수 없습니다.</p>
      </div>
    );
  }

  const toggleFavorite = () => {
    setDetail((prev) => {
      if (!prev) {
        return prev;
      }

      const nextIsFavorite = !prev.isFavorite;
      return {
        ...prev,
        isFavorite: nextIsFavorite,
        favoriteCount: Math.max(0, prev.favoriteCount + (nextIsFavorite ? 1 : -1)),
      };
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
              detail={detail}
              currentPage={reviewPage}
              onPageChange={setReviewPage}
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
