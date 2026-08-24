import type { InfiniteData, QueryClient } from "@tanstack/react-query";

import {
  getGiveawayDetailQueryKey,
  getGiveawayRequestMyListScopeQueryKey,
  getGiveawayRequestsScopeQueryKey,
  QUERY_KEYS,
  type AuthQueryScope,
} from "@/lib/constants/queryKeys";
import {
  GIVEAWAY_REQUEST_STATUS,
  GIVEAWAY_STATUS,
  type GiveawayDetail,
  type GiveawayListResult,
  type GiveawayMyRequest,
  type GiveawayRequestItem,
  type GiveawayRequestListResult,
  type GiveawayRequestMyListResult,
  type MyGiveawayRequestItem,
} from "@/types/giveaway";

export const toGiveawayMyRequest = (request: GiveawayRequestItem): GiveawayMyRequest => {
  return {
    id: request.id,
    status: request.status,
    message: request.message,
    createdAt: request.createdAt,
    updatedAt: request.updatedAt,
  };
};

export const setGiveawayDetailQueryData = (
  queryClient: QueryClient,
  authScope: AuthQueryScope,
  giveawayId: number,
  detail: GiveawayDetail,
) => {
  queryClient.setQueryData(getGiveawayDetailQueryKey(authScope, giveawayId), detail);
};

export const patchGiveawayDetailQueryData = (
  queryClient: QueryClient,
  authScope: AuthQueryScope,
  giveawayId: number,
  updater: (current: GiveawayDetail) => GiveawayDetail,
) => {
  queryClient.setQueryData<GiveawayDetail>(
    getGiveawayDetailQueryKey(authScope, giveawayId),
    (current) => {
      if (current === undefined) {
        return current;
      }

      return updater(current);
    },
  );
};

export const patchGiveawayRequestsQueryData = (
  queryClient: QueryClient,
  giveawayId: number,
  updater: (request: GiveawayRequestItem) => GiveawayRequestItem,
) => {
  queryClient.setQueriesData<InfiniteData<GiveawayRequestListResult>>(
    { queryKey: getGiveawayRequestsScopeQueryKey(giveawayId) },
    (current) => {
      if (current === undefined || !Array.isArray(current.pages)) {
        return current;
      }

      return {
        ...current,
        pages: current.pages.map((page) => ({
          ...page,
          data: page.data.map(updater),
        })),
      };
    },
  );
};

export const patchMyGiveawayRequestQueryData = (
  queryClient: QueryClient,
  authScope: AuthQueryScope,
  requestId: number,
  updater: (request: MyGiveawayRequestItem) => MyGiveawayRequestItem,
) => {
  queryClient.setQueriesData<InfiniteData<GiveawayRequestMyListResult>>(
    { queryKey: getGiveawayRequestMyListScopeQueryKey(authScope) },
    (current) => {
      if (current === undefined) {
        return current;
      }

      return {
        ...current,
        pages: current.pages.map((page) => ({
          ...page,
          data: page.data.map((item) => (item.id === requestId ? updater(item) : item)),
        })),
      };
    },
  );
};

export const applyGiveawayRequestItemToCaches = (
  queryClient: QueryClient,
  authScope: AuthQueryScope,
  request: GiveawayRequestItem,
) => {
  patchGiveawayRequestsQueryData(queryClient, request.giveawayId, (item) =>
    item.id === request.id ? request : item,
  );
  patchMyGiveawayRequestQueryData(queryClient, authScope, request.id, (item) => ({
    ...item,
    status: request.status,
    message: request.message,
    updatedAt: request.updatedAt,
  }));
};

const patchGiveawayListActiveRequestCount = (
  queryClient: QueryClient,
  giveawayId: number,
  delta: number,
) => {
  const patchPages = (current: InfiniteData<GiveawayListResult> | undefined) => {
    if (current === undefined || !Array.isArray(current.pages)) {
      return current;
    }

    return {
      ...current,
      pages: current.pages.map((page) => ({
        ...page,
        data: page.data.map((item) =>
          item.id === giveawayId
            ? { ...item, activeRequestCount: Math.max(0, item.activeRequestCount + delta) }
            : item,
        ),
      })),
    };
  };

  queryClient.setQueriesData<InfiniteData<GiveawayListResult>>(
    { queryKey: QUERY_KEYS.GIVEAWAYS.LIST },
    patchPages,
  );
  queryClient.setQueriesData<InfiniteData<GiveawayListResult>>(
    { queryKey: QUERY_KEYS.GIVEAWAYS.ME },
    patchPages,
  );
};

const patchMyGiveawayRequestsByGiveawayId = (
  queryClient: QueryClient,
  authScope: AuthQueryScope,
  giveawayId: number,
  updater: (request: MyGiveawayRequestItem) => MyGiveawayRequestItem,
) => {
  queryClient.setQueriesData<InfiniteData<GiveawayRequestMyListResult>>(
    { queryKey: getGiveawayRequestMyListScopeQueryKey(authScope) },
    (current) => {
      if (current === undefined) {
        return current;
      }

      return {
        ...current,
        pages: current.pages.map((page) => ({
          ...page,
          data: page.data.map((item) => (item.giveaway.id === giveawayId ? updater(item) : item)),
        })),
      };
    },
  );
};

/** SSE 알림을 화면 캐시에 바로 반영합니다. refetch 전에 버튼·카운트가 바뀌도록 합니다. */
export const applyGiveawayNotificationToCaches = (
  queryClient: QueryClient,
  authScope: AuthQueryScope,
  type: string | undefined,
  giveawayId: number,
) => {
  if (type === "GIVEAWAY_REQUEST_RECEIVED") {
    patchGiveawayDetailQueryData(queryClient, authScope, giveawayId, (current) => ({
      ...current,
      activeRequestCount: current.activeRequestCount + 1,
    }));
    patchGiveawayListActiveRequestCount(queryClient, giveawayId, 1);
    return;
  }

  if (type === "GIVEAWAY_REQUEST_REJECTED") {
    patchGiveawayDetailQueryData(queryClient, authScope, giveawayId, (current) => ({
      ...current,
      canRequest: current.status === GIVEAWAY_STATUS.AVAILABLE,
      myRequest: current.myRequest
        ? { ...current.myRequest, status: GIVEAWAY_REQUEST_STATUS.REJECTED }
        : current.myRequest,
      activeRequestCount: Math.max(0, current.activeRequestCount - 1),
    }));
    patchGiveawayListActiveRequestCount(queryClient, giveawayId, -1);
    patchMyGiveawayRequestsByGiveawayId(queryClient, authScope, giveawayId, (item) =>
      item.status === GIVEAWAY_REQUEST_STATUS.PENDING
        ? { ...item, status: GIVEAWAY_REQUEST_STATUS.REJECTED }
        : item,
    );
    return;
  }

  if (type === "GIVEAWAY_REQUEST_CANCELED") {
    patchGiveawayDetailQueryData(queryClient, authScope, giveawayId, (current) => ({
      ...current,
      activeRequestCount: Math.max(0, current.activeRequestCount - 1),
    }));
    patchGiveawayListActiveRequestCount(queryClient, giveawayId, -1);
    return;
  }

  if (type === "GIVEAWAY_REQUEST_SELECTED") {
    patchGiveawayDetailQueryData(queryClient, authScope, giveawayId, (current) => ({
      ...current,
      status: GIVEAWAY_STATUS.IN_PROGRESS,
      canRequest: false,
      myRequest: current.myRequest
        ? { ...current.myRequest, status: GIVEAWAY_REQUEST_STATUS.SELECTED }
        : current.myRequest,
    }));
    return;
  }

  if (type === "GIVEAWAY_COMPLETED") {
    patchGiveawayDetailQueryData(queryClient, authScope, giveawayId, (current) => ({
      ...current,
      status: GIVEAWAY_STATUS.COMPLETED,
      canRequest: false,
    }));
  }
};
