"use client";

import { useState } from "react";

interface UseReviewPaginationOptions {
  totalPages?: number;
  canCorrectPage?: boolean;
}

export function useReviewPagination({
  totalPages,
  canCorrectPage = true,
}: UseReviewPaginationOptions = {}) {
  const [page, setPage] = useState(1);
  const hasKnownTotalPages = typeof totalPages === "number" && Number.isFinite(totalPages);
  const safeTotalPages = hasKnownTotalPages ? Math.max(1, totalPages) : undefined;

  if (canCorrectPage && safeTotalPages !== undefined && page > safeTotalPages) {
    setPage(safeTotalPages);
  }

  const currentPage =
    safeTotalPages === undefined ? Math.max(1, page) : Math.min(Math.max(1, page), safeTotalPages);

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return {
    page,
    currentPage,
    setPage,
    handlePageChange,
  };
}
