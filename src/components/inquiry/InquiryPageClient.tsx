"use client";

import AutoTranslatedText from "@/components/common/AutoTranslatedText";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

import Pagination from "@/components/common/Pagination/Pagination";
import { Text } from "@/components/common/Text";
import InquiryCreateModal from "@/components/inquiry/InquiryCreateModal";
import { useInquiries } from "@/hooks/inquiry/useInquiries";
import { hasSuspensionAppealSession } from "@/lib/auth/suspensionAppealSession";
import { APP_ROUTES } from "@/lib/constants/appRoutes";
import { cn } from "@/lib/utils/cn";
import type { InquiryStatus } from "@/types/inquiry";

type StatusFilter = "ALL" | InquiryStatus;

const PAGE_SIZE = 10;

const InquiryPageClient = () => {
  const t = useTranslations("supportInquiry");
  const locale = useLocale();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<StatusFilter>("ALL");

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const isSuspensionAppealAccess = hasSuspensionAppealSession();

  const { data, isPending, isError, refetch } = useInquiries({
    page,
    limit: PAGE_SIZE,
    ...(status !== "ALL" ? { status } : {}),
  });

  const handleStatusChange = (nextStatus: StatusFilter) => {
    setStatus(nextStatus);
    setPage(1);
  };

  const statusFilters: { label: string; value: StatusFilter }[] = [
    { label: t("statuses.ALL"), value: "ALL" },
    { label: t("statuses.OPEN"), value: "OPEN" },
    { label: t("statuses.ANSWERED"), value: "ANSWERED" },
    { label: t("statuses.CLOSED"), value: "CLOSED" },
  ];

  const formatDate = (value: string) =>
    new Intl.DateTimeFormat(locale, { year: "numeric", month: "2-digit", day: "2-digit" }).format(
      new Date(value),
    );

  return (
    <>
      <main className="px-margin-mobile max-w-container-desktop mx-auto flex w-full flex-col gap-28 py-32 md:px-40 md:py-48">
        {/* header */}
        <header className="flex items-end justify-between gap-16">
          <div className="flex flex-col gap-8">
            <Text
              as="h1"
              variant={{
                base: "2xl-bold",
                md: "3xl-bold",
              }}
              className="text-text-primary"
            >
              {t("title")}
            </Text>

            <Text as="p" variant="lg-regular" className="text-text-secondary">
              {isSuspensionAppealAccess ? t("suspensionAppealDescription") : t("description")}
            </Text>
          </div>

          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-background-brand text-text-inverse rounded-8 shrink-0 px-18 py-10"
          >
            <Text as="span" variant="md-semibold">
              {t("create")}
            </Text>
          </button>
        </header>

        <section className="flex flex-col gap-24">
          {/* status filter */}
          <nav aria-label={t("statusFilterLabel")} className="border-border-default border-b">
            <ul className="flex gap-4 overflow-x-auto">
              {statusFilters.map((filter) => {
                const isActive = status === filter.value;

                return (
                  <li key={filter.value} className="shrink-0">
                    <button
                      type="button"
                      onClick={() => handleStatusChange(filter.value)}
                      aria-pressed={isActive}
                      className={cn(
                        "border-b-2 px-16 py-12 transition-colors",
                        isActive
                          ? "border-border-brand text-text-brand"
                          : "text-text-secondary border-transparent",
                      )}
                    >
                      <Text as="span" variant={isActive ? "lg-bold" : "lg-regular"}>
                        {filter.label}
                      </Text>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* loading */}
          {isPending ? (
            <div className="flex min-h-[240px] items-center justify-center">
              <Text as="p" variant="md-medium" className="text-text-muted">
                {t("loading")}
              </Text>
            </div>
          ) : isError ? (
            /* error */
            <div className="flex min-h-[240px] flex-col items-center justify-center gap-12">
              <Text as="p" variant="md-medium" className="text-text-muted">
                {t("loadFailed")}
              </Text>

              <button
                type="button"
                onClick={() => void refetch()}
                className="border-border-brand text-text-brand rounded-8 border px-16 py-8"
              >
                <Text as="span" variant="md-medium">
                  {t("retry")}
                </Text>
              </button>
            </div>
          ) : !data || data.inquiries.length === 0 ? (
            /* empty */
            <div className="flex min-h-[240px] flex-col items-center justify-center gap-16">
              <Text as="p" variant="md-medium" className="text-text-muted">
                {status === "ALL" ? t("empty") : t("emptyByStatus")}
              </Text>

              {status === "ALL" && (
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(true)}
                  className="text-text-brand"
                >
                  <Text as="span" variant="md-semibold">
                    {t("createFirst")}
                  </Text>
                </button>
              )}
            </div>
          ) : (
            <>
              {/* list */}
              <ul className="border-border-default border-t">
                {data.inquiries.map((inquiry) => (
                  <li key={inquiry.id} className="border-border-default border-b">
                    <Link
                      href={APP_ROUTES.INQUIRIES.DETAIL(inquiry.id)}
                      className="hover:bg-background-subtle flex flex-col gap-10 px-8 py-20 transition-colors md:flex-row md:items-center md:px-16"
                    >
                      <div className="flex min-w-0 flex-1 flex-col gap-8">
                        <div className="flex flex-wrap items-center gap-8">
                          <span className="border-border-default text-text-secondary rounded-6 border px-8 py-4">
                            <Text as="span" variant="xs-medium">
                              {t(`categories.${inquiry.category}`)}
                            </Text>
                          </span>

                          <span
                            className={cn(
                              "rounded-6 px-8 py-4",
                              inquiry.status === "OPEN" &&
                                "bg-background-subtle text-text-secondary",
                              inquiry.status === "ANSWERED" &&
                                "bg-background-brand-subtle text-text-brand",
                              inquiry.status === "CLOSED" && "bg-background-subtle text-text-muted",
                            )}
                          >
                            <Text as="span" variant="xs-medium">
                              {t(`statuses.${inquiry.status}`)}
                            </Text>
                          </span>
                        </div>

                        <Text
                          as="span"
                          variant={{
                            base: "md-medium",
                            md: "lg-medium",
                          }}
                          className="text-text-primary truncate"
                        >
                          <AutoTranslatedText text={inquiry.title} />
                        </Text>
                      </div>

                      <Text as="time" variant="xs-regular" className="text-text-muted shrink-0">
                        {formatDate(inquiry.createdAt)}
                      </Text>
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

                    window.scrollTo({
                      top: 0,
                      behavior: "smooth",
                    });
                  }}
                  className="mt-8"
                />
              )}
            </>
          )}
        </section>
      </main>

      <InquiryCreateModal
        isOpen={isCreateModalOpen}
        isSuspensionAppealAccess={isSuspensionAppealAccess}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </>
  );
};

export default InquiryPageClient;
