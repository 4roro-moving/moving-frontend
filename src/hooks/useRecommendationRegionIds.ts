"use client";

import { useQuery } from "@tanstack/react-query";

import { resolveRecommendationRegion } from "@/lib/api/moverRecommendationRegion";
import type { AddressSearchItem } from "@/lib/kakao/addressSearch";

function useRecommendationRegionId(address: AddressSearchItem | null) {
  return useQuery({
    queryKey: [
      "mover-recommendations",
      "region",
      address?.latitude ?? null,
      address?.longitude ?? null,
    ],
    queryFn: () =>
      resolveRecommendationRegion({
        latitude: address!.latitude,
        longitude: address!.longitude,
      }),
    enabled: address !== null,
    staleTime: Infinity,
  });
}

export function useRecommendationRegionIds(
  departure: AddressSearchItem | null,
  destination: AddressSearchItem | null,
) {
  const departureQuery = useRecommendationRegionId(departure);
  const destinationQuery = useRecommendationRegionId(destination);

  return {
    departureRegionId: departureQuery.data ?? null,
    destinationRegionId: destinationQuery.data ?? null,
    isLoading:
      (departure !== null && departureQuery.isPending) ||
      (destination !== null && destinationQuery.isPending),
    isError: departureQuery.isError || destinationQuery.isError,
    refetch: async () => {
      await Promise.all([departureQuery.refetch(), destinationQuery.refetch()]);
    },
  };
}
