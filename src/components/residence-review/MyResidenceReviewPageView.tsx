"use client";

import { useCallback, useState } from "react";

import EmptyState from "@/components/common/EmptyState/EmptyState";
import Pagination from "@/components/common/Pagination/Pagination";
import Toast from "@/components/common/Toast/Toast";
import { Text } from "@/components/common/Text";
import EstimatesQueryStatus from "@/components/estimate/EstimatesQueryStatus";
import MyResidenceReviewCard from "@/components/residence-review/MyResidenceReviewCard";
import MyResidenceReviewCardSkeletonList from "@/components/residence-review/MyResidenceReviewCardSkeletonList";
import ResidenceReviewCreateButton from "@/components/residence-review/ResidenceReviewCreateButton";
import ResidenceReviewCreateModal from "@/components/residence-review/ResidenceReviewCreateModal";
import ResidenceReviewDeleteConfirmModal from "@/components/residence-review/ResidenceReviewDeleteConfirmModal";
import ResidenceReviewEditModal from "@/components/residence-review/ResidenceReviewEditModal";
import { useDeleteResidenceReview } from "@/hooks/useDeleteResidenceReview";
import { useMyResidenceReviews } from "@/hooks/useMyResidenceReviews";
import { useResidenceReviewCreateAction } from "@/hooks/useResidenceReviewCreateAction";
import { useReviewPagination } from "@/hooks/useReviewPagination";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { ERROR_CODES } from "@/lib/constants/errorCodes";
import {
  RESIDENCE_REVIEW_PAGE_LIMIT,
  RESIDENCE_REVIEW_WRITE_BUTTON_LABEL,
} from "@/lib/constants/residenceReview";
import type { PublicResidenceReview } from "@/types/residenceReview";

const EMPTY_DESCRIPTION = (
  <>
    아직 작성한 거주 후기가 없어요.
    <br />
    거주 중인 지역에 대한 후기를 남겨보세요.
  </>
);

const MyResidenceReviewPageView = () => {
  const { page, currentPage, setPage, handlePageChange } = useReviewPagination({
    canCorrectPage: false,
  });
  const { data, isLoading, isError, error, refetch, isFetching, isPlaceholderData } =
    useMyResidenceReviews({
      page,
      limit: RESIDENCE_REVIEW_PAGE_LIMIT,
    });
  const deleteMutation = useDeleteResidenceReview();
  const { canShowCreateButton, defaultRegionId, isCreateOpen, openCreate, closeCreate } =
    useResidenceReviewCreateAction();
  const [reviewToEdit, setReviewToEdit] = useState<PublicResidenceReview | null>(null);
  const [reviewToDelete, setReviewToDelete] = useState<PublicResidenceReview | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const reviews = data?.reviews ?? [];
  const pagination = data?.pagination;
  const totalCount = pagination?.totalCount ?? 0;
  const totalPages = Math.max(1, pagination?.totalPages ?? 1);

  if (!isPlaceholderData && pagination && totalCount > 0 && page > totalPages) {
    setPage(totalPages);
  }

  const renderedCurrentPage = Math.min(Math.max(1, currentPage), totalPages);
  const isEmpty = !isLoading && !isError && Boolean(pagination) && totalCount === 0;
  const hasList = !isLoading && !isError && reviews.length > 0;

  const handleConfirmDelete = useCallback(() => {
    if (!reviewToDelete) return;

    deleteMutation.mutate(reviewToDelete.id, {
      onSuccess: () => {
        setReviewToDelete(null);
        setToastMessage("거주 후기를 삭제했습니다.");
      },
      onError: (error) => {
        setToastMessage(getApiErrorMessage(error, ERROR_CODES.RESIDENCE_REVIEW_NOT_FOUND.message));
      },
    });
  }, [deleteMutation, reviewToDelete]);

  return (
    <div className="bg-background-subtle flex w-full flex-col items-center">
      <Text as="h1" variant="2xl-bold" className="sr-only">
        내가 작성한 거주 후기
      </Text>

      <div className="px-margin-mobile md:px-margin-tablet max-w-container-desktop-narrow mx-auto flex w-full flex-col gap-40 pt-40 pb-60 md:pb-52 xl:px-0 xl:pt-54 xl:pb-200">
        {isLoading ? <MyResidenceReviewCardSkeletonList /> : null}

        {isError ? (
          <EstimatesQueryStatus
            message={getApiErrorMessage(
              error,
              "내가 작성한 거주 후기를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.",
            )}
            actionLabel="다시 시도"
            onAction={() => {
              void refetch();
            }}
            actionBusy={isFetching}
          />
        ) : null}

        {isEmpty ? (
          <EmptyState
            size="sm"
            imageSrc="/images/empty/character.png"
            description={EMPTY_DESCRIPTION}
            buttonLabel={canShowCreateButton ? RESIDENCE_REVIEW_WRITE_BUTTON_LABEL : undefined}
            onActionClick={canShowCreateButton ? openCreate : undefined}
          />
        ) : null}

        {hasList && pagination ? (
          <div className="flex w-full flex-col gap-40" aria-busy={isFetching}>
            <div className="flex w-full flex-col gap-20">
              {canShowCreateButton ? <ResidenceReviewCreateButton onClick={openCreate} /> : null}
              <ul className="flex w-full flex-col gap-20">
                {reviews.map((review) => (
                  <li key={review.id}>
                    <MyResidenceReviewCard
                      review={review}
                      onEdit={setReviewToEdit}
                      onDelete={setReviewToDelete}
                    />
                  </li>
                ))}
              </ul>
            </div>

            {totalPages > 1 ? (
              <Pagination
                currentPage={renderedCurrentPage}
                pageCount={totalPages}
                onPageChange={handlePageChange}
              />
            ) : null}
          </div>
        ) : null}
      </div>

      <ResidenceReviewCreateModal
        open={isCreateOpen}
        defaultRegionId={defaultRegionId}
        onClose={closeCreate}
        onSuccess={() => {
          setPage(1);
          setToastMessage("거주 후기를 작성했습니다.");
        }}
      />

      <ResidenceReviewEditModal
        open={reviewToEdit !== null}
        review={reviewToEdit}
        onClose={() => setReviewToEdit(null)}
        onSuccess={() => setToastMessage("거주 후기를 수정했습니다.")}
      />

      <ResidenceReviewDeleteConfirmModal
        open={reviewToDelete !== null}
        isPending={deleteMutation.isPending}
        onClose={() => setReviewToDelete(null)}
        onConfirm={handleConfirmDelete}
      />

      {toastMessage ? <Toast onClose={() => setToastMessage(null)}>{toastMessage}</Toast> : null}
    </div>
  );
};

export default MyResidenceReviewPageView;
