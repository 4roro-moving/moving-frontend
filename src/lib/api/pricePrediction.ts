import fetchInstance from "@/lib/api/fetchInstance";
import { API_ROUTES } from "@/lib/constants/apiRoutes";
import type {
  PricePredictionRequest,
  PricePredictionResponse,
  RouteDistanceRequest,
  RouteDistanceResponse,
} from "@/types/pricePrediction";

/**
 * AI 예상 견적 조회
 * BE: POST /api/price-predictions
 */
export async function fetchPricePrediction(
  body: PricePredictionRequest,
): Promise<PricePredictionResponse> {
  return fetchInstance.post<PricePredictionResponse, PricePredictionRequest>(
    API_ROUTES.PRICE_PREDICTIONS.ROOT,
    body,
    {
      skipAuth: true,
    },
  );
}

export async function fetchRouteDistance(
  body: RouteDistanceRequest,
): Promise<RouteDistanceResponse> {
  return fetchInstance.post<RouteDistanceResponse, RouteDistanceRequest>(
    API_ROUTES.PRICE_PREDICTIONS.DISTANCE,
    body,
    {
      skipAuth: true,
    },
  );
}
