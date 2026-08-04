"use client";

import { keepPreviousData } from "@tanstack/react-query";

import { useApiQuery } from "@/hooks/queries/useApiQuery";
import { useAdminAuthReady } from "@/hooks/useAdminAuthReady";
import { ADMIN_REVIEW_LIST_PAGE_LIMIT, fetchAdminReviews } from "@/lib/api/adminReviews";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import type { AdminReviewListQuery } from "@/types/adminReview";

export function useAdminReviews(query: AdminReviewListQuery = {}) {
  const page = query.page ?? 1;
  const limit = query.limit ?? ADMIN_REVIEW_LIST_PAGE_LIMIT;
  const keyword = query.keyword?.trim() ?? "";
  const sort = query.sort ?? "LATEST";
  const { canFetch } = useAdminAuthReady();

  return useApiQuery({
    queryKey: QUERY_KEYS.ADMIN.REVIEWS_LIST(page, limit, keyword, sort),
    queryFn: () =>
      fetchAdminReviews({
        ...query,
        page,
        limit,
        keyword: keyword || undefined,
        sort,
      }),
    placeholderData: keepPreviousData,
    enabled: canFetch,
  });
}
