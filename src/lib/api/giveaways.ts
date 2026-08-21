import fetchInstance from "@/lib/api/fetchInstance";
import { API_ROUTES } from "@/lib/constants/apiRoutes";
import type { CursorPagination } from "@/types/pagination";
import type {
  GiveawayListItem,
  GiveawayListQuery,
  GiveawayListResult,
  GiveawayMyListQuery,
} from "@/types/giveaway";

export const fetchGiveaways = async (query: GiveawayListQuery): Promise<GiveawayListResult> => {
  const params = new URLSearchParams();
  params.set("limit", String(query.limit));
  params.set("sort", query.sort);

  if (query.keyword) {
    params.set("keyword", query.keyword);
  }
  if (query.regionId !== undefined) {
    params.set("regionId", String(query.regionId));
  }
  if (query.status !== undefined) {
    params.set("status", query.status);
  }
  if (query.cursor) {
    params.set("cursor", query.cursor);
  }

  return fetchInstance.getPaginated<GiveawayListItem[], CursorPagination>(
    `${API_ROUTES.GIVEAWAYS.ROOT}?${params.toString()}`,
  );
};

export const fetchMyGiveaways = async (query: GiveawayMyListQuery): Promise<GiveawayListResult> => {
  const params = new URLSearchParams();
  params.set("limit", String(query.limit));
  params.set("sort", query.sort);

  if (query.status !== undefined) {
    params.set("status", query.status);
  }
  if (query.cursor) {
    params.set("cursor", query.cursor);
  }

  return fetchInstance.getPaginated<GiveawayListItem[], CursorPagination>(
    `${API_ROUTES.GIVEAWAYS.ME}?${params.toString()}`,
  );
};
