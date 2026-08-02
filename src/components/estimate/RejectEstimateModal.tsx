"use client";

import { useState } from "react";

import Textarea from "@/components/common/Input/Textarea";
import Modal from "@/components/common/Modal/Modal";
import { Text } from "@/components/common/Text";
import { cn } from "@/lib/utils/cn";
import type { MoverEstimateRequest } from "@/types/moverEstimateRequest";

const MIN_REASON_LENGTH = 10;
const MAX_REASON_LENGTH = 1000;

const PANEL_CLASSNAME = cn("items-stretch text-left overflow-hidden", "gap-40 px-24 pt-32 pb-40");

interface RejectEstimateModalProps {
  request: MoverEstimateRequest;
  isPending?: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
}

export default function RejectEstimateModal({
  request,
  isPending = false,
  onClose,
  onSubmit,
}: RejectEstimateModalProps) {
  const [reason, setReason] = useState("");
  const trimmedReason = reason.trim();
  const isReasonValid =
    trimmedReason.length >= MIN_REASON_LENGTH && trimmedReason.length <= MAX_REASON_LENGTH;
  const reasonError =
    reason.length > 0 && !isReasonValid
      ? `반려 사유는 ${MIN_REASON_LENGTH}자 이상 ${MAX_REASON_LENGTH}자 이하로 입력해 주세요.`
      : undefined;

  return (
    <Modal
      onClose={isPending ? undefined : onClose}
      presentation="responsive"
      size="lg"
      className={PANEL_CLASSNAME}
    >
      <div className="flex w-full shrink-0 items-center justify-between gap-16">
        <Modal.Title>제안 반려</Modal.Title>
        <Modal.Close onClose={onClose} disabled={isPending} />
      </div>

      <div className="flex min-h-0 w-full flex-1 flex-col gap-16 overflow-hidden">
        <Text as="p" variant="lg-regular" className="text-text-secondary">
          {request.customer.name} 고객님의 요청을 반려하는 이유를 입력해 주세요.
        </Text>
        <div className="flex flex-col gap-8">
          <Text as="label" htmlFor="reject-reason" variant="2lg-semibold">
            반려 사유
          </Text>
          <Textarea
            id="reject-reason"
            autoFocus
            value={reason}
            maxLength={MAX_REASON_LENGTH}
            placeholder="최소 10자 이상 입력해 주세요."
            error={reasonError}
            disabled={isPending}
            onChange={(event) => setReason(event.target.value)}
            className="h-[160px] resize-none px-24 py-14 text-lg"
          />
          <Text as="span" variant="xs-regular" className="text-text-muted self-end">
            {trimmedReason.length}/{MAX_REASON_LENGTH}
          </Text>
        </div>
      </div>

      <Modal.Button
        fullWidth
        size="detail"
        disabled={!isReasonValid || isPending}
        onClick={() => isReasonValid && onSubmit(trimmedReason)}
      >
        {isPending ? "반려하는 중..." : "반려하기"}
      </Modal.Button>
    </Modal>
  );
}
