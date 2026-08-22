import fetchInstance from "@/lib/api/fetchInstance";
import { API_ROUTES } from "@/lib/constants/apiRoutes";
import type { CursorPagination } from "@/types/pagination";
import type {
  GiveawayDetail,
  GiveawayRequestItem,
  GiveawayRequestListQuery,
  GiveawayRequestListResult,
  GiveawayRequestMyListQuery,
  GiveawayRequestMyListResult,
  MyGiveawayRequestItem,
  UpdateGiveawayRequestInput,
} from "@/types/giveaway";

export const fetchGiveawayRequests = async (
  giveawayId: number,
  query: GiveawayRequestListQuery,
): Promise<GiveawayRequestListResult> => {
  const params = new URLSearchParams();
  params.set("limit", String(query.limit));
  params.set("sort", query.sort);

  if (query.status !== undefined) {
    params.set("status", query.status);
  }
  if (query.cursor) {
    params.set("cursor", query.cursor);
  }

  return fetchInstance.getPaginated<GiveawayRequestItem[], CursorPagination>(
    `${API_ROUTES.GIVEAWAYS.REQUESTS(giveawayId)}?${params.toString()}`,
  );
};

export const selectGiveawayRequest = (giveawayId: number, requestId: number) =>
  fetchInstance.post<GiveawayDetail>(API_ROUTES.GIVEAWAYS.SELECT_REQUEST(giveawayId, requestId));

export const rejectGiveawayRequest = (giveawayId: number, requestId: number) =>
  fetchInstance.post<GiveawayRequestItem>(
    API_ROUTES.GIVEAWAYS.REJECT_REQUEST(giveawayId, requestId),
  );

export const fetchMyGiveawayRequests = async (
  query: GiveawayRequestMyListQuery,
): Promise<GiveawayRequestMyListResult> => {
  const params = new URLSearchParams();
  params.set("limit", String(query.limit));
  params.set("sort", query.sort);

  if (query.keyword) {
    params.set("keyword", query.keyword);
  }
  if (query.status !== undefined) {
    params.set("status", query.status);
  }
  if (query.cursor) {
    params.set("cursor", query.cursor);
  }

  return fetchInstance.getPaginated<MyGiveawayRequestItem[], CursorPagination>(
    `${API_ROUTES.GIVEAWAY_REQUESTS.ME}?${params.toString()}`,
  );
};

export const updateGiveawayRequest = (requestId: number, body: UpdateGiveawayRequestInput) =>
  fetchInstance.patch<GiveawayRequestItem, UpdateGiveawayRequestInput>(
    API_ROUTES.GIVEAWAY_REQUESTS.DETAIL(requestId),
    body,
  );

export const cancelGiveawayRequest = (requestId: number) =>
  fetchInstance.post<GiveawayRequestItem>(API_ROUTES.GIVEAWAY_REQUESTS.CANCEL(requestId));
