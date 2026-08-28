import { useTranslations } from "next-intl";
import EstimatesListEmptyState from "@/components/estimate/EstimatesListEmptyState";
import PendingEstimateCard from "@/components/estimate/pending/PendingEstimateCard";
import PendingEstimateRequestHeader from "@/components/estimate/pending/PendingEstimateRequestHeader";
import PendingEstimatesEmpty from "@/components/estimate/pending/PendingEstimatesEmpty";
import type { PendingEstimateSection } from "@/types/estimate";

interface PendingEstimatesListProps {
  sections: PendingEstimateSection[];
  onFavoriteError?: (message: string) => void;
  onConfirmError?: (message: string) => void;
  onConfirmSuccess?: () => void;
}

function isWaitingSection(section: PendingEstimateSection): boolean {
  const { request } = section;

  return request.isActive && (request.status === "PENDING" || request.status === "OPEN");
}

export default function PendingEstimatesList({
  sections,
  onFavoriteError,
  onConfirmError,
  onConfirmSuccess,
}: PendingEstimatesListProps) {
  const t = useTranslations("estimates");
  const waitingSections = sections.filter(isWaitingSection);

  if (waitingSections.length === 0) {
    return <EstimatesListEmptyState description={t("pending.empty")} alignWithFilter />;
  }

  return (
    <div className="flex w-full flex-col">
      {waitingSections.map((section) => {
        const titleId = `request-${section.request.id}-title`;

        return (
          <section
            key={section.request.id}
            className="flex w-full flex-col"
            aria-labelledby={titleId}
          >
            <PendingEstimateRequestHeader request={section.request} titleId={titleId} />

            {section.estimates.length === 0 ? (
              <div className="bg-background-default flex w-full justify-center">
                <PendingEstimatesEmpty />
              </div>
            ) : (
              <div className="bg-background-subtle px-margin-mobile md:px-margin-tablet flex w-full justify-center pt-35 pb-64 md:pt-42 md:pb-80 xl:px-0 xl:pt-78 xl:pb-80">
                <div className="max-w-container-pending-mobile md:max-w-container-pending-tablet xl:max-w-container-pending-desktop grid w-full grid-cols-1 gap-20 md:gap-32 xl:grid-cols-2 xl:gap-24">
                  {section.estimates.map((offer) => (
                    <PendingEstimateCard
                      key={offer.id}
                      offer={offer}
                      moveType={section.request.moveType}
                      onFavoriteError={onFavoriteError}
                      onConfirmError={onConfirmError}
                      onConfirmSuccess={onConfirmSuccess}
                    />
                  ))}
                </div>
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
