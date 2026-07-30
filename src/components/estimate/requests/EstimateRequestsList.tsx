import Pagination from "@/components/common/Pagination/Pagination";
import Select from "@/components/common/Select/Select";
import EstimatesListEmptyState from "@/components/estimate/EstimatesListEmptyState";
import EstimatesQueryStatus from "@/components/estimate/EstimatesQueryStatus";
import EstimateRequestCard from "@/components/estimate/requests/EstimateRequestCard";
import type { EstimateRequestListStatusFilter, MyEstimateRequestItem } from "@/types/estimate";
import type { Pagination as PaginationMeta } from "@/types/pagination";

const STATUS_FILTER_OPTIONS: { value: EstimateRequestListStatusFilter; label: string }[] = [
  { value: "all", label: "전체" },
  // Figma·Badge·필터 동일 표기: OPEN = 진행 중
  { value: "OPEN", label: "진행 중" },
  { value: "COMPLETED", label: "이사 완료" },
];

const STATUS_FILTER_VALUES = new Set<EstimateRequestListStatusFilter>(
  STATUS_FILTER_OPTIONS.map((option) => option.value),
);

function isStatusFilter(value: string): value is EstimateRequestListStatusFilter {
  return STATUS_FILTER_VALUES.has(value as EstimateRequestListStatusFilter);
}

interface EstimateRequestsListProps {
  estimateRequests: MyEstimateRequestItem[];
  pagination: PaginationMeta;
  currentPage: number;
  onPageChange: (page: number) => void;
  statusFilter: EstimateRequestListStatusFilter;
  onStatusFilterChange: (filter: EstimateRequestListStatusFilter) => void;
  isFetching?: boolean;
  /** keepPreviousData 잔상 — 필터/페이지 전환 중 이전 카드 숨김 */
  isPlaceholderData?: boolean;
}

/**
 * 보낸 견적 요청 목록 + 상태 필터 + Empty + Pagination
 * // 2026.07.29 정슬기 - [추가]
 * // 2026.07.29 정슬기 - [수정] Empty 카피·목록 gap을 받았던 견적 목록에 맞춤
 * // 2026.07.29 정슬기 - [수정] status 필터·필터 Empty 분기
 * // 2026.07.30 정슬기 - [수정] placeholder 시 필터 유지·카드 잔상 제거
 */
export default function EstimateRequestsList({
  estimateRequests,
  pagination,
  currentPage,
  onPageChange,
  statusFilter,
  onStatusFilterChange,
  isFetching = false,
  isPlaceholderData = false,
}: EstimateRequestsListProps) {
  const isAllFilter = statusFilter === "all";
  const selectedLabel =
    STATUS_FILTER_OPTIONS.find((option) => option.value === statusFilter)?.label ?? "전체";

  const filterSelect = (
    <div className="flex w-full justify-end">
      <Select
        label="견적 요청 상태 필터"
        desc={selectedLabel}
        defaultValue={statusFilter}
        size="lg"
        className="w-[128px] md:w-[160px]"
        onChange={(value) => {
          if (isStatusFilter(value)) {
            onStatusFilterChange(value);
          }
        }}
      >
        {STATUS_FILTER_OPTIONS.map((option) => (
          <Select.Option key={option.value} value={option.value}>
            {option.label}
          </Select.Option>
        ))}
      </Select>
    </div>
  );

  if (isPlaceholderData) {
    return (
      <div
        className="px-margin-mobile md:px-margin-tablet max-w-container-desktop-narrow flex w-full flex-col gap-24 md:gap-40 lg:px-0"
        aria-busy="true"
      >
        {filterSelect}
        <EstimatesQueryStatus message="보낸 견적 요청을 불러오는 중입니다." />
      </div>
    );
  }

  if (pagination.totalCount === 0) {
    return (
      <div className="flex w-full flex-col gap-24 md:gap-32">
        <div className="px-margin-mobile md:px-margin-tablet max-w-container-desktop-narrow mx-auto w-full lg:px-0">
          {filterSelect}
        </div>
        {isAllFilter ? (
          <EstimatesListEmptyState
            description={
              <>
                아직 보낸 견적 요청이 없어요
                <br />
                견적 요청을 작성하고 기사님의 견적을 받아보세요
              </>
            }
            buttonLabel="견적 요청하기"
            href="/estimate-request"
          />
        ) : (
          <EstimatesListEmptyState
            description={
              <>
                해당 상태의 견적 요청이 없어요.
                <br />
                다른 상태를 선택해 확인해보세요.
              </>
            }
          />
        )}
      </div>
    );
  }

  return (
    <div
      className="px-margin-mobile md:px-margin-tablet max-w-container-desktop-narrow flex w-full flex-col gap-24 md:gap-40 lg:px-0"
      aria-busy={isFetching}
    >
      {filterSelect}

      <ul className="flex w-full flex-col gap-24 md:gap-40">
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
