"use client";

import { useState } from "react";

import FormField from "@/components/common/FormField/FormField";
import Modal, { RESPONSIVE_FORM_MODAL_PANEL_CLASSNAME } from "@/components/common/Modal/Modal";
import Select from "@/components/common/Select/Select";
import { Text } from "@/components/common/Text";
import ResidenceReviewFormFields from "@/components/residence-review/ResidenceReviewFormFields";
import { useResidenceReviewCreateForm } from "@/hooks/useResidenceReviewCreateForm";
import { REGION_OPTIONS, type RegionId } from "@/lib/constants/region";

interface ResidenceReviewCreateModalProps {
  open: boolean;
  defaultRegionId: RegionId | null;
  onClose: () => void;
  onSuccess?: () => void;
}

interface ResidenceReviewCreateModalContentProps {
  open: boolean;
  defaultRegionId: RegionId | null;
  onClose: () => void;
  onExitComplete?: () => void;
  onSuccess?: () => void;
}

const ResidenceReviewCreateModalContent = ({
  open,
  defaultRegionId,
  onClose,
  onExitComplete,
  onSuccess,
}: ResidenceReviewCreateModalContentProps) => {
  const {
    regionId,
    title,
    content,
    rating,
    titleError,
    contentError,
    regionError,
    submitError,
    contentLength,
    isSubmitting,
    isSubmitDisabled,
    handleClose,
    handleSubmit,
    handleRegionChange,
    handleTitleChange,
    handleTitleBlur,
    handleContentChange,
    handleContentBlur,
    handleRatingChange,
  } = useResidenceReviewCreateForm({
    defaultRegionId,
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
        <Modal.Title>후기 작성</Modal.Title>
        <Modal.Close onClose={handleClose} disabled={isSubmitting} />
      </div>

      <FormField
        label="지역을 선택해주세요."
        variant="compact"
        labelId="residence-review-create-region"
      >
        <Select
          label="지역"
          desc="지역"
          size="lg"
          columns={2}
          className="w-full"
          defaultValue={regionId !== null ? String(regionId) : undefined}
          error={regionError}
          disabled={isSubmitting}
          onChange={handleRegionChange}
        >
          {REGION_OPTIONS.map((region) => (
            <Select.Option key={region.value} value={String(region.value)}>
              {region.label}
            </Select.Option>
          ))}
        </Select>
      </FormField>

      <div className="flex min-h-0 w-full flex-1 flex-col gap-24 overflow-y-auto xl:gap-32">
        <ResidenceReviewFormFields
          title={title}
          content={content}
          rating={rating}
          titleError={titleError}
          contentError={contentError}
          contentLength={contentLength}
          isSubmitting={isSubmitting}
          onTitleChange={handleTitleChange}
          onTitleBlur={handleTitleBlur}
          onContentChange={handleContentChange}
          onContentBlur={handleContentBlur}
          onRatingChange={handleRatingChange}
        />
      </div>

      {submitError ? (
        <Text as="p" variant="sm-medium" className="text-text-error w-full" role="alert">
          {submitError}
        </Text>
      ) : null}

      <Modal.Button fullWidth size="cta" disabled={isSubmitDisabled} onClick={handleSubmit}>
        {isSubmitting ? "작성 중..." : "작성하기"}
      </Modal.Button>
    </Modal>
  );
};

const ResidenceReviewCreateModal = ({
  open,
  defaultRegionId,
  onClose,
  onSuccess,
}: ResidenceReviewCreateModalProps) => {
  const [formKey, setFormKey] = useState(0);

  return (
    <ResidenceReviewCreateModalContent
      key={formKey}
      open={open}
      defaultRegionId={defaultRegionId}
      onClose={onClose}
      onExitComplete={() => setFormKey((current) => current + 1)}
      onSuccess={onSuccess}
    />
  );
};

export default ResidenceReviewCreateModal;
