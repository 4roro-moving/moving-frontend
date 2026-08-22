"use client";

import type { InfiniteData, UseInfiniteQueryResult } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { PageHeader } from "@/components/common/PageHeader";
import { Text } from "@/components/common/Text";
import GiveawayConfirmModal from "@/components/giveaway/GiveawayConfirmModal";
import GiveawayCreateModal from "@/components/giveaway/GiveawayCreateModal";
import GiveawayDetailActions from "@/components/giveaway/GiveawayDetailActions";
import GiveawayDetailImageSlider from "@/components/giveaway/GiveawayDetailImageSlider";
import GiveawayPendingRequestList from "@/components/giveaway/GiveawayPendingRequestList";
import GiveawayProfileAvatar from "@/components/giveaway/GiveawayProfileAvatar";
import GiveawayReportButton from "@/components/giveaway/GiveawayReportButton";
import GiveawayRequestFormModal from "@/components/giveaway/GiveawayRequestFormModal";
import { useCompleteGiveaway } from "@/hooks/giveaway/useCompleteGiveaway";
import { useDeleteGiveaway } from "@/hooks/giveaway/useDeleteGiveaway";
import { DocumentIcon } from "@/icons";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { APP_ROUTES } from "@/lib/constants/appRoutes";
import {
  GIVEAWAY_COMPLETE_BUTTON_LABEL,
  GIVEAWAY_DETAIL_TITLE,
  GIVEAWAY_PREFERRED_REGION_LABEL,
  canApplyGiveaway,
  hasActiveGiveawayRequest,
} from "@/lib/constants/giveaway";
import { formatRelativeTime } from "@/lib/utils/date";
import type { ApiError } from "@/types/api";
import type {
  GiveawayDetail,
  GiveawayRequestItem,
  GiveawayRequestListResult,
} from "@/types/giveaway";

interface GiveawayDetailViewProps {
  giveaway: GiveawayDetail;
  isAuthor: boolean;
  requests: GiveawayRequestItem[];
  isRequestsPending?: boolean;
  requestsQuery: UseInfiniteQueryResult<InfiniteData<GiveawayRequestListResult>, ApiError>;
}

const DetailDivider = () => {
  return <div className="bg-border-subtle h-px w-full" aria-hidden="true" />;
};

const GiveawayDetailView = ({
  giveaway,
  isAuthor,
  requests,
  isRequestsPending = false,
  requestsQuery,
}: GiveawayDetailViewProps) => {
  const router = useRouter();
  const deleteMutation = useDeleteGiveaway();
  const completeMutation = useCompleteGiveaway();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isCompleteOpen, setIsCompleteOpen] = useState(false);
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [deleteError, setDeleteError] = useState<string | undefined>();
  const [completeError, setCompleteError] = useState<string | undefined>();
  const writtenAt = formatRelativeTime(giveaway.createdAt);
  const showReceivedRequests = isAuthor;

  const handleCloseDelete = () => {
    if (deleteMutation.isPending) {
      return;
    }

    setDeleteError(undefined);
    setIsDeleteOpen(false);
  };

  const handleCloseComplete = () => {
    if (completeMutation.isPending) {
      return;
    }

    setCompleteError(undefined);
    setIsCompleteOpen(false);
  };

  const handleDelete = async () => {
    try {
      setDeleteError(undefined);
      await deleteMutation.mutateAsync(giveaway.id);
      router.push(APP_ROUTES.COMMUNITY.GIVEAWAY);
    } catch (error) {
      setDeleteError(getApiErrorMessage(error, "나눔 글을 삭제하지 못했습니다."));
    }
  };

  const handleComplete = async () => {
    try {
      setCompleteError(undefined);
      await completeMutation.mutateAsync(giveaway.id);
      setIsCompleteOpen(false);
    } catch (error) {
      setCompleteError(getApiErrorMessage(error, "나눔을 완료하지 못했습니다."));
    }
  };

  return (
    <div className="bg-background-default flex w-full flex-col items-center">
      <PageHeader title={GIVEAWAY_DETAIL_TITLE} backFallbackHref={APP_ROUTES.COMMUNITY.GIVEAWAY} />

      <div className="px-margin-mobile md:px-margin-tablet max-w-container-desktop xl:pb-37-5 mx-auto flex w-full flex-col gap-60 pt-35 pb-48 md:pt-44 md:pb-38 xl:px-0 xl:pt-42">
        <article className="flex w-full flex-col items-center gap-30 md:flex-row md:items-start md:justify-between md:gap-60">
          <div className="w-full md:w-268 md:shrink-0 xl:w-[500px]">
            <GiveawayDetailImageSlider images={giveaway.images} status={giveaway.status} />
          </div>

          <div className="flex w-full flex-col gap-30 md:min-w-0 md:flex-1 xl:w-[600px] xl:shrink-0">
            <div className="flex w-full flex-col gap-26">
              <div className="flex w-full flex-col gap-20">
                <Text
                  as="h2"
                  variant={{ base: "xl-semibold", xl: "2xl-semibold" }}
                  className="text-text-secondary"
                >
                  {giveaway.title}
                </Text>

                <div className="flex w-full items-center gap-12">
                  <div className="text-text-muted flex min-w-0 flex-1 items-center gap-8">
                    {writtenAt ? (
                      <Text as="time" variant={{ base: "sm-medium", xl: "md-medium" }}>
                        {writtenAt}
                      </Text>
                    ) : null}
                    <span
                      className="flex items-center gap-2"
                      aria-label={`신청 ${String(giveaway.activeRequestCount)}건`}
                    >
                      <DocumentIcon className="size-16" aria-hidden="true" />
                      <Text
                        as="span"
                        variant={{ base: "sm-medium", xl: "md-medium" }}
                        className="text-text-subtle"
                      >
                        {giveaway.activeRequestCount}
                      </Text>
                    </span>
                  </div>
                  {isAuthor ? null : <GiveawayReportButton />}
                </div>
              </div>

              <DetailDivider />

              <Text
                as="p"
                variant={{ base: "md-medium", xl: "2lg-medium" }}
                className="text-text-primary min-h-200 whitespace-pre-wrap"
              >
                {giveaway.description}
              </Text>

              <DetailDivider />
            </div>

            <GiveawayDetailActions
              status={giveaway.status}
              isAuthor={isAuthor}
              canRequest={canApplyGiveaway(giveaway)}
              hasApplied={hasActiveGiveawayRequest(giveaway.myRequest?.status)}
              isCompletePending={completeMutation.isPending}
              onEdit={() => setIsEditOpen(true)}
              onDelete={() => {
                setDeleteError(undefined);
                setIsDeleteOpen(true);
              }}
              onComplete={() => {
                setCompleteError(undefined);
                setIsCompleteOpen(true);
              }}
              onApply={() => setIsApplyOpen(true)}
            />

            <div className="flex items-center gap-12">
              <GiveawayProfileAvatar
                imageUrl={giveaway.author.imageUrl}
                className="rounded-12 size-64"
                sizes="64px"
              />
              <div className="flex min-w-0 flex-col">
                <Text
                  as="p"
                  variant={{ base: "lg-semibold", xl: "2lg-semibold" }}
                  className="text-text-secondary"
                >
                  {giveaway.author.name}
                </Text>
                {giveaway.region ? (
                  <Text
                    as="p"
                    variant={{ base: "sm-medium", xl: "md-medium" }}
                    className="text-text-muted"
                  >
                    {`${GIVEAWAY_PREFERRED_REGION_LABEL} - ${giveaway.region.name}`}
                  </Text>
                ) : null}
              </div>
            </div>
          </div>
        </article>

        {showReceivedRequests ? (
          <>
            <DetailDivider />
            <GiveawayPendingRequestList
              giveawayId={giveaway.id}
              giveawayStatus={giveaway.status}
              requests={requests}
              isPending={isRequestsPending}
              query={requestsQuery}
            />
          </>
        ) : null}
      </div>

      <GiveawayCreateModal
        open={isEditOpen}
        giveaway={giveaway}
        onClose={() => setIsEditOpen(false)}
      />
      <GiveawayConfirmModal
        open={isDeleteOpen}
        title="나눔 글 삭제"
        description="작성한 나눔 글을 삭제할까요? 삭제하면 되돌릴 수 없습니다."
        confirmLabel="삭제"
        pendingLabel="삭제 중..."
        isPending={deleteMutation.isPending}
        error={deleteError}
        onClose={handleCloseDelete}
        onConfirm={() => void handleDelete()}
      />
      <GiveawayConfirmModal
        open={isCompleteOpen}
        title="나눔 완료"
        description="나눔을 완료할까요? 완료하면 되돌릴 수 없습니다."
        confirmLabel={GIVEAWAY_COMPLETE_BUTTON_LABEL}
        pendingLabel="완료 중..."
        isPending={completeMutation.isPending}
        error={completeError}
        onClose={handleCloseComplete}
        onConfirm={() => void handleComplete()}
      />
      <GiveawayRequestFormModal
        open={isApplyOpen}
        mode="create"
        giveawayId={giveaway.id}
        onClose={() => setIsApplyOpen(false)}
      />
    </div>
  );
};

export default GiveawayDetailView;
