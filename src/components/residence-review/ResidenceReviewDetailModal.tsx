"use client";

import AutoTranslatedText from "@/components/common/AutoTranslatedText";

import { useTranslations } from "next-intl";

import Image from "next/image";
import { useState } from "react";
import { useFormatter } from "next-intl";

import Button from "@/components/common/Button/Button";
import Modal, { RESPONSIVE_FORM_MODAL_PANEL_CLASSNAME } from "@/components/common/Modal/Modal";
import { Text } from "@/components/common/Text";
import EstimatesQueryStatus from "@/components/estimate/EstimatesQueryStatus";
import ReportModal from "@/components/report/ReportModal";
import ReportMoreMenu from "@/components/report/ReportMoreMenu";
import ResidenceReviewInfoItem from "@/components/residence-review/ResidenceReviewInfoItem";
import ResidenceReviewRatingText from "@/components/residence-review/ResidenceReviewRatingText";
import { useResidenceReviewDetail } from "@/hooks/residence-review/useResidenceReviewDetail";
import { ProfileDefaultIcon } from "@/icons";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { ERROR_CODES } from "@/lib/constants/errorCodes";
import { cn } from "@/lib/utils/cn";

import {
  formatResidenceReviewRating,
  getResidenceReviewAuthorImageSrc,
  isResidenceReviewOwner,
} from "@/lib/utils/residenceReviewFormat";
import { useAuthStore } from "@/stores/useAuthStore";
import type { PublicResidenceReview } from "@/types/residenceReview";

interface ResidenceReviewDetailModalProps {
  open: boolean;
  review: PublicResidenceReview | null;
  isAuthenticated: boolean;
  onClose: () => void;
  onEdit: (review: PublicResidenceReview) => void;
  onDelete: (review: PublicResidenceReview) => void;
  onExitComplete?: () => void;
}

const ResidenceReviewDetailModal = ({
  open,
  review,
  isAuthenticated,
  onClose,
  onEdit,
  onDelete,
  onExitComplete,
}: ResidenceReviewDetailModalProps) => {
  const t = useTranslations("residenceReview");
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const format = useFormatter();

  const userId = useAuthStore((state) => state.user?.id);
  const userRole = useAuthStore((state) => state.user?.role);

  const { data, isError, error, refetch, isFetching } = useResidenceReviewDetail({
    residenceReviewId: review?.id ?? null,
    placeholderData: review ?? undefined,
    enabled: open && review !== null,
  });

  const currentReview = data ?? review;

  if (!currentReview) {
    return null;
  }

  const authorImageSrc = getResidenceReviewAuthorImageSrc(currentReview.author.imageUrl);

  const isOwner = isAuthenticated && isResidenceReviewOwner(currentReview, userId);

  // MOVER는 거주후기 기능을 사용하지 않으므로 신고 UI를 노출하지 않는다.
  const showReport = isAuthenticated && !isOwner && userRole === "CUSTOMER";

  let writtenDate = "";

  try {
    writtenDate = format.dateTime(new Date(currentReview.createdAt), {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    writtenDate = "";
  }

  const handleDetailClose = () => {
    setIsReportModalOpen(false);
    onClose();
  };

  return (
    <>
      <Modal
        open={open}
        onClose={handleDetailClose}
        onExitComplete={onExitComplete}
        presentation="responsive"
        size="lg"
        className={cn(RESPONSIVE_FORM_MODAL_PANEL_CLASSNAME, "gap-24 xl:gap-32")}
      >
        <div className="flex w-full items-start justify-between gap-12">
          <Modal.Title>{t("detailTitle")}</Modal.Title>

          <Modal.Close onClose={handleDetailClose} />
        </div>

        {isError ? (
          <EstimatesQueryStatus
            className="py-40"
            message={getApiErrorMessage(error, ERROR_CODES.RESIDENCE_REVIEW_NOT_FOUND.message)}
            actionLabel={t("retry")}
            actionBusy={isFetching}
            onAction={() => {
              void refetch();
            }}
          />
        ) : (
          <>
            <div className="flex min-h-0 w-full flex-1 flex-col gap-24 overflow-y-auto">
              <ResidenceReviewRatingText
                rating={currentReview.rating}
                starClassName="size-24 xl:size-32"
                textVariant={{
                  base: "lg-bold",
                  xl: "2xl-bold",
                }}
                textClassName="text-text-primary"
              />

              <div className="flex items-center justify-between gap-16">
                <Text
                  as="p"
                  variant={{
                    base: "lg-semibold",
                    xl: "2lg-semibold",
                  }}
                  className="text-text-primary"
                >
                  {currentReview.author.name.trim() || t("customer")}
                </Text>

                <div className="flex items-center gap-12">
                  <div className="bg-background-avatar rounded-12 relative size-48 shrink-0 overflow-hidden xl:size-64">
                    {authorImageSrc ? (
                      <Image
                        src={authorImageSrc}
                        alt=""
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    ) : (
                      <ProfileDefaultIcon className="size-full" aria-hidden="true" />
                    )}
                  </div>

                  {showReport ? (
                    <ReportMoreMenu
                      ariaLabel={t("more")}
                      onReport={() => setIsReportModalOpen(true)}
                    />
                  ) : null}
                </div>
              </div>

              <div className="border-border-subtle border-y py-16">
                <dl className="flex w-full items-start gap-16">
                  <ResidenceReviewInfoItem
                    label={t("reviewRegion")}
                    value={t(`regions.${String(currentReview.region.id)}`)}
                    labelVariant={{
                      base: "xs-regular",
                      xl: "md-regular",
                    }}
                    valueVariant={{
                      base: "sm-medium",
                      xl: "lg-semibold",
                    }}
                    className="flex-1"
                  />

                  <ResidenceReviewInfoItem
                    label={t("regionRating")}
                    value={formatResidenceReviewRating(currentReview.region.averageRating)}
                    labelVariant={{
                      base: "xs-regular",
                      xl: "md-regular",
                    }}
                    valueVariant={{
                      base: "sm-medium",
                      xl: "lg-semibold",
                    }}
                    className="flex-1"
                  />

                  <ResidenceReviewInfoItem
                    label={t("writtenDate")}
                    value={writtenDate}
                    labelVariant={{
                      base: "xs-regular",
                      xl: "md-regular",
                    }}
                    valueVariant={{
                      base: "sm-medium",
                      xl: "lg-semibold",
                    }}
                    className="flex-1"
                  />
                </dl>
              </div>

              <div className="flex flex-col gap-12">
                <Text
                  as="h3"
                  variant={{
                    base: "lg-semibold",
                    xl: "xl-semibold",
                  }}
                  className="text-text-primary"
                >
                  <AutoTranslatedText text={currentReview.title} />
                </Text>

                <Text
                  as="p"
                  variant={{
                    base: "md-medium",
                    xl: "lg-medium",
                  }}
                  className="text-text-secondary whitespace-pre-wrap"
                >
                  <AutoTranslatedText text={currentReview.content} />
                </Text>
              </div>
            </div>

            {isOwner ? (
              <div className="flex w-full gap-8">
                <Button
                  type="button"
                  variant="solid"
                  size="cta"
                  fullWidth
                  onClick={() => onEdit(currentReview)}
                >
                  {t("edit")}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="cta"
                  fullWidth
                  onClick={() => onDelete(currentReview)}
                >
                  {t("delete")}
                </Button>
              </div>
            ) : null}
          </>
        )}
      </Modal>

      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        targetType="RESIDENCE_REVIEW"
        targetId={String(currentReview.id)}
        targetName={currentReview.title}
      />
    </>
  );
};

export default ResidenceReviewDetailModal;
