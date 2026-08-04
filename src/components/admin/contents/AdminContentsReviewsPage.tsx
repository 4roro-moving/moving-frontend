"use client";

import { useMemo, useState } from "react";

import Button from "@/components/common/Button/Button";
import Textarea from "@/components/common/Input/Textarea";
import Modal from "@/components/common/Modal";
import Pagination from "@/components/common/Pagination/Pagination";
import Search from "@/components/common/Search/Search";
import Select from "@/components/common/Select/Select";
import { Text } from "@/components/common/Text";
import { useHideAdminReview } from "@/hooks/useHideAdminReview";
import { useAdminReviews } from "@/hooks/useAdminReviews";
import { useUnhideAdminReview } from "@/hooks/useUnhideAdminReview";
import { ADMIN_REVIEW_LIST_PAGE_LIMIT } from "@/lib/api/adminReviews";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { cn } from "@/lib/utils/cn";
import type { AdminReviewItem, AdminReviewSort } from "@/types/adminReview";

const SORT_OPTIONS: Array<{ value: AdminReviewSort; label: string }> = [
  { value: "LATEST", label: "최신순" },
  { value: "OLDEST", label: "오래된순" },
  { value: "RATING_HIGH", label: "별점 높은순" },
  { value: "RATING_LOW", label: "별점 낮은순" },
];

type ReasonActionMode = "hide" | "unhide";

interface ReasonModalState {
  mode: ReasonActionMode;
  review: AdminReviewItem;
}

function formatReviewDate(createdAt: string): string {
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const formatter = new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "Asia/Seoul",
  });

  return formatter.format(date).replace(/\./g, ".").replace(/\s/g, "");
}

function renderStars(rating: number): string {
  const clamped = Math.max(0, Math.min(5, Math.round(rating)));
  return `${"★".repeat(clamped)}${"☆".repeat(5 - clamped)}`;
}

function getSortLabel(sort: AdminReviewSort): string {
  return SORT_OPTIONS.find((option) => option.value === sort)?.label ?? "최신순";
}

export default function AdminContentsReviewsPage() {
  const [page, setPage] = useState(1);
  const [keywordInput, setKeywordInput] = useState("");
  const [keyword, setKeyword] = useState("");
  const [sort, setSort] = useState<AdminReviewSort>("LATEST");
  const [reasonModal, setReasonModal] = useState<ReasonModalState | null>(null);
  const [reasonInput, setReasonInput] = useState("");

  const listQuery = useMemo(
    () => ({
      page,
      limit: ADMIN_REVIEW_LIST_PAGE_LIMIT,
      sort,
      keyword: keyword || undefined,
    }),
    [keyword, page, sort],
  );

  const { data, isLoading, isFetching, isError, error, refetch } = useAdminReviews(listQuery);
  const hideMutation = useHideAdminReview();
  const unhideMutation = useUnhideAdminReview();

  const items = data?.items ?? [];
  const pagination = data?.pagination;
  const totalPages = Math.max(1, pagination?.totalPages ?? 1);

  const handleSubmitSearch = () => {
    setKeyword(keywordInput.trim());
    setPage(1);
  };

  const handleSortChange = (value: string) => {
    const option = SORT_OPTIONS.find((entry) => entry.value === value);
    setSort(option?.value ?? "LATEST");
    setPage(1);
  };

  const activeMutation = reasonModal?.mode === "hide" ? hideMutation : unhideMutation;
  const isActionPending = hideMutation.isPending || unhideMutation.isPending;

  const openReasonModal = (mode: ReasonActionMode, review: AdminReviewItem) => {
    setReasonModal({ mode, review });
    setReasonInput(mode === "hide" ? "" : (review.latestModeration?.reason ?? ""));
  };

  const closeReasonModal = () => {
    if (isActionPending) {
      return;
    }
    setReasonModal(null);
    setReasonInput("");
  };

  const handleConfirmAction = async () => {
    if (!reasonModal) return;

    const trimmedReason = reasonInput.trim();
    if (reasonModal.mode === "hide" && trimmedReason.length === 0) {
      return;
    }

    if (reasonModal.mode === "hide") {
      await hideMutation.mutateAsync({ reviewId: reasonModal.review.id, reason: trimmedReason });
    } else {
      await unhideMutation.mutateAsync({
        reviewId: reasonModal.review.id,
        reason: trimmedReason || undefined,
      });
    }

    closeReasonModal();
  };

  return (
    <div className="bg-background-default flex min-h-screen w-full items-start">
      <aside className="bg-background-surface border-border-subtle hidden w-[240px] shrink-0 border-r px-20 py-32 lg:block">
        <Text variant="sm-semibold" className="text-text-muted">
          콘텐츠 유형
        </Text>
        <div className="rounded-12 bg-background-brand-muted mt-8 px-16 py-11">
          <Text variant="lg-semibold" className="text-text-brand">
            리뷰
          </Text>
        </div>
        <div className="mt-8 px-16 py-11">
          <Text variant="lg-medium" className="text-text-primary">
            거주 후기
          </Text>
        </div>
        <div className="mt-8 px-16 py-11">
          <Text variant="lg-medium" className="text-text-primary">
            나눔 게시글
          </Text>
        </div>
      </aside>

      <section className="flex min-h-screen flex-1 flex-col gap-20 px-20 py-24 lg:px-40 lg:py-36">
        <header className="flex flex-col gap-6">
          <Text as="h1" variant="2xl-bold" className="text-text-primary">
            리뷰 관리
          </Text>
          <Text variant="md-regular" className="text-text-muted">
            작성자·키워드 검색, 정렬, 숨김/복구 및 처리 사유 기록을 관리합니다.
          </Text>
        </header>

        <div className="flex flex-col gap-12 lg:flex-row lg:items-center lg:justify-between">
          <form
            className="w-full lg:max-w-[440px]"
            onSubmit={(event) => {
              event.preventDefault();
              handleSubmitSearch();
            }}
          >
            <Search
              size="md"
              placeholder="작성자 또는 키워드 검색"
              value={keywordInput}
              onChange={(event) => setKeywordInput(event.target.value)}
              className="w-full"
            />
          </form>

          <Select
            key={sort}
            desc={getSortLabel(sort)}
            label="정렬"
            defaultValue={sort}
            variant="default"
            className="w-fit"
            onChange={handleSortChange}
          >
            {SORT_OPTIONS.map((option) => (
              <Select.Option key={option.value} value={option.value}>
                {option.label}
              </Select.Option>
            ))}
          </Select>
        </div>

        <div className="flex flex-wrap items-center gap-8">
          {SORT_OPTIONS.map((option) => {
            const isActive = sort === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  setSort(option.value);
                  setPage(1);
                }}
                className={cn(
                  "rounded-full border px-12 py-6",
                  isActive
                    ? "border-border-brand bg-background-brand-muted text-text-brand"
                    : "border-border-default bg-background-surface text-text-muted",
                )}
              >
                <Text variant={isActive ? "sm-semibold" : "sm-medium"}>{option.label}</Text>
              </button>
            );
          })}
        </div>

        {isLoading ? (
          <div className="rounded-16 border-border-subtle bg-background-surface border px-20 py-24">
            <Text variant="lg-medium" className="text-text-muted">
              리뷰 목록을 불러오는 중입니다.
            </Text>
          </div>
        ) : null}

        {isError ? (
          <div className="rounded-16 border-border-error bg-status-negative-bg border px-20 py-16">
            <Text variant="md-medium" className="text-text-error">
              {getApiErrorMessage(error, "리뷰 목록을 불러오지 못했습니다.")}
            </Text>
            <Button
              className="!rounded-10 mt-12 !h-40 !min-w-0 px-14 py-8"
              size="cta"
              variant="outline"
              onClick={() => {
                void refetch();
              }}
            >
              다시 시도
            </Button>
          </div>
        ) : null}

        {!isLoading && !isError ? (
          <>
            <div className="flex flex-col gap-12">
              {items.map((review) => {
                const isHidden = review.isHidden;
                const actionLabel = isHidden ? "복구" : "숨김";

                return (
                  <article
                    key={review.id}
                    className="rounded-16 border-border-subtle bg-background-surface border px-20 py-20 lg:px-24"
                  >
                    <div className="flex items-start justify-between gap-12">
                      <div className="flex min-w-0 flex-1 flex-col gap-8">
                        <div className="flex flex-wrap items-center gap-10">
                          <Text variant="lg-semibold" className="text-text-primary">
                            {review.author.name}
                          </Text>
                          <Text variant="md-regular" className="text-text-muted">
                            {formatReviewDate(review.createdAt)}
                          </Text>
                          <Text variant="md-medium" className="text-status-caution">
                            {renderStars(review.rating)}
                          </Text>

                          {review.reportCount > 0 ? (
                            <span className="rounded-8 bg-status-negative-bg px-8 py-2">
                              <Text variant="xs-semibold" className="text-text-error">
                                신고 {review.reportCount}
                              </Text>
                            </span>
                          ) : null}

                          {isHidden ? (
                            <span className="rounded-8 bg-background-brand-muted px-8 py-2">
                              <Text variant="xs-semibold" className="text-text-brand">
                                숨김
                              </Text>
                            </span>
                          ) : null}
                        </div>

                        <Text
                          variant="lg-regular"
                          className={isHidden ? "text-text-placeholder" : "text-text-secondary"}
                        >
                          {review.content}
                        </Text>

                        {review.latestModeration?.reason ? (
                          <div className="bg-background-muted rounded-8 mt-2 px-12 py-10">
                            <Text variant="xs-semibold" className="text-text-muted">
                              관리자 처리 사유
                            </Text>
                            <Text variant="md-regular" className="text-text-secondary mt-4">
                              {review.latestModeration.reason}
                            </Text>
                          </div>
                        ) : null}
                      </div>

                      <button
                        type="button"
                        className={cn(
                          "rounded-10 border px-14 py-8",
                          isHidden
                            ? "bg-background-brand text-text-inverse border-transparent"
                            : "border-border-error bg-background-surface text-text-error",
                        )}
                        onClick={() => openReasonModal(isHidden ? "unhide" : "hide", review)}
                      >
                        <Text variant="md-semibold">{actionLabel}</Text>
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>

            {items.length === 0 ? (
              <div className="rounded-16 border-border-subtle bg-background-surface border px-20 py-40 text-center">
                <Text variant="lg-medium" className="text-text-muted">
                  조건에 맞는 리뷰가 없습니다.
                </Text>
              </div>
            ) : null}

            {pagination ? (
              <Pagination
                currentPage={pagination.page}
                pageCount={totalPages}
                onPageChange={(nextPage) => {
                  setPage(nextPage);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="pt-12"
              />
            ) : null}
          </>
        ) : null}
      </section>

      {reasonModal ? (
        <Modal
          open
          title={reasonModal.mode === "hide" ? "숨김 사유 입력" : "복구 사유 입력"}
          confirmLabel={
            isActionPending
              ? reasonModal.mode === "hide"
                ? "숨김 처리 중..."
                : "복구 중..."
              : reasonModal.mode === "hide"
                ? "숨김 처리"
                : "복구"
          }
          confirmDisabled={isActionPending || (reasonModal.mode === "hide" && !reasonInput.trim())}
          onConfirm={() => {
            void handleConfirmAction();
          }}
          onClose={closeReasonModal}
          className="max-w-[520px]"
        >
          <div className="flex flex-col gap-16">
            <Text variant="md-regular" className="text-text-secondary">
              {reasonModal.mode === "hide"
                ? "콘텐츠를 숨김 처리합니다. 사유는 기록되어 작성자 알림으로 전달됩니다."
                : "숨김 상태의 콘텐츠를 다시 공개합니다. 사유는 선택 입력입니다."}
            </Text>
            <div>
              <Text as="label" htmlFor="admin-review-reason" variant="md-semibold">
                처리 사유
              </Text>
              <Textarea
                id="admin-review-reason"
                value={reasonInput}
                onChange={(event) => setReasonInput(event.target.value)}
                placeholder="예: 신고 누적 / 커뮤니티 가이드라인 위반"
                className="mt-8 h-[140px] resize-none"
                disabled={isActionPending}
              />
            </div>
            {activeMutation.isError ? (
              <Text variant="xs-regular" className="text-text-error">
                {getApiErrorMessage(activeMutation.error, "요청 처리에 실패했습니다.")}
              </Text>
            ) : null}
          </div>
        </Modal>
      ) : null}

      {isFetching && !isLoading ? (
        <div className="rounded-10 bg-background-surface fixed right-20 bottom-20 px-12 py-8 shadow">
          <Text variant="xs-medium" className="text-text-muted">
            목록을 갱신 중입니다.
          </Text>
        </div>
      ) : null}
    </div>
  );
}
