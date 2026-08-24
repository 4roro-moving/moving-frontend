"use client";

import Link from "next/link";
import { useState } from "react";

import Pagination from "@/components/common/Pagination/Pagination";
import { Text } from "@/components/common/Text";
import InquiryCreateModal from "@/components/inquiry/InquiryCreateModal";
import { useInquiries } from "@/hooks/inquiry/useInquiries";
import { hasSuspensionAppealSession } from "@/lib/auth/suspensionAppealSession";
import { APP_ROUTES } from "@/lib/constants/appRoutes";
import { cn } from "@/lib/utils/cn";
import type { InquiryCategory, InquiryStatus } from "@/types/inquiry";

type StatusFilter = "ALL" | InquiryStatus;

const PAGE_SIZE = 10;

const STATUS_FILTERS: {
  label: string;
  value: StatusFilter;
}[] = [
  {
    label: "전체",
    value: "ALL",
  },
  {
    label: "답변 대기",
    value: "OPEN",
  },
  {
    label: "답변 완료",
    value: "ANSWERED",
  },
  {
    label: "종료",
    value: "CLOSED",
  },
];

const STATUS_LABEL: Record<InquiryStatus, string> = {
  OPEN: "답변 대기",
  ANSWERED: "답변 완료",
  CLOSED: "종료",
};

const CATEGORY_LABEL: Record<InquiryCategory, string> = {
  SUSPENSION_APPEAL: "정지 이의신청",
  ACCOUNT: "계정",
  SERVICE: "서비스 이용",
  ETC: "기타",
};

const formatDate = (value: string) => value.slice(0, 10).replace(/-/g, ".");

const InquiryPageClient = () => {
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
              1:1 문의
            </Text>

            <Text as="p" variant="lg-regular" className="text-text-secondary">
              {isSuspensionAppealAccess
                ? "기존 문의 내역과 답변을 확인하고 정지 이의를 제기할 수 있습니다."
                : "문의 내역과 답변 상태를 확인할 수 있습니다."}
            </Text>
          </div>

          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-background-brand text-text-inverse rounded-8 shrink-0 px-18 py-10"
          >
            <Text as="span" variant="md-semibold">
              문의하기
            </Text>
          </button>
        </header>

        <section className="flex flex-col gap-24">
          {/* status filter */}
          <nav aria-label="문의 상태" className="border-border-default border-b">
            <ul className="flex gap-4 overflow-x-auto">
              {STATUS_FILTERS.map((filter) => {
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
                문의 내역을 불러오는 중이에요
              </Text>
            </div>
          ) : isError ? (
            /* error */
            <div className="flex min-h-[240px] flex-col items-center justify-center gap-12">
              <Text as="p" variant="md-medium" className="text-text-muted">
                문의 내역을 불러오지 못했어요
              </Text>

              <button
                type="button"
                onClick={() => void refetch()}
                className="border-border-brand text-text-brand rounded-8 border px-16 py-8"
              >
                <Text as="span" variant="md-medium">
                  다시 불러오기
                </Text>
              </button>
            </div>
          ) : !data || data.inquiries.length === 0 ? (
            /* empty */
            <div className="flex min-h-[240px] flex-col items-center justify-center gap-16">
              <Text as="p" variant="md-medium" className="text-text-muted">
                {status === "ALL" ? "아직 등록한 문의가 없습니다" : "해당 상태의 문의가 없습니다"}
              </Text>

              {status === "ALL" && (
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(true)}
                  className="text-text-brand"
                >
                  <Text as="span" variant="md-semibold">
                    첫 문의 작성하기
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
                              {CATEGORY_LABEL[inquiry.category]}
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
                              {STATUS_LABEL[inquiry.status]}
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
                          {inquiry.title}
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
