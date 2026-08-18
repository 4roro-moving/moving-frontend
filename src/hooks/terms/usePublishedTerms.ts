"use client";

import { useQuery } from "@tanstack/react-query";

import { getPublishedTerms } from "@/lib/api/terms";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";

/** 약관은 거의 바뀌지 않아 staleTime을 길게 둡니다. */
const TERMS_STALE_TIME_MS = 60 * 60 * 1000;

export const usePublishedTerms = () =>
  useQuery({
    queryKey: QUERY_KEYS.TERMS.PUBLISHED_LIST,
    queryFn: getPublishedTerms,
    staleTime: TERMS_STALE_TIME_MS,
  });
