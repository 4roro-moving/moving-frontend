"use client";

import Image from "next/image";
import { useState } from "react";

import Button from "@/components/common/Button/Button";
import { Text } from "@/components/common/Text";
import Toast from "@/components/common/Toast/Toast";
import DesignatedMoverCancelConfirmModal from "@/components/estimate/requests/DesignatedMoverCancelConfirmModal";
import { useCancelDesignatedMover } from "@/hooks/useCancelDesignatedMover";
import { getDesignatedMoverDisplayName } from "@/lib/utils/estimateFormat";
import { resolveMoverProfileImageSrc } from "@/lib/utils/moverProfileImage";
import type { MyEstimateRequestDesignatedMover } from "@/types/estimate";

interface EstimateRequestDesignatedMoversProps {
  estimateRequestId: number;
  /** API designatedMovers — moverId를 key·취소 mutation에 사용 */
  designatedMovers: MyEstimateRequestDesignatedMover[];
  /** PENDING|OPEN일 때만 개별 지정 취소 노출 */
  canCancelDesignation?: boolean;
}

/**
 * 보낸 견적 요청 상세 — 지정 요청 대상 기사님 목록
 * // 2026.07.30 정슬기 - [추가] 지정 견적 요청 기사님 정보 표시
 * // 2026.08.07 정슬기 - [수정] 지정 기사 개별 취소
 */
export default function EstimateRequestDesignatedMovers({
  estimateRequestId,
  designatedMovers,
  canCancelDesignation = false,
}: EstimateRequestDesignatedMoversProps) {
  const [targetMoverId, setTargetMoverId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const cancelMutation = useCancelDesignatedMover({
    onSuccess: () => {
      setTargetMoverId(null);
      setToastMessage("지정 견적 요청을 취소했어요.");
    },
    onError: (message) => {
      setToastMessage(message);
    },
  });

  if (designatedMovers.length === 0) {
    return toastMessage ? (
      <Toast onClose={() => setToastMessage(null)}>{toastMessage}</Toast>
    ) : null;
  }

  const targetItem =
    targetMoverId === null
      ? null
      : (designatedMovers.find((item) => item.moverId === targetMoverId) ?? null);
  const targetDisplayName = targetItem ? getDesignatedMoverDisplayName(targetItem.mover) : "";

  const closeModal = () => {
    if (cancelMutation.isPending) {
      return;
    }
    setTargetMoverId(null);
  };

  return (
    <>
      <section
        className="flex w-full flex-col gap-20 md:gap-28"
        aria-label="지정 견적 요청 대상 기사님"
      >
        <div className="flex w-full flex-col gap-8">
          <Text as="p" variant="md-semibold" className="text-text-brand">
            지정 견적 요청
          </Text>
          <Text
            as="h2"
            variant={{ base: "lg-semibold", md: "xl-semibold" }}
            className="text-text-primary"
          >
            요청한 기사님
          </Text>
        </div>

        <ul className="flex w-full flex-col gap-16">
          {designatedMovers.map((item) => {
            const displayName = getDesignatedMoverDisplayName(item.mover);
            const imageUrl = item.mover.moverProfile?.imageUrl;
            const isTargetPending = cancelMutation.isPending && targetMoverId === item.moverId;

            return (
              <li key={item.moverId} className="flex w-full items-center justify-between gap-12">
                <div className="flex min-w-0 flex-1 items-center gap-12">
                  <div className="bg-background-avatar rounded-12 relative size-40 shrink-0 overflow-hidden md:size-48">
                    <Image
                      src={resolveMoverProfileImageSrc(imageUrl)}
                      alt={`${displayName} 프로필`}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>
                  <Text
                    as="span"
                    variant="lg-semibold"
                    className="text-text-primary min-w-0 wrap-break-word"
                  >
                    {displayName}
                  </Text>
                </div>

                {canCancelDesignation ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="cta"
                    disabled={cancelMutation.isPending}
                    aria-busy={isTargetPending}
                    aria-label={`${displayName} 지정 취소`}
                    onClick={() => setTargetMoverId(item.moverId)}
                    className="rounded-12 h-40 min-w-0 shrink-0 px-12 py-8"
                  >
                    지정 취소
                  </Button>
                ) : null}
              </li>
            );
          })}
        </ul>
      </section>

      <DesignatedMoverCancelConfirmModal
        open={targetItem !== null}
        moverDisplayName={targetDisplayName}
        isPending={cancelMutation.isPending}
        onClose={closeModal}
        onConfirm={() => {
          if (!targetMoverId || cancelMutation.isPending) {
            return;
          }
          cancelMutation.mutate({
            estimateRequestId,
            moverId: targetMoverId,
          });
        }}
      />

      {toastMessage ? <Toast onClose={() => setToastMessage(null)}>{toastMessage}</Toast> : null}
    </>
  );
}
