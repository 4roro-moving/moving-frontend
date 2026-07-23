import { Text } from "@/components/common/Text";
import type { ReceivedEstimatePanel } from "@/types/estimate";

import EstimateDetailPanel from "./EstimateDetailPanel";

interface ReceivedEstimatesListProps {
  panels: ReceivedEstimatePanel[];
}

export default function ReceivedEstimatesList({ panels }: ReceivedEstimatesListProps) {
  if (panels.length === 0) {
    return (
      <div className="flex w-full items-center justify-center py-80">
        <Text as="p" variant="lg-regular" className="text-text-muted">
          받은 견적이 없습니다.
        </Text>
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-[var(--container-desktop-narrow)] flex-col gap-40">
      {panels.map((panel) => (
        <EstimateDetailPanel key={panel.request.id} panel={panel} />
      ))}
    </div>
  );
}
