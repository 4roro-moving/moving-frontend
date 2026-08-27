"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import Button from "@/components/common/Button/Button";
import ProfileAvatar from "@/components/common/ProfileAvatar/ProfileAvatar";
import { Text } from "@/components/common/Text";
import GiveawayRequestCardLayout from "@/components/giveaway/GiveawayRequestCardLayout";
import ReportModal from "@/components/report/ReportModal";
import ReportMoreMenu from "@/components/report/ReportMoreMenu";
import { canRejectGiveawayRequest, canSelectGiveawayRequest } from "@/lib/constants/giveaway";
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
  const t = useTranslations("giveaway");
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const canSelect = canSelectGiveawayRequest(giveawayStatus, request.status);
  const canReject = canRejectGiveawayRequest(giveawayStatus, request.status);
  const message = request.message?.trim() || t("none");
  const statusLabel = t(`requestStatusValues.${request.status}`);
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
                  {t("share")}
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
                  {t("reject")}
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
                {t("requestContent")}
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
            ariaLabel={t("requesterMoreMenuAria", { name: request.requester.name })}
            onReport={() => setIsReportModalOpen(true)}
          />
        </div>
      </GiveawayRequestCardLayout>
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        targetType="CUSTOMER"
        targetId={request.requester.id}
        targetName={request.requester.name}
      />
    </>
  );
};

export default GiveawayReceivedRequestCard;
