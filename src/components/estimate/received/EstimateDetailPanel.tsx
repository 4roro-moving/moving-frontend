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
      className="bg-background-surface border-border-subtle rounded-20 flex w-full flex-col items-center border-[0.5px] px-20 py-32 shadow-[-2px_-2px_10px_0_rgba(220,220,220,0.14),2px_2px_10px_0_rgba(220,220,220,0.14)] md:px-40 md:pt-48 md:pb-40"
      aria-label={`견적 요청 ${panel.estimateRequest.id}`}
    >
      <div className="flex w-full flex-col items-stretch gap-32 md:flex-row md:items-start md:gap-[60px]">
        <EstimateRequestSummary data={panel.estimateRequest} />

        <div
          className="bg-border-subtle h-px w-full shrink-0 md:h-auto md:w-px md:self-stretch"
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
