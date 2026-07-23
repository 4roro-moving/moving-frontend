import type { ReceivedEstimatePanel } from "@/types/estimate";

import EstimateOfferSection from "./EstimateOfferSection";
import EstimateRequestSummary from "./EstimateRequestSummary";

interface EstimateDetailPanelProps {
  panel: ReceivedEstimatePanel;
}

export default function EstimateDetailPanel({ panel }: EstimateDetailPanelProps) {
  return (
    <article
      className="bg-background-surface border-border-subtle rounded-20 flex w-full flex-col items-center border-[0.5px] border-solid px-40 pt-48 pb-40 shadow-[-2px_-2px_10px_0_rgba(220,220,220,0.14),2px_2px_10px_0_rgba(220,220,220,0.14)]"
      aria-label={`견적 요청 ${panel.request.id}`}
    >
      <div className="flex w-full items-start gap-[60px]">
        <EstimateRequestSummary data={panel.request} />

        <div className="bg-border-subtle w-px shrink-0 self-stretch" aria-hidden="true" />

        <EstimateOfferSection offers={panel.offers} />
      </div>
    </article>
  );
}
