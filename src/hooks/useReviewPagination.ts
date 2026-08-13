"use client";

import { useState } from "react";

interface UseReviewPaginationOptions {
  totalPages: number;
  canCorrectPage?: boolean;
}

export function useReviewPagination({
  totalPages,
  canCorrectPage = true,
}: UseReviewPaginationOptions) {
  const [page, setPage] = useState(1);
  const safeTotalPages = Math.max(1, totalPages);

  if (canCorrectPage && page > safeTotalPages) {
    setPage(safeTotalPages);
  }

  const currentPage = Math.min(Math.max(1, page), safeTotalPages);

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
