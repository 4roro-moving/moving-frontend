"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useState, useSyncExternalStore } from "react";

import Button from "@/components/common/Button/Button";
import EstimateRequestSummaryContent, {
  ESTIMATE_REQUEST_DETAIL_CARD_CLASSNAME,
} from "@/components/estimate/EstimateRequestSummaryContent";
import ReportModal from "@/components/report/ReportModal";
import ReportMoreMenu from "@/components/report/ReportMoreMenu";
import type { MoverEstimateRequest } from "@/types/moverEstimateRequest";

function formatElapsedTime(date: string, locale: string) {
  const diffMinutes = Math.max(1, Math.floor((Date.now() - new Date(date).getTime()) / 60_000));
  const formatter = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

  if (diffMinutes < 60) {
    return formatter.format(-diffMinutes, "minute");
  }

  const hours = Math.floor(diffMinutes / 60);
  if (hours < 24) {
    return formatter.format(-hours, "hour");
  }

  return formatter.format(-Math.floor(hours / 24), "day");
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
function useElapsedLabel(createdAt: string, locale: string): string | undefined {
  return useSyncExternalStore(
    subscribeElapsedTick,
    () => formatElapsedTime(createdAt, locale),
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
  const locale = useLocale();
  const t = useTranslations("estimates");
  const tReport = useTranslations("report");
  const elapsedLabel = useElapsedLabel(request.createdAt, locale);

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const reportAction = (
    <ReportMoreMenu
      ariaLabel={tReport("customerMoreMenuAria")}
      onReport={() => setIsReportModalOpen(true)}
      triggerSizeClassName="size-28"
      triggerIconClassName="text-[20px] leading-none"
      menuPositionClassName="top-[calc(100%+6px)]"
      reportLabel={<span className="text-sm font-medium">{tReport("reportAction")}</span>}
    />
  );

  return (
    <>
      <article className={ESTIMATE_REQUEST_DETAIL_CARD_CLASSNAME}>
        <EstimateRequestSummaryContent
          moveType={request.moveType}
          isDesignated={request.isDesignated}
          title={t("mover.customerName", { name: request.customer.name })}
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
            {t("mover.reject")}
          </Button>

          <Button
            size="cta"
            fullWidth
            className="order-1"
            onClick={() => onSendEstimate(request)}
            rightIcon={<Image src="/icons/write.svg" alt="" width={24} height={24} />}
          >
            {t("mover.send")}
          </Button>
        </div>
      </article>

      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        targetType="CUSTOMER"
        targetId={request.customer.id}
        targetName={t("mover.customerName", { name: request.customer.name })}
      />
    </>
  );
}
