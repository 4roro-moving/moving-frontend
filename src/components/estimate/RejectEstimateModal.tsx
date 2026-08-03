"use client";

import { useState } from "react";

import Textarea from "@/components/common/Input/Textarea";
import Modal, { RESPONSIVE_FORM_MODAL_PANEL_CLASSNAME } from "@/components/common/Modal/Modal";
import { Text } from "@/components/common/Text";
import FormField from "@/components/common/FormField/FormField";
import EstimateRequestSummaryContent from "@/components/estimate/EstimateRequestSummaryContent";
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
  const [isReasonTouched, setIsReasonTouched] = useState(false);
  const trimmedReason = reason.trim();
  const isReasonValid =
    trimmedReason.length >= MIN_REASON_LENGTH && trimmedReason.length <= MAX_REASON_LENGTH;
  const reasonError =
    isReasonTouched && !isReasonValid
      ? `반려 사유는 ${MIN_REASON_LENGTH}자 이상 ${MAX_REASON_LENGTH}자 이하로 입력해 주세요.`
      : undefined;

  return (
    <Modal
      onClose={isPending ? undefined : onClose}
      presentation="responsive"
      size="lg"
      className={RESPONSIVE_FORM_MODAL_PANEL_CLASSNAME}
    >
      <div className="flex w-full shrink-0 items-center justify-between gap-16">
        <Modal.Title>제안 반려</Modal.Title>
        <Modal.Close onClose={onClose} disabled={isPending} />
      </div>

      <div className="flex min-h-0 w-full flex-1 flex-col gap-16 overflow-y-auto">
        <section>
          <EstimateRequestSummaryContent
            density="modal"
            moveType={request.moveType}
            isDesignated={request.isDesignated}
            title={`${request.customer.name} 고객님`}
            fromLabel={request.fromRegion}
            toLabel={request.toRegion}
            moveDate={request.moveDate}
          />
        </section>

        <FormField
          label="반려 사유를 입력해 주세요"
          labelFor="reject-reason"
          variant="compact"
          className="gap-16"
        >
          <div className="flex w-full flex-col gap-8">
            <Textarea
              id="reject-reason"
              autoFocus
              value={reason}
              maxLength={MAX_REASON_LENGTH}
              placeholder="최소 10자 이상 입력해 주세요"
              error={reasonError}
              disabled={isPending}
              onChange={(event) => setReason(event.target.value)}
              onBlur={(event) => {
                if ((event.relatedTarget as HTMLElement | null)?.ariaLabel !== "모달 닫기") {
                  setIsReasonTouched(true);
                }
              }}
              className="h-[160px] resize-none px-24 py-14 text-lg"
            />
            <Text as="span" variant="xs-regular" className="text-text-muted self-end">
              {reason.length}/{MAX_REASON_LENGTH}
            </Text>
          </div>
        </FormField>
      </div>

      <Modal.Button
        fullWidth
        size="cta"
        disabled={!isReasonValid || isPending}
        onClick={() => isReasonValid && onSubmit(trimmedReason)}
      >
        {isPending ? "반려하는 중..." : "반려하기"}
      </Modal.Button>
    </Modal>
  );
}
