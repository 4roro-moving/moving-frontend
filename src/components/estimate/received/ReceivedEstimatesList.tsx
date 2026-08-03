import EstimatesListEmptyState from "@/components/estimate/EstimatesListEmptyState";
import type { ReceivedEstimatePanel } from "@/types/estimate";

import EstimateDetailPanel from "./EstimateDetailPanel";

interface ReceivedEstimatesListProps {
  panels: ReceivedEstimatePanel[];
  onFavoriteError?: (message: string) => void;
}

export default function ReceivedEstimatesList({
  panels,
  onFavoriteError,
}: ReceivedEstimatesListProps) {
  // 2026.07.24 정슬기 - [추가] 받은 견적이 없을 때 빈 상태 표시
  // 2026.07.29 정슬기 - [수정] EstimatesListEmptyState로 위치·규격 통일, CTA 없음
  if (panels.length === 0) {
    return <EstimatesListEmptyState description="받은 견적이 없습니다." />;
  }

  // 2026.07.24 정슬기 - [수정] Figma margin/mobile·tablet 적용, Desktop 컨테이너는 lg부터
  return (
    // 2026.07.24 정슬기 - [수정] container-desktop-narrow max-width 토큰 유틸 사용
    <div className="px-margin-mobile md:px-margin-tablet max-w-container-desktop-narrow flex w-full flex-col gap-24 md:gap-40 xl:px-0">
      {panels.map((panel) => (
        <EstimateDetailPanel
          key={panel.estimateRequest.id}
          panel={panel}
          onFavoriteError={onFavoriteError}
        />
      ))}
    </div>
  );
}
