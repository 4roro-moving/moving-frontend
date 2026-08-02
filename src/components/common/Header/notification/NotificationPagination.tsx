"use client";

import { Text } from "@/components/common/Text";
import { ChevronLeftIcon, ChevronRightIcon } from "@/icons";
import { cn } from "@/lib/utils/cn";

const pageButtonClassName =
  "flex size-32 items-center justify-center rounded-6 border border-border-dimmed bg-background-surface transition disabled:cursor-not-allowed";

interface NotificationPaginationProps {
  pageCount: number;
  currentPage: number;
  isFetching: boolean;
  onChangePage: (page: number) => void;
}

export default function NotificationPagination({
  pageCount,
  currentPage,
  isFetching,
  onChangePage,
}: NotificationPaginationProps) {
  const isPrevDisabled = currentPage <= 1 || isFetching;
  const isNextDisabled = currentPage >= pageCount || isFetching;

  return (
    <nav aria-label="알림 페이지네이션" className="flex w-full items-center justify-center py-12">
      <ul className="flex items-center gap-4">
        <li>
          <button
            type="button"
            className={cn(
              pageButtonClassName,
              "text-text-secondary hover:bg-background-hover disabled:text-text-weak disabled:hover:bg-transparent",
            )}
            onClick={() => onChangePage(currentPage - 1)}
            disabled={isPrevDisabled}
            aria-label="이전 페이지"
          >
            <ChevronLeftIcon className="size-16" />
          </button>
        </li>

        {Array.from({ length: pageCount }, (_, index) => {
          const page = index + 1;
          const isCurrent = page === currentPage;

          return (
            <li key={page}>
              <button
                type="button"
                className={cn(
                  pageButtonClassName,
                  isCurrent
                    ? "text-text-secondary"
                    : "text-text-weak hover:bg-background-hover cursor-pointer",
                )}
                onClick={() => onChangePage(page)}
                disabled={isCurrent || isFetching}
                aria-label={`${page} 페이지`}
                aria-current={isCurrent ? "page" : undefined}
              >
                <Text variant="md-regular">{page}</Text>
              </button>
            </li>
          );
        })}

        <li>
          <button
            type="button"
            className={cn(
              pageButtonClassName,
              "text-text-secondary hover:bg-background-hover disabled:text-text-weak disabled:hover:bg-transparent",
            )}
            onClick={() => onChangePage(currentPage + 1)}
            disabled={isNextDisabled}
            aria-label="다음 페이지"
          >
            <ChevronRightIcon className="size-16" />
          </button>
        </li>
      </ul>
    </nav>
  );
}
