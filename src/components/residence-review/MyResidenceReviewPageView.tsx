"use client";

import { useTranslations } from "next-intl";

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
import { useDeleteResidenceReview } from "@/hooks/residence-review/useDeleteResidenceReview";
import { useMyResidenceReviewList } from "@/hooks/residence-review/useMyResidenceReviewList";
import { useResidenceReviewCreateAction } from "@/hooks/residence-review/useResidenceReviewCreateAction";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";

import { PREVIOUS_DATA_LOADING_CLASS_NAME } from "@/lib/constants/loading";
import { cn } from "@/lib/utils/cn";
import type { PublicResidenceReview } from "@/types/residenceReview";

const MyResidenceReviewPageView = () => {
  const t = useTranslations("residenceReview");
  const {
    reviews,
    pagination,
    totalCount,
    totalPages,
    currentPage,
    handlePageChange,
    setPage,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
    isPreviousDataLoading,
  } = useMyResidenceReviewList();
  const deleteMutation = useDeleteResidenceReview();
  const { canShowCreateButton, isCreateOpen, openCreate, closeCreate } =
    useResidenceReviewCreateAction();
  const [reviewToEdit, setReviewToEdit] = useState<PublicResidenceReview | null>(null);
  const [reviewToDelete, setReviewToDelete] = useState<PublicResidenceReview | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const isEmpty = !isLoading && !isError && Boolean(pagination) && totalCount === 0;
  const hasList = !isLoading && !isError && reviews.length > 0;

  const handleConfirmDelete = useCallback(() => {
    if (!reviewToDelete) return;

    deleteMutation.mutate(reviewToDelete.id, {
      onSuccess: () => {
        setReviewToDelete(null);
        setToastMessage(t("deleteSuccess"));
      },
      onError: (error) => {
        setToastMessage(getApiErrorMessage(error, t("deleteFailed")));
      },
    });
  }, [deleteMutation, reviewToDelete, t]);

  return (
    <div className="bg-background-subtle flex w-full flex-col items-center">
      <Text as="h1" variant="2xl-bold" className="sr-only">
        {t("myPageTitle")}
      </Text>

      <div className="px-margin-mobile md:px-margin-tablet max-w-container-desktop-narrow mx-auto flex w-full flex-col gap-40 pt-40 pb-60 md:pb-52 xl:px-0 xl:pt-54 xl:pb-200">
        {isLoading ? <MyResidenceReviewCardSkeletonList /> : null}

        {isError ? (
          <EstimatesQueryStatus
            message={getApiErrorMessage(error, t("myListLoadFailed"))}
            actionLabel={t("retry")}
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
            description={
              <>
                {t("myEmptyTitle")}
                <br />
                {t("myEmptyDescription")}
              </>
            }
            buttonLabel={canShowCreateButton ? t("write") : undefined}
            onActionClick={canShowCreateButton ? openCreate : undefined}
          />
        ) : null}

        {hasList && pagination ? (
          <div className="flex w-full flex-col gap-40">
            {isPreviousDataLoading ? (
              <span className="sr-only" role="status">
                {t("myListLoading")}
              </span>
            ) : null}
            <div className="flex w-full flex-col gap-20">
              {canShowCreateButton ? <ResidenceReviewCreateButton onClick={openCreate} /> : null}
              <ul
                className={cn(
                  "flex w-full flex-col gap-20",
                  isPreviousDataLoading && PREVIOUS_DATA_LOADING_CLASS_NAME,
                )}
                aria-busy={isPreviousDataLoading}
              >
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
                currentPage={currentPage}
                pageCount={totalPages}
                onPageChange={handlePageChange}
              />
            ) : null}
          </div>
        ) : null}
      </div>

      <ResidenceReviewCreateModal
        open={isCreateOpen}
        onClose={closeCreate}
        onSuccess={() => {
          setPage(1);
          setToastMessage(t("createSuccess"));
        }}
      />

      <ResidenceReviewEditModal
        open={reviewToEdit !== null}
        review={reviewToEdit}
        onClose={() => setReviewToEdit(null)}
        onSuccess={() => setToastMessage(t("editSuccess"))}
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
