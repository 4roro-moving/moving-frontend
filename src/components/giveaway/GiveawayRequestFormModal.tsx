"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import FormField from "@/components/common/FormField/FormField";
import Textarea from "@/components/common/Input/Textarea";
import Modal, { RESPONSIVE_FORM_MODAL_PANEL_CLASSNAME } from "@/components/common/Modal/Modal";
import { Text } from "@/components/common/Text";
import { useGiveawayRequestForm } from "@/hooks/giveaway/useGiveawayRequestForm";
import { GIVEAWAY_REQUEST_MESSAGE_MAX_LENGTH } from "@/lib/constants/giveaway";
import type { GiveawayRequestFormValues } from "@/types/giveaway";

interface GiveawayRequestFormModalProps {
  open: boolean;
  mode: "create" | "edit";
  giveawayId: number;
  request?: GiveawayRequestFormValues | null;
  onClose: () => void;
  onSuccess?: () => void;
}

interface GiveawayRequestFormModalContentProps {
  open: boolean;
  mode: "create" | "edit";
  giveawayId: number;
  request?: GiveawayRequestFormValues;
  onClose: () => void;
  onSuccess?: () => void;
  onExitComplete?: () => void;
}

const GiveawayRequestFormModalContent = ({
  open,
  mode,
  giveawayId,
  request,
  onClose,
  onSuccess,
  onExitComplete,
}: GiveawayRequestFormModalContentProps) => {
  const t = useTranslations("giveaway");

  const {
    message,
    messageError,
    submitError,
    isSubmitting,
    isSubmitDisabled,
    handleClose,
    handleSubmit,
    handleMessageChange,
    handleMessageBlur,
  } = useGiveawayRequestForm({
    mode,
    giveawayId,
    request,
    onClose,
    onSuccess,
  });

  const title = mode === "create" ? t("requestCreateTitle") : t("requestEditTitle");
  const submitLabel = mode === "create" ? t("requestSubmit") : t("requestEditSubmit");
  const pendingLabel = mode === "create" ? t("requestSubmitting") : t("requestEditing");
  const fieldId =
    mode === "create" ? "giveaway-request-apply-message" : "giveaway-request-edit-message";

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
      <div className="flex w-full items-start justify-between gap-12">
        <Modal.Title>{title}</Modal.Title>
        <Modal.Close onClose={handleClose} disabled={isSubmitting} />
      </div>

      <FormField label={t("requestMessageLabel")} labelFor={fieldId} variant="compact">
        <Textarea
          id={fieldId}
          value={message}
          maxLength={GIVEAWAY_REQUEST_MESSAGE_MAX_LENGTH}
          disabled={isSubmitting}
          placeholder={t("requestMessagePlaceholder")}
          error={messageError}
          className="h-160"
          onChange={(event) => handleMessageChange(event.target.value)}
          onBlur={handleMessageBlur}
        />
      </FormField>

      {submitError ? (
        <Text as="p" variant="sm-medium" className="text-text-error w-full" role="alert">
          {submitError}
        </Text>
      ) : null}

      <Modal.Button fullWidth size="cta" disabled={isSubmitDisabled} onClick={handleSubmit}>
        {isSubmitting ? pendingLabel : submitLabel}
      </Modal.Button>
    </Modal>
  );
};

const GiveawayRequestFormModal = ({
  open,
  mode,
  giveawayId,
  request,
  onClose,
  onSuccess,
}: GiveawayRequestFormModalProps) => {
  const [formKey, setFormKey] = useState(0);
  const [cachedRequest, setCachedRequest] = useState(request);

  if (request !== undefined && request !== null && request !== cachedRequest) {
    setCachedRequest(request);
  }

  if (mode === "edit" && !cachedRequest) {
    return null;
  }

  return (
    <GiveawayRequestFormModalContent
      key={`${mode}-${String(cachedRequest?.id ?? giveawayId)}-${String(formKey)}`}
      open={open}
      mode={mode}
      giveawayId={giveawayId}
      request={cachedRequest ?? undefined}
      onClose={onClose}
      onSuccess={onSuccess}
      onExitComplete={() => setFormKey((current) => current + 1)}
    />
  );
};

export default GiveawayRequestFormModal;
