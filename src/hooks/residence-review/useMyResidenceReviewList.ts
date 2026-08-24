"use client";

import { useCallback, useState } from "react";

import { useMyResidenceReviews } from "@/hooks/residence-review/useMyResidenceReviews";
import { RESIDENCE_REVIEW_PAGE_LIMIT } from "@/lib/constants/residenceReview";

export const useMyResidenceReviewList = () => {
  const [page, setPage] = useState(1);
  const query = useMyResidenceReviews({
    page,
    limit: RESIDENCE_REVIEW_PAGE_LIMIT,
  });
  const reviews = query.data?.reviews ?? [];
  const pagination = query.data?.pagination;
  const totalCount = pagination?.totalCount ?? 0;
  const totalPages = Math.max(1, pagination?.totalPages ?? 1);
  const shouldCorrectPage =
    !query.isPlaceholderData && Boolean(pagination) && totalCount > 0 && page > totalPages;

  if (shouldCorrectPage) {
    setPage(totalPages);
  }

  const handlePageChange = useCallback((nextPage: number) => {
    setPage(nextPage);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  return {
    reviews,
    pagination,
    totalCount,
    totalPages,
    currentPage: Math.min(Math.max(1, page), totalPages),
    handlePageChange,
    setPage,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    isFetching: query.isFetching,
  };
};
