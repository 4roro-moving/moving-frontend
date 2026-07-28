"use client";

import { useQuery } from "@tanstack/react-query";

import { getMoverDetail } from "@/lib/api/movers";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import { mapMoverDetailItemToMoverDetail } from "@/lib/utils/mapMover";

/** 백엔드 moverIdParamSchema(z.uuid)와 동일 기준 */
const MOVER_ID_UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isMoverDetailId(moverId: string): boolean {
  return MOVER_ID_UUID_PATTERN.test(moverId);
}

export function useMoverDetail(moverId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.MOVERS.DETAIL(moverId),
    queryFn: async () => {
      const item = await getMoverDetail(moverId);
      return mapMoverDetailItemToMoverDetail(item);
    },
    enabled: isMoverDetailId(moverId),
  });
}
