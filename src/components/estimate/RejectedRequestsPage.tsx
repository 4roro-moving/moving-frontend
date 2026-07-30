"use client";

import { Text } from "@/components/common/Text";
import MoverEstimateTabs from "@/components/estimate/MoverEstimateTabs";
import RejectedRequestCard from "@/components/estimate/RejectedRequestCard";
import EstimatesQueryStatus from "@/components/estimate/EstimatesQueryStatus";
import { useRejectedEstimateRequests } from "@/hooks/useMoverEstimateRequests";

export default function RejectedRequestsPage() {
  const query = useRejectedEstimateRequests();

  return (
    <>
      <MoverEstimateTabs />
      <main className="bg-background-subtle min-h-[calc(100vh-108px)] px-24 pt-24 pb-40 md:min-h-[calc(100vh-142px)] md:px-72 md:pt-32 lg:min-h-[calc(100vh-168px)] lg:px-0 lg:pt-[59px] lg:pb-[107px]">
        <h1 className="sr-only">반려 요청</h1>

        {query.isPending ? (
          <Text variant="lg-regular" className="text-text-muted py-80 text-center">
            반려 요청을 불러오는 중이에요.
          </Text>
        ) : null}

        {query.isError ? (
          <EstimatesQueryStatus
            message="반려 요청을 불러오지 못했어요."
            actionLabel={query.isFetching ? "다시 시도 중..." : "다시 시도"}
            onAction={() => {
              void query.refetch();
            }}
          />
        ) : null}

        {query.data?.length === 0 ? (
          <Text variant="lg-regular" className="text-text-muted py-80 text-center">
            반려한 요청이 없어요.
          </Text>
        ) : null}

        {query.data && query.data.length > 0 ? (
          <div className="mx-auto grid w-full max-w-[1200px] grid-cols-1 gap-20 md:max-w-[600px] md:gap-32 lg:max-w-[1200px] lg:grid-cols-2 lg:gap-24">
            {query.data.map((item) => (
              <RejectedRequestCard key={item.id} item={item} />
            ))}
          </div>
        ) : null}
      </main>
    </>
  );
}
