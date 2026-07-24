import type {
  MoverEstimateRequestQuery,
  MoverEstimateRequestResponse,
} from "@/types/moverEstimateRequest";

import { API_ROUTES } from "../constants/apiRoutes";
import axiosInstance from "./axiosInstance";

export async function getMoverEstimateRequests(query: MoverEstimateRequestQuery) {
  const params = new URLSearchParams();

  params.set("limit", String(query.limit));
  params.set("sort", query.sort);

  if (query.cursor) params.set("cursor", query.cursor);
  if (query.keyword) params.set("keyword", query.keyword);
  if (query.isDesignated !== undefined) {
    params.set("isDesignated", String(query.isDesignated));
  }
  if (query.isServiceArea !== undefined) {
    params.set("isServiceArea", String(query.isServiceArea));
  }
  query.moveType?.forEach((moveType) => params.append("moveType", moveType));

  const accessToken =
    typeof window === "undefined" ? null : window.localStorage.getItem("accessToken");

  const response = await axiosInstance.get<MoverEstimateRequestResponse>(
    `/api${API_ROUTES.ESTIMATES}/requests?${params.toString()}`,
    {
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
    },
  );

  if (!response.data.success) {
    throw new Error(response.data.error.code);
  }

  return response.data.data;
}
