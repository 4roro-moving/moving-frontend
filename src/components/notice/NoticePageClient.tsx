"use client";

import AutoTranslatedText from "@/components/common/AutoTranslatedText";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { FormEvent, useState } from "react";

import Pagination from "@/components/common/Pagination/Pagination";
import { Text } from "@/components/common/Text";
import { useNotices } from "@/hooks/notice/useNotices";
import { cn } from "@/lib/utils/cn";
import type { NoticeCategory } from "@/types/notice";

type CategoryFilter = "ALL" | NoticeCategory;
const PAGE_SIZE = 10;
const CATEGORY_FILTERS: CategoryFilter[] = ["ALL", "SERVICE", "MAINTENANCE", "EVENT"];
const formatDate = (value: string) => value.slice(0, 10).replace(/-/g, ".");

const StateMessage = ({ children }: { children: string }) => (
  <div className="flex min-h-240 items-center justify-center">
    <Text as="p" variant="md-medium" className="text-text-muted">
      {children}
    </Text>
  </div>
);

const NoticePageClient = () => {
  const t = useTranslations("supportNotice");
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState<CategoryFilter>("ALL");
  const [keywordInput, setKeywordInput] = useState("");
  const [keyword, setKeyword] = useState("");

  const { data, isPending, isError, refetch } = useNotices({
    page,
    limit: PAGE_SIZE,
    ...(keyword ? { keyword } : {}),
    ...(category !== "ALL" ? { category } : {}),
  });

  const handleCategoryChange = (nextCategory: CategoryFilter) => {
    setCategory(nextCategory);
    setPage(1);
  };

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setKeyword(keywordInput.trim());
    setPage(1);
  };

  return (
    <main className="px-margin-mobile max-w-container-desktop mx-auto flex w-full flex-col gap-28 py-32 md:px-40 md:py-48">
      <header className="flex flex-col gap-8">
        <Text as="h1" variant={{ base: "2xl-bold", md: "3xl-bold" }} className="text-text-primary">
          {t("title")}
        </Text>
        <Text as="p" variant="lg-regular" className="text-text-secondary">
          {t("description")}
        </Text>
      </header>

      <nav aria-label={t("categoryLabel")} className="border-border-default border-b">
        <ul className="flex gap-4 overflow-x-auto">
          {CATEGORY_FILTERS.map((item) => {
            const isActive = item === category;
            const label = t(`categories.${item}`);

            return (
              <li key={item} className="shrink-0">
                <button
                  type="button"
                  onClick={() => handleCategoryChange(item)}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "focus-visible:ring-border-brand rounded-t-8 border-b-2 px-16 py-12 transition-colors focus-visible:ring-1 focus-visible:outline-none",
                    isActive
                      ? "border-border-brand text-text-brand"
                      : "text-text-secondary hover:text-text-primary border-transparent",
                  )}
                >
                  <Text as="span" variant={isActive ? "lg-bold" : "lg-regular"}>
                    {label}
                  </Text>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <form onSubmit={handleSearch} className="ml-auto flex w-full max-w-[420px] gap-8">
        <label htmlFor="notice-keyword" className="sr-only">
          {t("searchLabel")}
        </label>
        <input
          id="notice-keyword"
          type="search"
          value={keywordInput}
          onChange={(event) => setKeywordInput(event.target.value)}
          placeholder={t("searchPlaceholder")}
          className="border-border-default text-text-primary placeholder:text-text-muted rounded-8 focus:border-border-brand min-w-0 flex-1 border px-14 py-10 outline-none"
        />
        <button
          type="submit"
          className="bg-background-brand text-text-inverse rounded-8 shrink-0 px-18 py-10"
        >
          <Text as="span" variant="md-semibold">
            {t("search")}
          </Text>
        </button>
      </form>

      {isPending ? (
        <StateMessage>{t("loading")}</StateMessage>
      ) : isError ? (
        <div className="flex min-h-240 flex-col items-center justify-center gap-12">
          <Text as="p" variant="md-medium" className="text-text-muted">
            {t("loadFailed")}
          </Text>
          <button
            type="button"
            onClick={() => void refetch()}
            className="border-border-brand text-text-brand rounded-8 border px-16 py-8"
          >
            {t("retry")}
          </button>
        </div>
      ) : !data || data.notices.length === 0 ? (
        <StateMessage>{t("empty")}</StateMessage>
      ) : (
        <>
          <ul className="border-border-default border-t">
            {data.notices.map((notice) => (
              <li key={notice.id} className="border-border-default border-b">
                <Link
                  href={`/notices/${notice.id}`}
                  className="hover:bg-background-subtle focus-visible:ring-border-brand flex w-full flex-col gap-8 px-8 py-20 transition-colors focus-visible:ring-1 focus-visible:outline-none md:flex-row md:items-center md:px-16"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-10">
                    {notice.isPinned && (
                      <span className="bg-background-brand-subtle text-text-brand rounded-6 shrink-0 px-8 py-4">
                        <Text as="span" variant="sm-semibold">
                          {t("pinned")}
                        </Text>
                      </span>
                    )}
                    <span className="border-border-default text-text-secondary rounded-6 shrink-0 border px-8 py-4">
                      <Text as="span" variant="sm-medium">
                        {t(`categories.${notice.category}`)}
                      </Text>
                    </span>
                    <Text
                      as="span"
                      variant={{ base: "md-medium", md: "lg-medium" }}
                      className="text-text-primary truncate"
                    >
                      <AutoTranslatedText text={notice.title} />
                    </Text>
                  </div>

                  <div className="text-text-muted flex shrink-0 items-center gap-16">
                    <Text as="span" variant="xs-regular">
                      {t("views", { count: notice.viewCount.toLocaleString() })}
                    </Text>
                    <Text as="time" variant="xs-regular">
                      {formatDate(notice.createdAt)}
                    </Text>
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          {data.pagination.totalPages > 1 && (
            <Pagination
              currentPage={page}
              pageCount={data.pagination.totalPages}
              onPageChange={(nextPage) => {
                setPage(nextPage);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="mt-32"
            />
          )}
        </>
      )}
    </main>
  );
};

export default NoticePageClient;
