import axiosInstance from "./axiosInstance";
import { API_ROUTES } from "../constants/apiRoutes";
import type {
  MoverEstimateRequestQuery,
  MoverEstimateRequestResponse,
} from "@/types/moverEstimateRequest";

export async function getMoverEstimateRequests(query: MoverEstimateRequestQuery) {
  const params = new URLSearchParams();

  params.set("limit", String(query.limit));
  params.set("sort", query.sort);

  if (query.keyword) params.set("keyword", query.keyword);
  if (query.isDesignated !== undefined) {
    params.set("isDesignated", String(query.isDesignated));
  }
  if (query.isServiceArea !== undefined) {
    params.set("isServiceArea", String(query.isServiceArea));
  }
  query.moveType?.forEach((moveType) => params.append("moveType", moveType));

  const mockUser = process.env.NEXT_PUBLIC_MOCK_USER_EMAIL;
  const response = await axiosInstance.get<MoverEstimateRequestResponse>(
    `/api${API_ROUTES.ESTIMATES}/requests?${params.toString()}`,
    {
      headers: mockUser ? { "x-mock-user": mockUser } : undefined,
    },
  );

  return response.data.data;
}
