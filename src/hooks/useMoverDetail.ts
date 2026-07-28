"use client";

import { useQuery } from "@tanstack/react-query";

import { getMoverDetail } from "@/lib/api/movers";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import { isMoverDetailId } from "@/lib/utils/isMoverDetailId";
import { mapMoverDetailItemToMoverDetail } from "@/lib/utils/mapMover";

export { isMoverDetailId };

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
