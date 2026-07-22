"use client";

import Image from "next/image";
import { useState } from "react";

import { Text } from "@/components/common/Text";
import { useClickOutside } from "@/hooks/useClickOutside";
import { cn } from "@/lib/utils/cn";

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

// 항상 [첫 페이지, 현재-1, 현재, 현재+1, 마지막 페이지] 또는
// 경계일 땐 [1,2,3 ... n-2,n-1,n] 형태로 최대 5~6개의 숫자만 보여주고 나머지는 "..."으로 접습니다.
const WINDOW_RADIUS = 1;
const BOUNDARY_COUNT = 3;

const getPageItems = (currentPage: number, pageCount: number): PageItem[] => {
  if (pageCount <= 1) return [{ type: "page", page: 1 }];

  const firstPage = 1;
  const lastPage = pageCount;
  const prevPage = Math.max(currentPage - WINDOW_RADIUS, firstPage);
  const nextPage = Math.min(currentPage + WINDOW_RADIUS, lastPage);

  const pageSet = new Set<number>();

  if (currentPage === firstPage || currentPage === lastPage) {
    for (let i = firstPage; i <= Math.min(firstPage + BOUNDARY_COUNT - 1, lastPage); i++) {
      pageSet.add(i);
    }
    for (let i = Math.max(lastPage - BOUNDARY_COUNT + 1, firstPage); i <= lastPage; i++) {
      pageSet.add(i);
    }
  } else {
    [firstPage, prevPage, currentPage, nextPage, lastPage].forEach((page) => pageSet.add(page));
  }

  const sortedPages = Array.from(pageSet).sort((a, b) => a - b);

  return sortedPages.reduce<PageItem[]>((items, page, index) => {
    const prev = sortedPages[index - 1];
    if (index > 0 && prev !== undefined && page - prev > 1) {
      items.push({ type: "ellipsis", start: prev, end: page });
    }
    items.push({ type: "page", page });
    return items;
  }, []);
};

const pageButtonStyle =
  "flex size-[50px] items-center justify-center rounded-4 bg-color-background-surface rounded-lg";

const Pagination = ({ currentPage, pageCount, onPageChange, className }: PaginationProps) => {
  const [openEllipsisIndex, setOpenEllipsisIndex] = useState<number | null>(null);
  const containerRef = useClickOutside<HTMLUListElement>(() => setOpenEllipsisIndex(null));

  if (pageCount <= 0) return null;

  const isPrevDisabled = currentPage <= 1;
  const isNextDisabled = currentPage >= pageCount;
  const pageItems = getPageItems(currentPage, pageCount);

  const goToPage = (page: number) => {
    onPageChange(Math.min(Math.max(page, 1), pageCount));
  };

  return (
    <nav aria-label="페이지네이션" className={className}>
      <ul ref={containerRef} className="flex items-center justify-center gap-20">
        <li>
          <button
            type="button"
            className={cn(
              pageButtonStyle,
              "text-text-primary hover:bg-background-hover transition disabled:cursor-not-allowed disabled:grayscale disabled:hover:bg-transparent",
            )}
            onClick={() => goToPage(currentPage - 1)}
            disabled={isPrevDisabled}
            aria-label="이전 페이지"
          >
            <Image src="/icons/ic_left.svg" alt="" width={24} height={24} aria-hidden />
          </button>
        </li>

        {pageItems.map((item, index) =>
          item.type === "ellipsis" ? (
            <li key={`ellipsis-${item.start}-${item.end}`} className="relative">
              <span className={cn(pageButtonStyle, "text-text-primary hover:bg-background-hover")}>
                <PaginationEllipsis
                  isOpen={openEllipsisIndex === index}
                  index={index}
                  start={item.start}
                  end={item.end}
                  onOpenChange={setOpenEllipsisIndex}
                  onSelect={goToPage}
                />
              </span>
            </li>
          ) : (
            <li key={item.page} aria-current={item.page === currentPage ? "page" : undefined}>
              <button
                type="button"
                className={cn(
                  pageButtonStyle,
                  item.page === currentPage
                    ? "border-border-brand text-text-primary border"
                    : "text-text-primary hover:bg-background-hover cursor-pointer",
                )}
                onClick={() => goToPage(item.page)}
                disabled={item.page === currentPage}
                aria-label={`${item.page} 페이지`}
              >
                <Text variant="md-regular">{item.page}</Text>
              </button>
            </li>
          ),
        )}

        <li>
          <button
            type="button"
            className={cn(
              pageButtonStyle,
              "text-text-primary hover:bg-background-hover transition disabled:cursor-not-allowed disabled:grayscale disabled:hover:bg-transparent",
            )}
            onClick={() => goToPage(currentPage + 1)}
            disabled={isNextDisabled}
            aria-label="다음 페이지"
          >
            <Image src="/icons/ic_right.svg" alt="" width={24} height={24} aria-hidden />
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
