interface ListLoadingQueryState {
  data: unknown;
  isFetching: boolean;
  isPending: boolean;
  isPlaceholderData: boolean;
}

/** 목록의 첫 조회와 이전 데이터를 유지하는 전환 상태를 구분합니다. */
export const useListLoadingState = (query: ListLoadingQueryState) => {
  const isInitialLoading = query.isPending && query.data === undefined;
  const isPreviousDataLoading = query.isFetching && query.isPlaceholderData;

  return { isInitialLoading, isPreviousDataLoading };
};
