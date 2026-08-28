"use client";

import { useTranslations } from "next-intl";

import { Text } from "@/components/common/Text";
import { ChevronLeftIcon, ChevronRightIcon } from "@/icons";
import { cn } from "@/lib/utils/cn";

const pageButtonClassName =
  "flex size-32 items-center justify-center rounded-6 border border-border-dimmed bg-background-surface transition disabled:cursor-not-allowed";

const VISIBLE_PAGE_COUNT = 5;

interface NotificationPaginationProps {
  pageCount: number;
  currentPage: number;
  isFetching: boolean;
  onChangePage: (page: number) => void;
}

function getVisiblePages(currentPage: number, pageCount: number): number[] {
  const windowStart = Math.floor((currentPage - 1) / VISIBLE_PAGE_COUNT) * VISIBLE_PAGE_COUNT + 1;
  const windowEnd = Math.min(windowStart + VISIBLE_PAGE_COUNT - 1, pageCount);

  return Array.from({ length: windowEnd - windowStart + 1 }, (_, index) => windowStart + index);
}

export default function NotificationPagination({
  pageCount,
  currentPage,
  isFetching,
  onChangePage,
}: NotificationPaginationProps) {
  const t = useTranslations("notifications");
  const isPrevDisabled = currentPage <= 1 || isFetching;
  const isNextDisabled = currentPage >= pageCount || isFetching;
  const visiblePages = getVisiblePages(currentPage, pageCount);

  return (
    <nav aria-label={t("paginationAria")} className="flex w-full items-center justify-center py-12">
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
            aria-label={t("previousPage")}
          >
            <ChevronLeftIcon className="size-16" />
          </button>
        </li>

        {visiblePages.map((page) => {
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
                aria-label={t("pageAria", { page })}
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
            aria-label={t("nextPage")}
          >
            <ChevronRightIcon className="size-16" />
          </button>
        </li>
      </ul>
    </nav>
  );
}
