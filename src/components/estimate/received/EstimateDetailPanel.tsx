import type { ReceivedEstimatePanel } from "@/types/estimate";

import EstimateOfferSection from "./EstimateOfferSection";
import EstimateRequestSummary from "./EstimateRequestSummary";

interface EstimateDetailPanelProps {
  panel: ReceivedEstimatePanel;
  onFavoriteError?: (message: string) => void;
}

export default function EstimateDetailPanel({ panel, onFavoriteError }: EstimateDetailPanelProps) {
  return (
    <article
      // 2026.07.24 정슬기 - [수정] Mobile은 Figma처럼 border/shadow 없는 flat surface, md+는 기존 패널 스타일 유지
      className="bg-background-default md:bg-background-surface md:rounded-20 md:border-border-subtle flex w-full flex-col items-center border-0 px-0 py-0 shadow-none md:border-[0.5px] md:px-28 md:py-32 md:shadow-[-2px_-2px_10px_0_rgba(220,220,220,0.14),2px_2px_10px_0_rgba(220,220,220,0.14)] lg:px-40 lg:pt-48 lg:pb-40"
      aria-label={`견적 요청 ${panel.estimateRequest.id}`}
    >
      <div className="flex w-full flex-col items-stretch gap-28 md:gap-40 lg:flex-row lg:items-start lg:gap-60">
        <EstimateRequestSummary data={panel.estimateRequest} />

        <div
          className="bg-border-subtle hidden h-px w-full shrink-0 md:block lg:h-auto lg:w-px lg:self-stretch"
          aria-hidden="true"
        />

        <EstimateOfferSection
          offers={panel.estimates}
          moveType={panel.estimateRequest.moveType}
          onFavoriteError={onFavoriteError}
        />
      </div>
    </article>
  );
}
