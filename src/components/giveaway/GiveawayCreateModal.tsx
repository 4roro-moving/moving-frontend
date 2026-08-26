"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Controller } from "react-hook-form";

import FormField from "@/components/common/FormField/FormField";
import Input from "@/components/common/Input/Input";
import Textarea from "@/components/common/Input/Textarea";
import Modal, { RESPONSIVE_FORM_MODAL_PANEL_CLASSNAME } from "@/components/common/Modal/Modal";
import Select from "@/components/common/Select/Select";
import { Text } from "@/components/common/Text";
import GiveawayCreateImageField from "@/components/giveaway/GiveawayCreateImageField";
import { useGiveawayCreateForm } from "@/hooks/giveaway/useGiveawayCreateForm";
import { APP_ROUTES } from "@/lib/constants/appRoutes";
import {
  GIVEAWAY_DESCRIPTION_MAX_LENGTH,
  GIVEAWAY_TITLE_MAX_LENGTH,
} from "@/lib/constants/giveaway";
import { isRegionId, REGION_OPTIONS } from "@/lib/constants/region";
import type { GiveawayDetail } from "@/types/giveaway";

interface GiveawayCreateModalProps {
  open: boolean;
  onClose: () => void;
  giveaway?: GiveawayDetail;
}

interface GiveawayCreateModalContentProps {
  open: boolean;
  onClose: () => void;
  giveaway?: GiveawayDetail;
  onExitComplete?: () => void;
}

const GiveawayCreateModalContent = ({
  open,
  onClose,
  giveaway,
  onExitComplete,
}: GiveawayCreateModalContentProps) => {
  const t = useTranslations("giveaway");
  const router = useRouter();
  const {
    isEdit,
    register,
    control,
    regionError,
    titleError,
    descriptionError,
    imageWarning,
    submitError,
    isPending,
    isSubmitDisabled,
    handleClose,
    handleAddImages,
    handleRemoveImage,
    handleSubmit,
  } = useGiveawayCreateForm({
    giveaway,
    onClose,
    onSuccess: (savedGiveaway) => {
      if (!isEdit) {
        router.push(APP_ROUTES.COMMUNITY.GIVEAWAY_DETAIL(savedGiveaway.id));
      }
    },
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
        <Modal.Title>{isEdit ? t("editTitle") : t("createTitle")}</Modal.Title>
        <Modal.Close onClose={handleClose} disabled={isPending} />
      </div>

      <FormField label={t("regionPrompt")} variant="compact" labelId="giveaway-create-region">
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
                  {region.label}
                </Select.Option>
              ))}
            </Select>
          )}
        />
      </FormField>

      <div className="flex min-h-0 w-full flex-1 flex-col gap-24 overflow-y-auto xl:gap-32">
        <Controller
          name="images"
          control={control}
          render={({ field, fieldState }) => (
            <GiveawayCreateImageField
              images={field.value}
              error={fieldState.error?.message ?? imageWarning}
              disabled={isPending}
              onAdd={handleAddImages}
              onRemove={handleRemoveImage}
            />
          )}
        />

        <FormField label={t("itemNameLabel")} labelFor="giveaway-create-title" variant="compact">
          <Input
            id="giveaway-create-title"
            size="md"
            maxLength={GIVEAWAY_TITLE_MAX_LENGTH}
            disabled={isPending}
            placeholder={t("titlePlaceholder")}
            error={titleError}
            {...register("title")}
          />
        </FormField>

        <FormField
          label={t("descriptionLabel")}
          labelFor="giveaway-create-description"
          variant="compact"
        >
          <Textarea
            id="giveaway-create-description"
            maxLength={GIVEAWAY_DESCRIPTION_MAX_LENGTH}
            disabled={isPending}
            placeholder={t("descriptionPlaceholder")}
            error={descriptionError}
            className="h-160"
            {...register("description")}
          />
        </FormField>
      </div>

      {submitError ? (
        <Text as="p" variant="sm-medium" className="text-text-error w-full" role="alert">
          {submitError}
        </Text>
      ) : null}

      <Modal.Button fullWidth size="cta" disabled={isSubmitDisabled} onClick={handleSubmit}>
        {isPending ? (isEdit ? t("editing") : t("creating")) : isEdit ? t("edit") : t("create")}
      </Modal.Button>
    </Modal>
  );
};

const GiveawayCreateModal = ({ open, onClose, giveaway }: GiveawayCreateModalProps) => {
  const [formKey, setFormKey] = useState(0);

  return (
    <GiveawayCreateModalContent
      key={`${giveaway ? String(giveaway.id) : "create"}-${String(formKey)}`}
      open={open}
      onClose={onClose}
      giveaway={giveaway}
      onExitComplete={() => setFormKey((current) => current + 1)}
    />
  );
};

export default GiveawayCreateModal;
