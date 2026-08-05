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

// 2026.07.25 정슬기 - [추가] 대기 중 견적 요청별 요약+견적서 그리드
// 2026.07.25 정슬기 - [수정] ViewModel 기준 + Empty(견적 미도착) + Tablet 1열/Desktop 2열
// 2026.07.27 정슬기 - [수정] 요청 묶음 section에 aria-labelledby로 header 제목 연결
// 2026.07.29 정슬기 - [수정] 목록 전체 empty를 EstimatesListEmptyState로 위치·규격 통일
export default function PendingEstimatesList({
  sections,
  onFavoriteError,
  onConfirmError,
  onConfirmSuccess,
}: PendingEstimatesListProps) {
  const waitingSections = sections.filter(isWaitingSection);

  if (waitingSections.length === 0) {
    return <EstimatesListEmptyState description="대기 중인 견적이 없습니다." />;
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
                {/* Desktop xl: 2열·1140·gap24 / Tablet md: 1열·600·gap32 / Mobile: 1열·327·gap20 */}
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
