"use client";

import { useTranslations } from "next-intl";

import { useState } from "react";

import Textarea from "@/components/common/Input/Textarea";
import Modal, { RESPONSIVE_FORM_MODAL_PANEL_CLASSNAME } from "@/components/common/Modal/Modal";
import { Text } from "@/components/common/Text";
import FormField from "@/components/common/FormField/FormField";
import EstimateRequestSummaryContent from "@/components/estimate/EstimateRequestSummaryContent";
import { MAX_TEXT_CONTENT_LENGTH, MIN_TEXT_CONTENT_LENGTH } from "@/lib/constants/validation";
import type { MoverEstimateRequest } from "@/types/moverEstimateRequest";

interface RejectEstimateModalProps {
  open: boolean;
  request: MoverEstimateRequest;
  isPending?: boolean;
  onClose: () => void;
  onExitComplete?: () => void;
  onSubmit: (reason: string) => void;
}

export default function RejectEstimateModal({
  open,
  request,
  isPending = false,
  onClose,
  onExitComplete,
  onSubmit,
}: RejectEstimateModalProps) {
  const tr = useTranslations("estimates");
  const [reason, setReason] = useState("");
  const [isReasonTouched, setIsReasonTouched] = useState(false);
  const [hasSubmissionStarted, setHasSubmissionStarted] = useState(false);
  const isSubmitting = isPending || (hasSubmissionStarted && !open);

  const handleClose = () => {
    if (isSubmitting) return;
    setReason("");
    setIsReasonTouched(false);
    setHasSubmissionStarted(false);
    onClose();
  };

  const trimmedReason = reason.trim();
  const isReasonValid =
    trimmedReason.length >= MIN_TEXT_CONTENT_LENGTH &&
    trimmedReason.length <= MAX_TEXT_CONTENT_LENGTH;
  const reasonError =
    isReasonTouched && !isReasonValid
      ? tr("mover.rejectReasonLength", {
          min: MIN_TEXT_CONTENT_LENGTH,
          max: MAX_TEXT_CONTENT_LENGTH,
        })
      : undefined;

  const handleSubmit = () => {
    if (!isReasonValid || isSubmitting) return;

    setHasSubmissionStarted(true);
    onSubmit(trimmedReason);
  };

  return (
    <Modal
      open={open}
      onClose={isSubmitting ? undefined : handleClose}
      onExitComplete={onExitComplete}
      presentation="responsive"
      size="lg"
      className={RESPONSIVE_FORM_MODAL_PANEL_CLASSNAME}
      dismissible={false}
    >
      <div className="flex w-full shrink-0 items-center justify-between gap-16">
        <Modal.Title>{tr("mover.rejectTitle")}</Modal.Title>
        <Modal.Close onClose={handleClose} disabled={isSubmitting} />
      </div>

      <div className="flex min-h-0 w-full flex-1 flex-col gap-16 overflow-y-auto">
        <section>
          <EstimateRequestSummaryContent
            density="modal"
            moveType={request.moveType}
            isDesignated={request.isDesignated}
            title={tr("mover.customerName", { name: request.customer.name })}
            fromLabel={request.fromRegion}
            toLabel={request.toRegion}
            moveDate={request.moveDate}
          />
        </section>

        <FormField
          label={tr("mover.rejectReasonLabel")}
          labelFor="reject-reason"
          variant="compact"
          className="gap-16"
        >
          <div className="flex w-full flex-col gap-8">
            <Textarea
              id="reject-reason"
              value={reason}
              maxLength={MAX_TEXT_CONTENT_LENGTH}
              placeholder={tr("mover.commentPlaceholder", { min: MIN_TEXT_CONTENT_LENGTH })}
              error={reasonError}
              disabled={isSubmitting}
              onChange={(event) => setReason(event.target.value)}
              onBlur={() => {
                setIsReasonTouched(true);
              }}
              className="h-160 resize-none px-24 py-14 text-lg"
            />
            <Text as="span" variant="xs-regular" className="text-text-muted self-end">
              {trimmedReason.length}/{MAX_TEXT_CONTENT_LENGTH}
            </Text>
          </div>
        </FormField>
      </div>

      <Modal.Button
        fullWidth
        size="cta"
        disabled={!isReasonValid || isSubmitting}
        onClick={handleSubmit}
      >
        {isSubmitting ? tr("mover.rejecting") : tr("mover.reject")}
      </Modal.Button>
    </Modal>
  );
}
