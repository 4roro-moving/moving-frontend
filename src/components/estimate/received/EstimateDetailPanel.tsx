import { getMoveTypeLabel } from "@/lib/utils/estimateFormat";
import type { ReceivedEstimatePanel } from "@/types/estimate";
import { cn } from "@/lib/utils/cn";
import {
  ESTIMATE_LIST_PANEL_PADDING_CLASSNAME,
  ESTIMATE_LIST_PANEL_SURFACE_CLASSNAME,
} from "@/components/estimate/estimateSurfaceStyles";

import EstimateOfferSection from "./EstimateOfferSection";
import EstimateRequestSummary from "./EstimateRequestSummary";

interface EstimateDetailPanelProps {
  panel: ReceivedEstimatePanel;
  onFavoriteError?: (message: string) => void;
}

export default function EstimateDetailPanel({ panel, onFavoriteError }: EstimateDetailPanelProps) {
  const { moveType, fromAddress, toAddress } = panel.estimateRequest;

  return (
    <article
      // 2026.07.24 정슬기 - [수정] Mobile은 Figma처럼 border/shadow 없는 flat surface, md+는 기존 패널 스타일 유지
      // 2026.08.07 정슬기 - [수정] 패널 surface를 공통 토큰 클래스로 통일
      className={cn(
        ESTIMATE_LIST_PANEL_SURFACE_CLASSNAME,
        ESTIMATE_LIST_PANEL_PADDING_CLASSNAME,
        "flex w-full flex-col items-center",
      )}
      aria-label={`${getMoveTypeLabel(moveType)} · ${fromAddress} → ${toAddress}`}
    >
      <div className="flex w-full flex-col items-stretch gap-28 md:gap-40 xl:flex-row xl:items-start xl:gap-60">
        <EstimateRequestSummary data={panel.estimateRequest} />

        <div
          className="bg-border-subtle hidden h-px w-full shrink-0 md:block xl:h-auto xl:w-px xl:self-stretch"
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
