"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

import Button from "@/components/common/Button/Button";
import EstimateRequestSummaryContent, {
  ESTIMATE_REQUEST_DETAIL_CARD_CLASSNAME,
} from "@/components/estimate/EstimateRequestSummaryContent";
import ReportModal from "@/components/report/ReportModal";
import { cn } from "@/lib/utils/cn";
import type { MoverEstimateRequest } from "@/types/moverEstimateRequest";

function formatElapsedTime(date: string) {
  const minutes = Math.max(1, Math.floor((Date.now() - new Date(date).getTime()) / 60000));

  if (minutes < 60) {
    return `${minutes}분 전`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours}시간 전`;
  }

  return `${Math.floor(hours / 24)}일 전`;
}

const ELAPSED_TICK_MS = 60_000;

function subscribeElapsedTick(onStoreChange: () => void) {
  const intervalId = window.setInterval(onStoreChange, ELAPSED_TICK_MS);

  return () => {
    window.clearInterval(intervalId);
  };
}

/**
 * 서버 스냅샷은 비워 두고, 클라이언트에서만 상대 시각을 계산해 hydration mismatch를 피합니다.
 * 분 단위 타이머로 구독해 카드가 열린 동안 라벨이 갱신됩니다.
 * // 2026.07.30 정슬기 - [수정] 경과 시간 분 단위 갱신 구독 추가
 */
function useElapsedLabel(createdAt: string): string | undefined {
  return useSyncExternalStore(
    subscribeElapsedTick,
    () => formatElapsedTime(createdAt),
    () => undefined,
  );
}

interface ReceivedRequestCardProps {
  request: MoverEstimateRequest;
  onSendEstimate: (request: MoverEstimateRequest) => void;
  onRejectEstimate: (request: MoverEstimateRequest) => void;
}

/**
 * 기사님 받은 견적 요청 카드
 * 요약 UI는 EstimateRequestSummaryContent 공통 사용, 액션만 기사 전용
 * // 2026.07.29 정슬기 - [수정] 요청 요약 공통 컴포넌트 분리
 * // 2026.07.30 정슬기 - [수정] elapsed time을 클라이언트 전용으로 계산해 hydration mismatch 방지
 */
export default function ReceivedRequestCard({
  request,
  onSendEstimate,
  onRejectEstimate,
}: ReceivedRequestCardProps) {
  const elapsedLabel = useElapsedLabel(request.createdAt);

  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const moreMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isMoreMenuOpen) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setIsMoreMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMoreMenuOpen]);

  const handleReportClick = () => {
    setIsMoreMenuOpen(false);
    setIsReportModalOpen(true);
  };

  const reportAction = (
    <div ref={moreMenuRef} className="relative shrink-0">
      <button
        type="button"
        aria-label="고객 메뉴 더보기"
        aria-haspopup="menu"
        aria-expanded={isMoreMenuOpen}
        onClick={() => {
          setIsMoreMenuOpen((current) => !current);
        }}
        className={cn(
          "text-text-secondary",
          "flex size-28 items-center justify-center rounded-full",
          "transition-colors",
          "hover:bg-background-subtle hover:text-text-primary",
        )}
      >
        <span aria-hidden="true" className="text-[20px] leading-none">
          ⋮
        </span>
      </button>

      {isMoreMenuOpen ? (
        <div
          role="menu"
          className={cn(
            "border-border-default bg-background-surface",
            "absolute top-[calc(100%+6px)] right-0 z-30",
            "rounded-8 min-w-[132px] border p-4",
            "shadow-md",
          )}
        >
          <button
            type="button"
            role="menuitem"
            onClick={handleReportClick}
            className={cn(
              "text-text-secondary",
              "rounded-6 flex w-full items-center gap-8",
              "px-12 py-10",
              "text-left transition-colors",
              "hover:bg-background-subtle hover:text-text-primary",
            )}
          >
            <Image src="/icons/report.svg" alt="" width={18} height={18} aria-hidden="true" />

            <span className="text-sm font-medium">신고하기</span>
          </button>
        </div>
      ) : null}
    </div>
  );

  return (
    <>
      <article className={ESTIMATE_REQUEST_DETAIL_CARD_CLASSNAME}>
        <EstimateRequestSummaryContent
          moveType={request.moveType}
          isDesignated={request.isDesignated}
          title={`${request.customer.name} 고객님`}
          headerMeta={elapsedLabel}
          headerAction={reportAction}
          fromLabel={request.fromRegion}
          toLabel={request.toRegion}
          moveDate={request.moveDate}
        />

        <div className="flex flex-col gap-[11px] sm:grid sm:grid-cols-2 sm:gap-[11px]">
          <Button
            variant="outline"
            size="cta"
            fullWidth
            className="order-2 sm:order-1"
            onClick={() => onRejectEstimate(request)}
          >
            반려하기
          </Button>

          <Button
            size="cta"
            fullWidth
            className="order-1"
            onClick={() => onSendEstimate(request)}
            rightIcon={<Image src="/icons/write.svg" alt="" width={24} height={24} />}
          >
            견적 보내기
          </Button>
        </div>
      </article>

      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        targetType="CUSTOMER"
        targetId={request.customer.id}
        targetName={`${request.customer.name} 고객님`}
      />
    </>
  );
}
