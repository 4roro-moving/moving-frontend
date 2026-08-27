"use client";

import { useState } from "react";

import Button from "@/components/common/Button/Button";
import ProfileAvatar from "@/components/common/ProfileAvatar/ProfileAvatar";
import { Text } from "@/components/common/Text";
import GiveawayRequestCardLayout from "@/components/giveaway/GiveawayRequestCardLayout";
import ReportModal from "@/components/report/ReportModal";
import ReportMoreMenu from "@/components/report/ReportMoreMenu";
import {
  GIVEAWAY_REJECT_BUTTON_LABEL,
  GIVEAWAY_REQUEST_CONTENT_LABEL,
  GIVEAWAY_REQUEST_EMPTY_MESSAGE,
  GIVEAWAY_SHARE_BUTTON_LABEL,
  canRejectGiveawayRequest,
  canSelectGiveawayRequest,
  getGiveawayRequestStatusLabel,
} from "@/lib/constants/giveaway";
import type { GiveawayRequestItem, GiveawayStatus } from "@/types/giveaway";

interface GiveawayReceivedRequestCardProps {
  request: GiveawayRequestItem;
  giveawayStatus: GiveawayStatus;
  isActionPending?: boolean;
  onSelect: (request: GiveawayRequestItem) => void;
  onReject: (request: GiveawayRequestItem) => void;
}

const GiveawayReceivedRequestCard = ({
  request,
  giveawayStatus,
  isActionPending = false,
  onSelect,
  onReject,
}: GiveawayReceivedRequestCardProps) => {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const canSelect = canSelectGiveawayRequest(giveawayStatus, request.status);
  const canReject = canRejectGiveawayRequest(giveawayStatus, request.status);
  const message = request.message?.trim() || GIVEAWAY_REQUEST_EMPTY_MESSAGE;
  const statusLabel = getGiveawayRequestStatusLabel(request.status);
  const titleId = `giveaway-request-${String(request.id)}-title`;
  const hasActions = canSelect || canReject;

  return (
    <>
      <GiveawayRequestCardLayout
        labelledBy={titleId}
        statusLabel={statusLabel}
        createdAt={request.createdAt}
        actions={
          hasActions ? (
            <>
              {canSelect ? (
                <Button
                  type="button"
                  variant="solid"
                  size="cta"
                  fullWidth
                  disabled={isActionPending}
                  onClick={() => onSelect(request)}
                >
                  {GIVEAWAY_SHARE_BUTTON_LABEL}
                </Button>
              ) : null}
              {canReject ? (
                <Button
                  type="button"
                  variant="outline"
                  size="cta"
                  fullWidth
                  disabled={isActionPending}
                  onClick={() => onReject(request)}
                >
                  {GIVEAWAY_REJECT_BUTTON_LABEL}
                </Button>
              ) : null}
            </>
          ) : undefined
        }
      >
        <div className="flex items-start justify-between gap-12">
          <div className="flex min-w-0 flex-1 items-center gap-12 md:gap-20">
            <ProfileAvatar
              imageUrl={request.requester.imageUrl}
              className="rounded-12 size-64 md:size-80"
              sizes="80px"
            />
            <div className="flex min-w-0 flex-1 flex-col">
              <Text
                as="h3"
                id={titleId}
                variant={{ base: "lg-bold", md: "2lg-bold" }}
                className="text-text-secondary"
              >
                {request.requester.name}
              </Text>
              <Text
                as="p"
                variant={{ base: "xs-medium", md: "xs-medium" }}
                className="text-text-muted"
              >
                {GIVEAWAY_REQUEST_CONTENT_LABEL}
              </Text>
              <Text
                as="p"
                variant={{ base: "xs-regular", md: "md-regular" }}
                className="text-text-secondary line-clamp-2"
              >
                {message}
              </Text>
            </div>
          </div>
          <ReportMoreMenu
            ariaLabel={`${request.requester.name} 신청자 메뉴 더보기`}
            onReport={() => setIsReportModalOpen(true)}
          />
        </div>
      </GiveawayRequestCardLayout>
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        targetType="CUSTOMER"
        targetId={request.requester.id}
        targetName={`${request.requester.name} 고객님`}
      />
    </>
  );
};

export default GiveawayReceivedRequestCard;
