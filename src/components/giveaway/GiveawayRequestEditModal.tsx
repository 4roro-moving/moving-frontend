"use client";

import { useState } from "react";

import FormField from "@/components/common/FormField/FormField";
import Textarea from "@/components/common/Input/Textarea";
import Modal, { RESPONSIVE_FORM_MODAL_PANEL_CLASSNAME } from "@/components/common/Modal/Modal";
import { Text } from "@/components/common/Text";
import { useGiveawayRequestEditForm } from "@/hooks/giveaway/useGiveawayRequestEditForm";
import { GIVEAWAY_REQUEST_MESSAGE_MAX_LENGTH } from "@/lib/constants/giveaway";
import type { MyGiveawayRequestItem } from "@/types/giveaway";

interface GiveawayRequestEditModalProps {
  open: boolean;
  request: MyGiveawayRequestItem | null;
  onClose: () => void;
  onSuccess?: () => void;
}

interface GiveawayRequestEditModalContentProps {
  open: boolean;
  request: MyGiveawayRequestItem;
  onClose: () => void;
  onSuccess?: () => void;
  onExitComplete?: () => void;
}

const GiveawayRequestEditModalContent = ({
  open,
  request,
  onClose,
  onSuccess,
  onExitComplete,
}: GiveawayRequestEditModalContentProps) => {
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
  } = useGiveawayRequestEditForm({
    request,
    onClose,
    onSuccess,
  });

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
        <Modal.Title>신청 내용 수정</Modal.Title>
        <Modal.Close onClose={handleClose} disabled={isSubmitting} />
      </div>

      <FormField
        label="신청 내용을 작성해 주세요"
        labelFor="giveaway-request-edit-message"
        variant="compact"
      >
        <Textarea
          id="giveaway-request-edit-message"
          value={message}
          maxLength={GIVEAWAY_REQUEST_MESSAGE_MAX_LENGTH}
          disabled={isSubmitting}
          placeholder="나눔 받고 싶은 이유를 적어 주세요"
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
        {isSubmitting ? "수정 중..." : "수정하기"}
      </Modal.Button>
    </Modal>
  );
};

const GiveawayRequestEditModal = ({
  open,
  request,
  onClose,
  onSuccess,
}: GiveawayRequestEditModalProps) => {
  const [formKey, setFormKey] = useState(0);
  const [cachedRequest, setCachedRequest] = useState(request);

  if (request !== null && request !== cachedRequest) {
    setCachedRequest(request);
  }

  if (!cachedRequest) {
    return null;
  }

  return (
    <GiveawayRequestEditModalContent
      key={`${String(cachedRequest.id)}-${String(formKey)}`}
      open={open}
      request={cachedRequest}
      onClose={onClose}
      onSuccess={onSuccess}
      onExitComplete={() => setFormKey((current) => current + 1)}
    />
  );
};

export default GiveawayRequestEditModal;
