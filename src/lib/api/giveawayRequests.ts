import fetchInstance from "@/lib/api/fetchInstance";
import { API_ROUTES } from "@/lib/constants/apiRoutes";
import type { CursorPagination } from "@/types/pagination";
import type {
  GiveawayRequestItem,
  GiveawayRequestMyListQuery,
  GiveawayRequestMyListResult,
  MyGiveawayRequestItem,
  UpdateGiveawayRequestInput,
} from "@/types/giveaway";

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
