import type { ReceivedEstimatePanel } from "@/types/estimate";

import EstimateDetailPanel from "./EstimateDetailPanel";
import ReceivedEstimatesStatus from "./ReceivedEstimatesStatus";

interface ReceivedEstimatesListProps {
  panels: ReceivedEstimatePanel[];
  onFavoriteError?: (message: string) => void;
}

export default function ReceivedEstimatesList({
  panels,
  onFavoriteError,
}: ReceivedEstimatesListProps) {
  // 2026.07.24 정슬기 - [추가] 받은 견적이 없을 때 빈 상태 표시
  if (panels.length === 0) {
    return <ReceivedEstimatesStatus message="받은 견적이 없습니다." />;
  }

  return (
    <div className="flex w-full max-w-[var(--container-desktop-narrow)] flex-col gap-24 px-16 md:gap-40 md:px-0">
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
