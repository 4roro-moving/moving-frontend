"use client";

import { useMemo } from "react";

import { useAuthQueryScope } from "@/hooks/useAuthQueryScope";
import { useApiQuery } from "@/hooks/queries/useApiQuery";
import { getMovers } from "@/lib/api/movers";
import { mapMoverListItemToMover } from "@/lib/utils/mapMover";
import type { RegionId } from "@/lib/constants/region";
import type { MoveType } from "@/types/move";
import type { Mover } from "@/types/mover";

//추천 일치 유형
export type MoverRecommendationMatchType = "BOTH" | "DEPARTURE" | "DESTINATION";

//기본 기사 정보 + 추천 일치 유형
export interface MoverRecommendation extends Mover {
  matchType: MoverRecommendationMatchType;
}

//훅이 받는 검색 조건
interface UseMoverRecommendationsParams {
  departureRegionId: RegionId | null;
  destinationRegionId: RegionId | null;
  moveType?: MoveType; //전체 선택할 경우 전달되지 않음
}

//지역별 최대 조회 개수
const RECOMMENDATION_LIMIT = 50;

export function useMoverRecommendations({
  departureRegionId,
  destinationRegionId,
  moveType,
}: UseMoverRecommendationsParams) {
  //인증별 캐시 분리
  const { authScope, isAuthQueryReady } = useAuthQueryScope();
  //도착지, 출발지 지역 ID가 모두 있고, 인증 캐시 범위를 결정할 수 있음
  const hasSearchRegions = departureRegionId !== null && destinationRegionId !== null;
  const enabled = isAuthQueryReady && hasSearchRegions;
  //공통 요건 - 평점 높은 순 정렬, 최대 50명 조회, 이사 유형
  const commonQuery = {
    sort: "rating" as const,
    limit: RECOMMENDATION_LIMIT,
    ...(moveType ? { moveType } : {}),
  };

  //출발지 기사 조회 - 검색 조건이 같으면 React Query가 기존 캐시 재사용함
  const departureQuery = useApiQuery({
    queryKey: [
      "movers",
      "recommendations",
      authScope,
      { ...commonQuery, serviceArea: departureRegionId },
    ],
    queryFn: () => getMovers({ ...commonQuery, serviceArea: String(departureRegionId), page: 1 }),
    enabled,
  });

  //도착지 기사 조회 - serviceArea 도착지 지역 ID 사용 (위에 함수랑 병렬로 요청됨)
  const destinationQuery = useApiQuery({
    queryKey: [
      "movers",
      "recommendations",
      authScope,
      { ...commonQuery, serviceArea: destinationRegionId },
    ],
    queryFn: () => getMovers({ ...commonQuery, serviceArea: String(destinationRegionId), page: 1 }),
    enabled,
  });

  const movers = useMemo<MoverRecommendation[]>(() => {
    const merged = new Map<string, MoverRecommendation>();

    //출발지 API 결과 순회
    for (const item of departureQuery.data?.data ?? []) {
      merged.set(item.id, {
        ...mapMoverListItemToMover(item),
        matchType: "DEPARTURE",
      });
    }

    //도착지 결과에서 현재 기사 ID가 이미 있는지 확인
    for (const item of destinationQuery.data?.data ?? []) {
      const existing = merged.get(item.id);
      merged.set(item.id, {
        ...(existing ?? mapMoverListItemToMover(item)),
        matchType: existing ? "BOTH" : "DESTINATION",
      });
    }

    //기사 정렬
    const matchPriority: Record<MoverRecommendationMatchType, number> = {
      BOTH: 0,
      DEPARTURE: 1,
      DESTINATION: 2,
    };

    //지역 일치도 ( 같은 그룹 안에서는 평점이 높은 기사가 먼저 나옴)
    return [...merged.values()].sort(
      (a, b) => matchPriority[a.matchType] - matchPriority[b.matchType] || b.rating - a.rating,
    );
  }, [departureQuery.data, destinationQuery.data]);

  return {
    movers,
    isLoading:
      hasSearchRegions &&
      (!isAuthQueryReady || departureQuery.isPending || destinationQuery.isPending),
    isError: departureQuery.isError || destinationQuery.isError,
    refetch: async () => {
      await Promise.all([departureQuery.refetch(), destinationQuery.refetch()]);
    },
  };
}
