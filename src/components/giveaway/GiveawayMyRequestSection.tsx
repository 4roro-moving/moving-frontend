"use client";

import { useCallback, useMemo, useState } from "react";

import Button from "@/components/common/Button/Button";
import { Text } from "@/components/common/Text";
import Toast from "@/components/common/Toast/Toast";
import GiveawayRequestCancelConfirmModal from "@/components/giveaway/GiveawayRequestCancelConfirmModal";
import GiveawayRequestCardLayout from "@/components/giveaway/GiveawayRequestCardLayout";
import GiveawayRequestEditModal from "@/components/giveaway/GiveawayRequestEditModal";
import { useCancelGiveawayRequest } from "@/hooks/giveaway/useCancelGiveawayRequest";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import {
  GIVEAWAY_EDIT_BUTTON_LABEL,
  GIVEAWAY_MY_REQUEST_SECTION_ID,
  GIVEAWAY_MY_REQUEST_TITLE,
  GIVEAWAY_REQUEST_CONTENT_LABEL,
  GIVEAWAY_REQUEST_EMPTY_MESSAGE,
  canCancelGiveawayRequest,
  canEditGiveawayRequest,
  getGiveawayRequestStatusLabel,
} from "@/lib/constants/giveaway";
import type { GiveawayDetail, MyGiveawayRequestItem } from "@/types/giveaway";

interface GiveawayMyRequestSectionProps {
  giveaway: GiveawayDetail;
}

const MY_REQUEST_CONTENT_TITLE_ID = "giveaway-my-request-content-title";

const toMyGiveawayRequestItem = (giveaway: GiveawayDetail): MyGiveawayRequestItem | null => {
  if (giveaway.myRequest === null) {
    return null;
  }

  return {
    id: giveaway.myRequest.id,
    status: giveaway.myRequest.status,
    message: giveaway.myRequest.message,
    createdAt: giveaway.myRequest.createdAt,
    updatedAt: giveaway.myRequest.updatedAt,
    giveaway: {
      id: giveaway.id,
      title: giveaway.title,
      status: giveaway.status,
      author: giveaway.author,
      region: giveaway.region,
      thumbnailUrl: giveaway.images[0]?.imageUrl ?? null,
    },
  };
};

const GiveawayMyRequestSection = ({ giveaway }: GiveawayMyRequestSectionProps) => {
  const request = useMemo(() => toMyGiveawayRequestItem(giveaway), [giveaway]);
  const cancelMutation = useCancelGiveawayRequest();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleConfirmCancel = useCallback(() => {
    if (!request) {
      return;
    }

    cancelMutation.mutate(request.id, {
      onSuccess: () => {
        setIsCancelOpen(false);
        setToastMessage("나눔 신청을 취소했습니다.");
      },
      onError: (error) => {
        setToastMessage(
          getApiErrorMessage(error, "나눔 신청을 취소하지 못했습니다. 잠시 후 다시 시도해주세요."),
        );
      },
    });
  }, [cancelMutation, request]);

  if (request === null) {
    return null;
  }

  const canEdit = canEditGiveawayRequest(request);
  const canCancel = canCancelGiveawayRequest(request);
  const hasActions = canEdit || canCancel;
  const message = request.message?.trim() || GIVEAWAY_REQUEST_EMPTY_MESSAGE;
  const statusLabel = getGiveawayRequestStatusLabel(request.status);

  return (
    <section
      id={GIVEAWAY_MY_REQUEST_SECTION_ID}
      className="flex w-full flex-col gap-20"
      aria-labelledby="giveaway-my-request-title"
    >
      <Text
        as="h2"
        id="giveaway-my-request-title"
        variant={{ base: "xl-bold", md: "2xl-bold" }}
        className="text-text-primary"
      >
        {GIVEAWAY_MY_REQUEST_TITLE}
      </Text>

      <GiveawayRequestCardLayout
        labelledBy={MY_REQUEST_CONTENT_TITLE_ID}
        statusLabel={statusLabel}
        createdAt={request.createdAt}
        actions={
          hasActions ? (
            <>
              {canEdit ? (
                <Button
                  type="button"
                  variant="solid"
                  size="cta"
                  fullWidth
                  onClick={() => setIsEditOpen(true)}
                >
                  {GIVEAWAY_EDIT_BUTTON_LABEL}
                </Button>
              ) : null}
              {canCancel ? (
                <Button
                  type="button"
                  variant="outline"
                  size="cta"
                  fullWidth
                  onClick={() => setIsCancelOpen(true)}
                >
                  취소하기
                </Button>
              ) : null}
            </>
          ) : undefined
        }
      >
        <div className="flex min-w-0 flex-col">
          <Text
            as="p"
            id={MY_REQUEST_CONTENT_TITLE_ID}
            variant={{ base: "lg-semibold", md: "2lg-bold" }}
            className="text-text-secondary"
          >
            {GIVEAWAY_REQUEST_CONTENT_LABEL}
          </Text>
          <Text
            as="p"
            variant={{ base: "xs-regular", md: "md-regular" }}
            className="text-text-secondary whitespace-pre-wrap"
          >
            {message}
          </Text>
        </div>
      </GiveawayRequestCardLayout>

      <GiveawayRequestEditModal
        open={isEditOpen}
        request={request}
        onClose={() => setIsEditOpen(false)}
        onSuccess={() => setToastMessage("신청 내용을 수정했습니다.")}
      />
      <GiveawayRequestCancelConfirmModal
        open={isCancelOpen}
        request={request}
        isPending={cancelMutation.isPending}
        onClose={() => setIsCancelOpen(false)}
        onConfirm={handleConfirmCancel}
      />
      {toastMessage ? <Toast onClose={() => setToastMessage(null)}>{toastMessage}</Toast> : null}
    </section>
  );
};

export default GiveawayMyRequestSection;
