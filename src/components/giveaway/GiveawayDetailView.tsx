"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { PageHeader } from "@/components/common/PageHeader";
import { Text } from "@/components/common/Text";
import GiveawayCreateModal from "@/components/giveaway/GiveawayCreateModal";
import GiveawayDeleteConfirmModal from "@/components/giveaway/GiveawayDeleteConfirmModal";
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
  GIVEAWAY_DETAIL_TITLE,
  GIVEAWAY_PREFERRED_REGION_LABEL,
  canApplyGiveaway,
  hasActiveGiveawayRequest,
} from "@/lib/constants/giveaway";
import { formatRelativeTime } from "@/lib/utils/date";
import { GIVEAWAY_STATUS, type GiveawayDetail, type GiveawayRequestItem } from "@/types/giveaway";

interface GiveawayDetailViewProps {
  giveaway: GiveawayDetail;
  isAuthor: boolean;
  requests: GiveawayRequestItem[];
  isRequestsPending?: boolean;
}

const DetailDivider = () => {
  return <div className="bg-border-subtle h-px w-full" aria-hidden="true" />;
};

const GiveawayDetailView = ({
  giveaway,
  isAuthor,
  requests,
  isRequestsPending = false,
}: GiveawayDetailViewProps) => {
  const router = useRouter();
  const deleteMutation = useDeleteGiveaway();
  const completeMutation = useCompleteGiveaway();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [actionError, setActionError] = useState<string | undefined>();
  const writtenAt = formatRelativeTime(giveaway.createdAt);
  const showPendingRequests = isAuthor && giveaway.status !== GIVEAWAY_STATUS.COMPLETED;

  const handleDelete = async () => {
    try {
      setActionError(undefined);
      await deleteMutation.mutateAsync(giveaway.id);
      router.push(APP_ROUTES.COMMUNITY.GIVEAWAY);
    } catch (error) {
      setActionError(getApiErrorMessage(error, "나눔 글을 삭제하지 못했습니다."));
    }
  };

  const handleComplete = async () => {
    try {
      setActionError(undefined);
      await completeMutation.mutateAsync(giveaway.id);
    } catch (error) {
      setActionError(getApiErrorMessage(error, "나눔을 완료하지 못했습니다."));
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

            {actionError ? (
              <Text as="p" variant="sm-medium" className="text-text-error" role="alert">
                {actionError}
              </Text>
            ) : null}

            <GiveawayDetailActions
              status={giveaway.status}
              isAuthor={isAuthor}
              canRequest={canApplyGiveaway(giveaway)}
              hasApplied={hasActiveGiveawayRequest(giveaway.myRequest?.status)}
              isCompletePending={completeMutation.isPending}
              onEdit={() => setIsEditOpen(true)}
              onDelete={() => setIsDeleteOpen(true)}
              onComplete={() => void handleComplete()}
              onApply={() => setIsApplyOpen(true)}
            />

            <div className="flex items-center gap-12">
              <GiveawayProfileAvatar
                imageUrl={giveaway.author.profileImageUrl}
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

        {showPendingRequests ? (
          <>
            <DetailDivider />
            <GiveawayPendingRequestList
              giveawayId={giveaway.id}
              giveawayStatus={giveaway.status}
              requests={requests}
              isPending={isRequestsPending}
            />
          </>
        ) : null}
      </div>

      <GiveawayCreateModal
        open={isEditOpen}
        giveaway={giveaway}
        onClose={() => setIsEditOpen(false)}
      />
      <GiveawayDeleteConfirmModal
        open={isDeleteOpen}
        isPending={deleteMutation.isPending}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={() => void handleDelete()}
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
