import { useTranslations } from "next-intl";
import Pagination from "@/components/common/Pagination/Pagination";
import Select from "@/components/common/Select/Select";
import EstimatesListEmptyState from "@/components/estimate/EstimatesListEmptyState";
import EstimateRequestCard from "@/components/estimate/requests/EstimateRequestCard";
import { EstimateRequestListSkeleton } from "@/components/estimate/requests/EstimateRequestLoadingSkeletons";
import { APP_ROUTES } from "@/lib/constants/appRoutes";
import { PREVIOUS_DATA_LOADING_CLASS_NAME } from "@/lib/constants/loading";
import { cn } from "@/lib/utils/cn";
import type { EstimateRequestListStatusFilter, MyEstimateRequestItem } from "@/types/estimate";
import type { Pagination as PaginationMeta } from "@/types/pagination";

function isStatusFilter(value: string): value is EstimateRequestListStatusFilter {
  return value === "all" || value === "OPEN" || value === "COMPLETED";
}

interface EstimateRequestsListProps {
  estimateRequests: MyEstimateRequestItem[];
  pagination: PaginationMeta;
  currentPage: number;
  onPageChange: (page: number) => void;
  statusFilter: EstimateRequestListStatusFilter;
  onStatusFilterChange: (filter: EstimateRequestListStatusFilter) => void;
  isFetching?: boolean;
  /** keepPreviousData로 이전 데이터를 표시하는 필터/페이지 전환 상태 */
  isPreviousDataLoading?: boolean;
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
  isPreviousDataLoading = false,
}: EstimateRequestsListProps) {
  const t = useTranslations("estimates");
  const statusFilterOptions: { value: EstimateRequestListStatusFilter; label: string }[] = [
    { value: "all", label: t("requests.filterAll") },
    { value: "OPEN", label: t("requests.filterOpen") },
    { value: "COMPLETED", label: t("requests.filterCompleted") },
  ];
  const isAllFilter = statusFilter === "all";
  const selectedLabel =
    statusFilterOptions.find((option) => option.value === statusFilter)?.label ??
    t("requests.filterAll");

  const filterSelect = (
    <div className="flex w-full justify-end">
      <Select
        label={t("requests.filterAria")}
        desc={selectedLabel}
        defaultValue={statusFilter}
        size="lg"
        className="w-128 md:w-160"
        onChange={(value) => {
          if (isStatusFilter(value)) {
            onStatusFilterChange(value);
          }
        }}
      >
        {statusFilterOptions.map((option) => (
          <Select.Option key={option.value} value={option.value}>
            {option.label}
          </Select.Option>
        ))}
      </Select>
    </div>
  );

  if (pagination.totalCount === 0) {
    if (isPreviousDataLoading) {
      return (
        <div className="flex w-full flex-col gap-24 md:gap-32">
          <div className="px-margin-mobile md:px-margin-tablet max-w-container-desktop-narrow mx-auto w-full xl:px-0">
            {filterSelect}
          </div>

          <EstimateRequestListSkeleton />
        </div>
      );
    }

    return isAllFilter ? (
      <div className="-translate-y-26 md:-translate-y-26 xl:-translate-y-40">
        <EstimatesListEmptyState
          description={
            <>
              {t("requests.emptyTitle")}
              <br />
              {t("requests.emptyDescription")}
            </>
          }
          buttonLabel={t("requests.create")}
          href={APP_ROUTES.ESTIMATE_REQUEST}
          alignWithFilter
        />
      </div>
    ) : (
      <div className="flex w-full flex-col gap-24 md:gap-32">
        <div className="px-margin-mobile md:px-margin-tablet max-w-container-desktop-narrow mx-auto w-full xl:px-0">
          {filterSelect}
        </div>

        <EstimatesListEmptyState
          description={
            <>
              {t("requests.emptyByStatusTitle")}
              <br />
              {t("requests.emptyByStatusDescription")}
            </>
          }
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "px-margin-mobile md:px-margin-tablet max-w-container-desktop-narrow flex w-full flex-col gap-24 md:gap-40 xl:px-0",
        isPreviousDataLoading && PREVIOUS_DATA_LOADING_CLASS_NAME,
      )}
      aria-busy={isFetching}
    >
      {isPreviousDataLoading ? (
        <span className="sr-only" role="status">
          {t("requests.loading")}
        </span>
      ) : null}
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
