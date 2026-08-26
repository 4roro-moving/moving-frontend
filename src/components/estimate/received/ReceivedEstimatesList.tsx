import { useTranslations } from "next-intl";
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
  const t = useTranslations("estimates");
  if (panels.length === 0) {
    return <EstimatesListEmptyState description={t("received.empty")} alignWithFilter />;
  }

  return (
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
