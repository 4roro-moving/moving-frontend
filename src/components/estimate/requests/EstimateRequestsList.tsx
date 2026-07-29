import Pagination from "@/components/common/Pagination/Pagination";
import EstimatesListEmptyState from "@/components/estimate/EstimatesListEmptyState";
import EstimateRequestCard from "@/components/estimate/requests/EstimateRequestCard";
import type { MyEstimateRequestItem } from "@/types/estimate";
import type { Pagination as PaginationMeta } from "@/types/pagination";

interface EstimateRequestsListProps {
  estimateRequests: MyEstimateRequestItem[];
  pagination: PaginationMeta;
  currentPage: number;
  onPageChange: (page: number) => void;
  isFetching?: boolean;
}

/**
 * 보낸 견적 요청 목록 + Empty + Pagination
 * // 2026.07.29 정슬기 - [추가]
 * // 2026.07.29 정슬기 - [수정] Empty를 EstimatesListEmptyState로 위치 통일 (CTA 유지)
 */
export default function EstimateRequestsList({
  estimateRequests,
  pagination,
  currentPage,
  onPageChange,
  isFetching = false,
}: EstimateRequestsListProps) {
  if (pagination.totalCount === 0) {
    return (
      <EstimatesListEmptyState
        description={
          <>
            아직 보낸 견적 요청이 없어요
            <br />
            이사 정보를 입력하고 기사님들의 견적을 받아보세요.
          </>
        }
        buttonLabel="견적 요청하기"
        href="/estimate-request"
      />
    );
  }

  return (
    <div
      className="px-margin-mobile md:px-margin-tablet max-w-container-desktop-narrow flex w-full flex-col gap-16 md:gap-24 lg:px-0"
      aria-busy={isFetching}
    >
      <ul className="flex w-full flex-col gap-16 md:gap-20 lg:gap-24">
        {estimateRequests.map((request) => (
          <li key={request.id}>
            <EstimateRequestCard request={request} />
          </li>
        ))}
      </ul>

      {pagination.totalPages > 1 ? (
        <div className="pt-8 md:pt-16">
          <Pagination
            currentPage={currentPage}
            pageCount={pagination.totalPages}
            onPageChange={onPageChange}
          />
        </div>
      ) : null}
    </div>
  );
}
