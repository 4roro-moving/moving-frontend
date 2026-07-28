"use client";

import { useState } from "react";

import Textarea from "@/components/common/Input/Textarea";
import Modal from "@/components/common/Modal";
import { Text } from "@/components/common/Text";
import type { MoverEstimateRequest } from "@/types/moverEstimateRequest";

const MIN_REASON_LENGTH = 10;
const MAX_REASON_LENGTH = 1000;

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
      open
      title="제안 반려"
      confirmLabel={isPending ? "반려하는 중..." : "반려하기"}
      confirmDisabled={!isReasonValid || isPending}
      onConfirm={() => isReasonValid && onSubmit(trimmedReason)}
      onClose={onClose}
      overlayClassName="items-end px-0 min-[744px]:items-center min-[744px]:px-24"
      className="min-[744px]:rounded-32 max-w-none rounded-b-none min-[744px]:w-[375px] lg:w-full lg:max-w-[608px]"
    >
      <div className="flex flex-col gap-16">
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
    </Modal>
  );
}
