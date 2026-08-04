"use client";

import { useState } from "react";

import { Text } from "@/components/common/Text";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { ChevronLeftIcon, ChevronRightIcon } from "@/icons";
import { cn } from "@/lib/utils/cn";
import { MEDIA_QUERY } from "@/lib/constants/breakpoints";

import PaginationEllipsis from "./PaginationEllipsis";

type PageItem = { type: "page"; page: number } | { type: "ellipsis"; start: number; end: number };

export interface PaginationProps {
  /** 현재 페이지 (1부터 시작) */
  currentPage: number;
  /** 전체 페이지 수 */
  pageCount: number;
  /** 페이지 이동 시 실행할 콜백 */
  onPageChange: (page: number) => void;
  className?: string;
}

/** Figma pagination size=lg: 연속 숫자 5개 / size=sm: 3개 */
const RANGE_SIZE_LG = 5;
const RANGE_SIZE_SM = 3;

/**
 * 현재 페이지 주변 `rangeSize`개의 연속 숫자를 보여 주고,
 * 양끝과 떨어지면 `...`으로 접습니다.
 * - Desktop(Figma lg): 1 2 3 4 5 … 9
 * - Mobile/Tablet(Figma sm): 1 2 3 … 9
 */
const getPageItems = (currentPage: number, pageCount: number, rangeSize: number): PageItem[] => {
  if (pageCount <= 1) {
    return [{ type: "page", page: 1 }];
  }

  if (pageCount <= rangeSize + 2) {
    return Array.from({ length: pageCount }, (_, index) => ({
      type: "page" as const,
      page: index + 1,
    }));
  }

  let start: number;
  let end: number;

  if (currentPage <= Math.ceil(rangeSize / 2)) {
    start = 1;
    end = rangeSize;
  } else if (currentPage >= pageCount - Math.floor(rangeSize / 2)) {
    start = pageCount - rangeSize + 1;
    end = pageCount;
  } else {
    const radius = Math.floor((rangeSize - 1) / 2);
    start = currentPage - radius;
    end = currentPage + (rangeSize - 1 - radius);
  }

  // 경계와 창 사이 간격이 1이면 별도 페이지 대신 창을 경계까지 확장해 rangeSize 유지
  if (start === 2) {
    start = 1;
    end = rangeSize;
  }
  if (end === pageCount - 1) {
    end = pageCount;
    start = pageCount - rangeSize + 1;
  }

  const items: PageItem[] = [];

  if (start > 1) {
    items.push({ type: "page", page: 1 });
    if (start > 2) {
      items.push({ type: "ellipsis", start: 1, end: start });
    }
  }

  for (let page = start; page <= end; page += 1) {
    items.push({ type: "page", page });
  }

  if (end < pageCount) {
    if (end < pageCount - 1) {
      items.push({ type: "ellipsis", start: end, end: pageCount });
    }
    items.push({ type: "page", page: pageCount });
  }

  return items;
};

const Pagination = ({ currentPage, pageCount, onPageChange, className }: PaginationProps) => {
  const isLg = useMediaQuery(MEDIA_QUERY.xl);
  const [openEllipsisIndex, setOpenEllipsisIndex] = useState<number | null>(null);
  const containerRef = useClickOutside<HTMLDivElement>(() => setOpenEllipsisIndex(null));

  if (pageCount <= 0) {
    return null;
  }

  const rangeSize = isLg ? RANGE_SIZE_LG : RANGE_SIZE_SM;
  const isPrevDisabled = currentPage <= 1;
  const isNextDisabled = currentPage >= pageCount;
  const pageItems = getPageItems(currentPage, pageCount, rangeSize);

  const goToPage = (page: number) => {
    onPageChange(Math.min(Math.max(page, 1), pageCount));
  };

  const itemClassName = cn(
    "flex items-center justify-center p-10",
    isLg ? "size-48 rounded-8" : "size-34 rounded-6",
  );

  return (
    <nav aria-label="페이지네이션" className={className}>
      <div
        ref={containerRef}
        className={cn("flex items-center justify-center", isLg ? "gap-10" : "gap-8")}
      >
        <button
          type="button"
          className={cn(
            itemClassName,
            "text-text-secondary enabled:hover:bg-background-hover disabled:text-text-weak transition disabled:cursor-not-allowed",
          )}
          onClick={() => goToPage(currentPage - 1)}
          disabled={isPrevDisabled}
          aria-label="이전 페이지"
        >
          <ChevronLeftIcon className="size-24" />
        </button>

        <ul className="flex items-center gap-4">
          {pageItems.map((item, index) =>
            item.type === "ellipsis" ? (
              <li key={`ellipsis-${item.start}-${item.end}`} className="relative">
                <PaginationEllipsis
                  className={cn(itemClassName, "hover:bg-background-hover")}
                  isOpen={openEllipsisIndex === index}
                  index={index}
                  start={item.start}
                  end={item.end}
                  onOpenChange={setOpenEllipsisIndex}
                  onSelect={goToPage}
                />
              </li>
            ) : (
              <li key={item.page}>
                <button
                  type="button"
                  className={cn(
                    itemClassName,
                    item.page === currentPage
                      ? "text-text-secondary disabled:cursor-default"
                      : "text-text-weak enabled:hover:bg-background-hover cursor-pointer",
                  )}
                  onClick={() => goToPage(item.page)}
                  disabled={item.page === currentPage}
                  aria-label={`${item.page} 페이지`}
                  aria-current={item.page === currentPage ? "page" : undefined}
                >
                  <Text
                    variant={
                      item.page === currentPage
                        ? isLg
                          ? "2lg-semibold"
                          : "lg-semibold"
                        : isLg
                          ? "2lg-medium"
                          : "lg-regular"
                    }
                  >
                    {item.page}
                  </Text>
                </button>
              </li>
            ),
          )}
        </ul>

        <button
          type="button"
          className={cn(
            itemClassName,
            "text-text-secondary enabled:hover:bg-background-hover disabled:text-text-weak transition disabled:cursor-not-allowed",
          )}
          onClick={() => goToPage(currentPage + 1)}
          disabled={isNextDisabled}
          aria-label="다음 페이지"
        >
          <ChevronRightIcon className="size-24" />
        </button>
      </div>
    </nav>
  );
};

export default Pagination;
