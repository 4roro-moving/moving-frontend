import type { InfiniteData, QueryClient } from "@tanstack/react-query";

import {
  getGiveawayDetailQueryKey,
  getGiveawayRequestMyListScopeQueryKey,
  getGiveawayRequestsScopeQueryKey,
  type AuthQueryScope,
} from "@/lib/constants/queryKeys";
import type {
  GiveawayDetail,
  GiveawayMyRequest,
  GiveawayRequestItem,
  GiveawayRequestListResult,
  GiveawayRequestMyListResult,
  MyGiveawayRequestItem,
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
  giveawayId: number,
  detail: GiveawayDetail,
) => {
  queryClient.setQueryData(getGiveawayDetailQueryKey(giveawayId), detail);
};

export const patchGiveawayDetailQueryData = (
  queryClient: QueryClient,
  giveawayId: number,
  updater: (current: GiveawayDetail) => GiveawayDetail,
) => {
  queryClient.setQueryData<GiveawayDetail>(getGiveawayDetailQueryKey(giveawayId), (current) => {
    if (current === undefined) {
      return current;
    }

    return updater(current);
  });
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
