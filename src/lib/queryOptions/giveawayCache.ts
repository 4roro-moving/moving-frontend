import type { InfiniteData, QueryClient } from "@tanstack/react-query";

import {
  getGiveawayDetailQueryKey,
  getGiveawayRequestMyListScopeQueryKey,
  getGiveawayRequestsScopeQueryKey,
  type AuthQueryScope,
} from "@/lib/constants/queryKeys";
import {
  GIVEAWAY_REQUEST_STATUS,
  GIVEAWAY_STATUS,
  type GiveawayDetail,
  type GiveawayMyRequest,
  type GiveawayRequestItem,
  type GiveawayRequestListResult,
  type GiveawayRequestMyListResult,
  type MyGiveawayRequestItem,
} from "@/types/giveaway";
import { GIVEAWAY_NOTIFICATION_TYPE } from "@/types/notification";

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

/** SSE 알림 중 글 ID만으로 안전하게 맞출 수 있는 상태만 즉시 반영합니다. */
export const applyGiveawayNotificationToCaches = (
  queryClient: QueryClient,
  authScope: AuthQueryScope,
  type: string | undefined,
  giveawayId: number,
) => {
  if (type === GIVEAWAY_NOTIFICATION_TYPE.REQUEST_REJECTED) {
    patchGiveawayDetailQueryData(queryClient, authScope, giveawayId, (current) => ({
      ...current,
      canRequest: current.status === GIVEAWAY_STATUS.AVAILABLE,
      myRequest: current.myRequest
        ? { ...current.myRequest, status: GIVEAWAY_REQUEST_STATUS.REJECTED }
        : current.myRequest,
    }));
    patchMyGiveawayRequestsByGiveawayId(queryClient, authScope, giveawayId, (item) =>
      item.status === GIVEAWAY_REQUEST_STATUS.PENDING
        ? { ...item, status: GIVEAWAY_REQUEST_STATUS.REJECTED }
        : item,
    );
    return;
  }

  if (type === GIVEAWAY_NOTIFICATION_TYPE.REQUEST_SELECTED) {
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

  if (type === GIVEAWAY_NOTIFICATION_TYPE.COMPLETED) {
    patchGiveawayDetailQueryData(queryClient, authScope, giveawayId, (current) => ({
      ...current,
      status: GIVEAWAY_STATUS.COMPLETED,
      canRequest: false,
    }));
  }
};
