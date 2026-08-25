"use client";

import { useFormatter, useTranslations } from "next-intl";

import { useState } from "react";

import FormField from "@/components/common/FormField/FormField";
import Input from "@/components/common/Input/Input";
import Textarea from "@/components/common/Input/Textarea";
import Modal, { RESPONSIVE_FORM_MODAL_PANEL_CLASSNAME } from "@/components/common/Modal/Modal";
import { Text } from "@/components/common/Text";
import EstimateRequestSummaryContent from "@/components/estimate/EstimateRequestSummaryContent";
import { MAX_TEXT_CONTENT_LENGTH, MIN_TEXT_CONTENT_LENGTH } from "@/lib/constants/validation";
import type { MoverEstimateRequest, SendEstimateInput } from "@/types/moverEstimateRequest";

const MAX_PRICE = 100_000_000;

interface SendEstimateModalProps {
  open: boolean;
  request: MoverEstimateRequest;
  onClose: () => void;
  /** exit 모션 종료 후 부모 state(request) 정리용 */
  onExitComplete?: () => void;
  onSubmit: (input: SendEstimateInput) => void;
  isPending?: boolean;
}

export default function SendEstimateModal({
  open,
  request,
  onClose,
  onExitComplete,
  onSubmit,
  isPending = false,
}: SendEstimateModalProps) {
  const tr = useTranslations("estimates");
  const format = useFormatter();
  const [price, setPrice] = useState("");
  const [comment, setComment] = useState("");
  const [isCommentTouched, setIsCommentTouched] = useState(false);
  const [hasSubmissionStarted, setHasSubmissionStarted] = useState(false);
  const isSubmitting = isPending || (hasSubmissionStarted && !open);

  const handleClose = () => {
    if (isSubmitting) return;

    setPrice("");
    setComment("");
    setIsCommentTouched(false);
    setHasSubmissionStarted(false);
    onClose();
  };

  const numericPrice = Number(price);
  const trimmedComment = comment.trim();

  const isPriceValid = numericPrice > 0 && numericPrice <= MAX_PRICE;
  const isCommentValid =
    trimmedComment.length >= MIN_TEXT_CONTENT_LENGTH &&
    trimmedComment.length <= MAX_TEXT_CONTENT_LENGTH;

  const canSubmit = isPriceValid && isCommentValid && !isSubmitting;

  const priceError = price.length > 0 && !isPriceValid ? tr("mover.priceRangeError") : undefined;

  const commentError =
    isCommentTouched && !isCommentValid
      ? tr("mover.commentLength", { min: MIN_TEXT_CONTENT_LENGTH, max: MAX_TEXT_CONTENT_LENGTH })
      : undefined;

  const handleSubmit = () => {
    if (!canSubmit) return;

    setHasSubmissionStarted(true);
    onSubmit({
      price: numericPrice,
      comment: trimmedComment,
    });
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
        <Modal.Title>{tr("mover.sendTitle")}</Modal.Title>
        <Modal.Close onClose={handleClose} disabled={isSubmitting} />
      </div>

      <div className="flex min-h-0 w-full flex-1 flex-col gap-20 overflow-y-auto xl:gap-32">
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
          label={tr("mover.priceLabel")}
          labelFor="estimate-price"
          variant="compact"
          className="gap-16"
        >
          <Input
            id="estimate-price"
            inputMode="numeric"
            size="md"
            numericOnly
            value={price ? format.number(Number(price)) : ""}
            placeholder={tr("mover.pricePlaceholder")}
            disabled={isSubmitting}
            error={priceError}
            onChange={(event) => setPrice(event.target.value)}
            className="h-54 md:h-54"
          />
        </FormField>

        <FormField
          label={tr("mover.commentLabel")}
          labelFor="estimate-comment"
          variant="compact"
          className="gap-16"
        >
          <div className="flex w-full flex-col gap-8">
            <Textarea
              id="estimate-comment"
              value={comment}
              maxLength={MAX_TEXT_CONTENT_LENGTH}
              placeholder={tr("mover.commentPlaceholder", { min: MIN_TEXT_CONTENT_LENGTH })}
              error={commentError}
              disabled={isSubmitting}
              onChange={(event) => setComment(event.target.value)}
              onBlur={() => {
                setIsCommentTouched(true);
              }}
              className="h-160 resize-none"
            />

            <Text as="span" variant="xs-regular" className="text-text-muted self-end">
              {trimmedComment.length}/{MAX_TEXT_CONTENT_LENGTH}
            </Text>
          </div>
        </FormField>
      </div>

      <Modal.Button fullWidth size="cta" disabled={!canSubmit} onClick={handleSubmit}>
        {isSubmitting ? tr("mover.sending") : tr("mover.send")}
      </Modal.Button>
    </Modal>
  );
}
