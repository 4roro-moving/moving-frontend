"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useRef, useState } from "react";

import { LoginRequiredModal } from "@/components/auth/LoginRequiredModal";
import Toast from "@/components/common/Toast/Toast";
import { Text } from "@/components/common/Text";
import ResidenceReviewCreateButton from "@/components/residence-review/ResidenceReviewCreateButton";
import ResidenceReviewCreateModal from "@/components/residence-review/ResidenceReviewCreateModal";
import ResidenceReviewDeleteConfirmModal from "@/components/residence-review/ResidenceReviewDeleteConfirmModal";
import ResidenceReviewDetailModal from "@/components/residence-review/ResidenceReviewDetailModal";
import ResidenceReviewEditModal from "@/components/residence-review/ResidenceReviewEditModal";
import ResidenceReviewFilters from "@/components/residence-review/ResidenceReviewFilters";
import ResidenceReviewList from "@/components/residence-review/ResidenceReviewList";
import { useAuthQueryScope } from "@/hooks/useAuthQueryScope";
import { useDeleteResidenceReview } from "@/hooks/residence-review/useDeleteResidenceReview";
import { useResidenceReviewCreateAction } from "@/hooks/residence-review/useResidenceReviewCreateAction";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { ERROR_CODES } from "@/lib/constants/errorCodes";
import { RESIDENCE_REVIEW_WRITE_LOGIN_DESCRIPTION } from "@/lib/constants/residenceReview";
import { getResidenceReviewDetailQueryOptions } from "@/lib/queryOptions/residenceReviews";
import type { ResidenceReviewSearchParamsState } from "@/lib/utils/residenceReviewSearchParams";
import { useAuthStore } from "@/stores/useAuthStore";
import type { PublicResidenceReview } from "@/types/residenceReview";

interface ResidenceReviewPageViewProps {
  filters: ResidenceReviewSearchParamsState;
}

const ResidenceReviewPageView = ({ filters }: ResidenceReviewPageViewProps) => {
  const queryClient = useQueryClient();
  const { authScope, isAuthQueryReady } = useAuthQueryScope();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const deleteMutation = useDeleteResidenceReview();
  const {
    canShowCreateButton,
    defaultRegionId,
    isCreateOpen,
    isLoginRequiredOpen,
    openCreate,
    closeCreate,
    closeLoginRequired,
  } = useResidenceReviewCreateAction();
  const [selectedReview, setSelectedReview] = useState<PublicResidenceReview | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [reviewToEdit, setReviewToEdit] = useState<PublicResidenceReview | null>(null);
  const [reviewToDelete, setReviewToDelete] = useState<PublicResidenceReview | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const shouldRestoreDetailRef = useRef(false);

  const prefetchDetail = useCallback(
    (review: PublicResidenceReview) => {
      if (!isAuthQueryReady) return;

      void queryClient.prefetchQuery(getResidenceReviewDetailQueryOptions(authScope, review.id));
    },
    [authScope, isAuthQueryReady, queryClient],
  );

  const handleSelect = useCallback(
    (review: PublicResidenceReview) => {
      setSelectedReview(review);
      setIsDetailOpen(true);
      prefetchDetail(review);
    },
    [prefetchDetail],
  );

  const handleCloseDetail = useCallback(() => {
    setIsDetailOpen(false);
  }, []);

  const handleDetailExitComplete = useCallback(() => {
    if (shouldRestoreDetailRef.current) return;
    setSelectedReview(null);
  }, []);

  const handleEdit = useCallback((review: PublicResidenceReview) => {
    shouldRestoreDetailRef.current = true;
    setReviewToEdit(review);
    setIsDetailOpen(false);
  }, []);

  const handleCloseEdit = useCallback(() => {
    setReviewToEdit(null);
  }, []);

  const handleEditSuccess = useCallback(() => {
    setToastMessage("거주 후기를 수정했습니다.");
  }, []);

  const handleEditExitComplete = useCallback(() => {
    if (shouldRestoreDetailRef.current && selectedReview !== null) {
      shouldRestoreDetailRef.current = false;
      setIsDetailOpen(true);
      return;
    }

    shouldRestoreDetailRef.current = false;
  }, [selectedReview]);

  const handleConfirmDelete = useCallback(() => {
    if (!reviewToDelete) return;

    deleteMutation.mutate(reviewToDelete.id, {
      onSuccess: () => {
        setReviewToDelete(null);
        setIsDetailOpen(false);
        setSelectedReview(null);
        setToastMessage("거주 후기를 삭제했습니다.");
      },
      onError: (error) => {
        setToastMessage(
          getApiErrorMessage(error, "거주 후기를 삭제하지 못했습니다. 잠시 후 다시 시도해주세요."),
        );
      },
    });
  }, [deleteMutation, reviewToDelete]);

  return (
    <div className="bg-background-default flex w-full flex-col items-center">
      <Text as="h1" variant="2xl-bold" className="sr-only">
        거주 후기
      </Text>

      <div className="px-margin-mobile md:px-margin-tablet max-w-container-desktop mx-auto flex w-full flex-col gap-24 pt-24 pb-80 xl:px-0 xl:pt-32 xl:pb-120">
        <ResidenceReviewFilters filters={filters} />
        {canShowCreateButton ? <ResidenceReviewCreateButton onClick={openCreate} /> : null}
        <ResidenceReviewList
          filters={filters}
          onSelect={handleSelect}
          onPrefetch={prefetchDetail}
        />
      </div>

      <ResidenceReviewCreateModal
        open={isCreateOpen}
        defaultRegionId={defaultRegionId}
        onClose={closeCreate}
        onSuccess={() => setToastMessage("거주 후기를 작성했습니다.")}
      />

      <LoginRequiredModal
        open={isLoginRequiredOpen}
        onClose={closeLoginRequired}
        description={RESIDENCE_REVIEW_WRITE_LOGIN_DESCRIPTION}
      />

      <ResidenceReviewDetailModal
        open={isDetailOpen}
        review={selectedReview}
        isAuthenticated={isAuthenticated}
        onClose={handleCloseDetail}
        onExitComplete={handleDetailExitComplete}
        onEdit={handleEdit}
        onDelete={setReviewToDelete}
      />

      <ResidenceReviewEditModal
        open={reviewToEdit !== null}
        review={reviewToEdit}
        onClose={handleCloseEdit}
        onExitComplete={handleEditExitComplete}
        onSuccess={handleEditSuccess}
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

export default ResidenceReviewPageView;
