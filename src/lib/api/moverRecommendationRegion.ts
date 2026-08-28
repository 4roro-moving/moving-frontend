import type { RegionId } from "@/lib/constants/region";

interface ResolveRecommendationRegionParams {
  latitude: number;
  longitude: number;
}

interface ResolveRecommendationRegionResponse {
  regionId: RegionId;
}

export async function resolveRecommendationRegion({
  latitude,
  longitude,
}: ResolveRecommendationRegionParams): Promise<RegionId> {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
  });
  const response = await fetch(`/api/mover-recommendations/region?${params.toString()}`);
  const payload = (await response.json()) as ResolveRecommendationRegionResponse & {
    message?: string;
  };

  if (!response.ok) {
    throw new Error(payload.message || "주소의 서비스 지역을 확인하지 못했습니다.");
  }

  return payload.regionId;
}
