"use client";

import { useTranslations } from "next-intl";

import { useState } from "react";
import { Controller } from "react-hook-form";

import FormField from "@/components/common/FormField/FormField";
import Modal, { RESPONSIVE_FORM_MODAL_PANEL_CLASSNAME } from "@/components/common/Modal/Modal";
import Select from "@/components/common/Select/Select";
import { Text } from "@/components/common/Text";
import ResidenceReviewFormFields from "@/components/residence-review/ResidenceReviewFormFields";
import { useResidenceReviewCreateForm } from "@/hooks/residence-review/useResidenceReviewCreateForm";
import { isRegionId, REGION_OPTIONS } from "@/lib/constants/region";

interface ResidenceReviewCreateModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface ResidenceReviewCreateModalContentProps {
  open: boolean;
  onClose: () => void;
  onExitComplete?: () => void;
  onSuccess?: () => void;
}

const ResidenceReviewCreateModalContent = ({
  open,
  onClose,
  onExitComplete,
  onSuccess,
}: ResidenceReviewCreateModalContentProps) => {
  const t = useTranslations("residenceReview");
  const {
    register,
    control,
    regionError,
    titleError,
    contentError,
    submitError,
    isPending,
    isSubmitDisabled,
    handleClose,
    handleSubmit,
  } = useResidenceReviewCreateForm({
    onClose,
    onSuccess,
  });

  return (
    <Modal
      open={open}
      onClose={isPending ? undefined : handleClose}
      onExitComplete={onExitComplete}
      presentation="responsive"
      size="lg"
      className={RESPONSIVE_FORM_MODAL_PANEL_CLASSNAME}
      dismissible={false}
    >
      <div className="flex w-full items-start justify-between gap-12">
        <Modal.Title>{t("createTitle")}</Modal.Title>
        <Modal.Close onClose={handleClose} disabled={isPending} />
      </div>

      <FormField
        label={t("selectRegion")}
        variant="compact"
        labelId="residence-review-create-region"
      >
        <Controller
          name="regionId"
          control={control}
          render={({ field }) => (
            <Select
              label={t("region")}
              desc={t("region")}
              size="lg"
              columns={2}
              className="w-full"
              defaultValue={field.value !== null ? String(field.value) : undefined}
              error={regionError}
              disabled={isPending}
              onChange={(value) => {
                const parsed = Number(value);
                field.onChange(isRegionId(parsed) ? parsed : null);
              }}
            >
              {REGION_OPTIONS.map((region) => (
                <Select.Option key={region.value} value={String(region.value)}>
                  {t(`regions.${region.value}`)}
                </Select.Option>
              ))}
            </Select>
          )}
        />
      </FormField>

      <div className="flex min-h-0 w-full flex-1 flex-col gap-24 overflow-y-auto xl:gap-32">
        <ResidenceReviewFormFields
          register={register}
          control={control}
          titleError={titleError}
          contentError={contentError}
          isPending={isPending}
        />
      </div>

      {submitError ? (
        <Text as="p" variant="sm-medium" className="text-text-error w-full" role="alert">
          {submitError}
        </Text>
      ) : null}

      <Modal.Button fullWidth size="cta" disabled={isSubmitDisabled} onClick={handleSubmit}>
        {isPending ? t("creating") : t("create")}
      </Modal.Button>
    </Modal>
  );
};

const ResidenceReviewCreateModal = ({
  open,
  onClose,
  onSuccess,
}: ResidenceReviewCreateModalProps) => {
  const [formKey, setFormKey] = useState(0);

  return (
    <ResidenceReviewCreateModalContent
      key={formKey}
      open={open}
      onClose={onClose}
      onExitComplete={() => setFormKey((current) => current + 1)}
      onSuccess={onSuccess}
    />
  );
};

export default ResidenceReviewCreateModal;
