"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { type ChangeEvent, type FormEvent, useEffect, useRef, useState } from "react";

import Modal from "@/components/common/Modal/Modal";
import Select from "@/components/common/Select/Select";
import { Text } from "@/components/common/Text";
import { useCreateReport } from "@/hooks/report/useCreateReport";
import { cn } from "@/lib/utils/cn";
import {
  REPORT_DESCRIPTION_MAX_LENGTH,
  REPORT_IMAGE_MAX_COUNT,
  REPORT_IMAGE_MAX_SIZE,
  type ReportReason,
  type ReportTargetType,
} from "@/types/report";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetType: ReportTargetType;
  targetId: string;
  targetName?: string;
}

interface ImagePreview {
  file: File;
  url: string;
}

const REPORT_REASON_VALUES: ReportReason[] = [
  "SPAM",
  "ABUSE",
  "INAPPROPRIATE",
  "FALSE_INFO",
  "OTHER",
];

const REASON_KEY: Record<ReportReason, string> = {
  SPAM: "spam",
  ABUSE: "abuse",
  FALSE_INFO: "falseInfo",
  INAPPROPRIATE: "inappropriate",
  PRIVACY: "privacy",
  OTHER: "other",
};

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

const ReportModal = ({ isOpen, onClose, targetType, targetId, targetName }: ReportModalProps) => {
  const t = useTranslations("report");
  const tCommon = useTranslations("common");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imagesRef = useRef<ImagePreview[]>([]);

  const [reason, setReason] = useState<ReportReason | "">("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<ImagePreview[]>([]);
  const [validationMessage, setValidationMessage] = useState<string | null>(null);

  const createMutation = useCreateReport();
  const trimmedDescription = description.trim();
  const isOtherReason = reason === "OTHER";
  const canSubmit =
    reason !== "" && (!isOtherReason || trimmedDescription.length > 0) && !createMutation.isPending;

  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  useEffect(() => {
    return () => {
      imagesRef.current.forEach(({ url }) => URL.revokeObjectURL(url));
    };
  }, []);

  const resetForm = () => {
    imagesRef.current.forEach(({ url }) => URL.revokeObjectURL(url));
    imagesRef.current = [];
    setReason("");
    setDescription("");
    setImages([]);
    setValidationMessage(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    createMutation.reset();
  };

  const handleClose = () => {
    if (createMutation.isPending) return;
    resetForm();
    onClose();
  };

  const handleReasonChange = (value: string) => {
    const nextReason = REPORT_REASON_VALUES.find((option) => option === value);
    if (!nextReason) return;
    setReason(nextReason);
    setValidationMessage(null);
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? []);
    setValidationMessage(null);

    if (selectedFiles.length === 0) return;

    if (images.length + selectedFiles.length > REPORT_IMAGE_MAX_COUNT) {
      setValidationMessage(t("modal.validation.maxImages", { count: REPORT_IMAGE_MAX_COUNT }));
      event.target.value = "";
      return;
    }

    const invalidTypeFile = selectedFiles.find(
      (file) => !ACCEPTED_IMAGE_TYPES.includes(file.type as (typeof ACCEPTED_IMAGE_TYPES)[number]),
    );

    if (invalidTypeFile) {
      setValidationMessage(t("modal.validation.imageType"));
      event.target.value = "";
      return;
    }

    const oversizedFile = selectedFiles.find((file) => file.size > REPORT_IMAGE_MAX_SIZE);
    if (oversizedFile) {
      setValidationMessage(t("modal.validation.imageSize"));
      event.target.value = "";
      return;
    }

    const nextImages = selectedFiles.map((file) => ({ file, url: URL.createObjectURL(file) }));
    setImages((current) => [...current, ...nextImages]);
    event.target.value = "";
  };

  const handleRemoveImage = (index: number) => {
    setImages((current) => {
      const targetImage = current[index];
      if (targetImage) URL.revokeObjectURL(targetImage.url);
      return current.filter((_, imageIndex) => imageIndex !== index);
    });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!reason || !canSubmit) return;

    setValidationMessage(null);
    createMutation.mutate(
      {
        targetType,
        targetId,
        reason,
        description: trimmedDescription.length > 0 ? trimmedDescription : undefined,
        images: images.map(({ file }) => file),
      },
      {
        onSuccess: () => {
          resetForm();
          onClose();
        },
      },
    );
  };

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      presentation="responsive"
      dismissible={!createMutation.isPending}
      className={cn("items-stretch gap-0 p-0", "md:max-w-[720px]", "xl:w-full xl:max-w-[720px]")}
      aria-label={t("modal.ariaLabel")}
    >
      <div className="border-border-default flex items-center justify-between border-b px-20 py-18 md:px-24">
        <div className="flex flex-col gap-4">
          <Modal.Title className="text-text-primary">{t("modal.title")}</Modal.Title>
          <Text as="p" variant="xs-regular" className="text-text-secondary">
            {t("modal.description")}
          </Text>
        </div>
        <Modal.Close onClose={handleClose} disabled={createMutation.isPending} size="sm" />
      </div>

      <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
        <div className="flex flex-col gap-20 overflow-y-auto px-20 py-20 md:px-24 md:py-24">
          {targetName && (
            <div className="border-border-default bg-background-subtle rounded-8 flex flex-col gap-4 border px-14 py-12">
              <Text as="span" variant="xs-regular" className="text-text-secondary">
                {t("modal.target")}
              </Text>
              <Text as="span" variant="sm-semibold" className="text-text-primary">
                {targetName}
              </Text>
            </div>
          )}

          <div className="flex flex-col gap-8">
            <Text as="span" variant="xs-semibold" className="text-text-primary">
              {t("modal.reasonLabel")}
            </Text>
            <Select
              desc={t("modal.reasonPlaceholder")}
              label={t("modal.reasonLabel")}
              defaultValue={reason}
              onChange={handleReasonChange}
              disabled={createMutation.isPending}
              className={cn(
                "w-full",
                "[&_button[role=combobox]]:h-48",
                "[&_button[role=combobox]]:w-full",
                "[&_button[role=combobox]]:rounded-8",
                "[&_button[role=combobox]]:px-14",
                "[&_button[role=combobox]]:py-0",
                "xl:[&_button[role=combobox]]:h-48",
                "xl:[&_button[role=combobox]]:rounded-8",
                "xl:[&_button[role=combobox]]:px-14",
                "xl:[&_button[role=combobox]]:py-0",
              )}
            >
              {REPORT_REASON_VALUES.map((value) => (
                <Select.Option key={value} value={value}>
                  {t(`reasons.${REASON_KEY[value]}`)}
                </Select.Option>
              ))}
            </Select>
          </div>

          <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between gap-12">
              <label htmlFor="report-description">
                <Text as="span" variant="xs-semibold" className="text-text-primary">
                  {t("modal.detailLabel")}
                  {isOtherReason && <span className="text-text-brand ml-4">*</span>}
                </Text>
              </label>
              <Text as="span" variant="xs-regular" className="text-text-muted">
                {description.length}/{REPORT_DESCRIPTION_MAX_LENGTH}
              </Text>
            </div>

            <textarea
              id="report-description"
              value={description}
              onChange={(event) =>
                setDescription(event.target.value.slice(0, REPORT_DESCRIPTION_MAX_LENGTH))
              }
              placeholder={
                isOtherReason
                  ? t("modal.detailPlaceholderRequired")
                  : t("modal.detailPlaceholderOptional")
              }
              disabled={createMutation.isPending}
              rows={5}
              maxLength={REPORT_DESCRIPTION_MAX_LENGTH}
              className={cn(
                "border-border-default bg-background-surface",
                "text-text-primary placeholder:text-text-muted",
                "rounded-8 min-h-[132px] w-full resize-none border",
                "px-14 py-14",
                "transition-colors outline-none",
                "focus:border-border-brand",
                "disabled:bg-background-disabled disabled:cursor-not-allowed",
              )}
            />

            {isOtherReason && (
              <Text as="p" variant="xs-regular" className="text-text-secondary">
                {t("modal.otherReasonHelper")}
              </Text>
            )}
          </div>

          <div className="flex flex-col gap-8">
            <div className="flex items-end justify-between gap-12">
              <div className="flex flex-col gap-4">
                <Text as="span" variant="xs-semibold" className="text-text-primary">
                  {t("modal.imageLabel")}
                </Text>
                <Text as="p" variant="xs-regular" className="text-text-secondary">
                  {t("modal.imageHelper")}
                </Text>
              </div>
              <Text as="span" variant="xs-regular" className="text-text-muted">
                {images.length}/{REPORT_IMAGE_MAX_COUNT}
              </Text>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={handleImageChange}
              disabled={createMutation.isPending || images.length >= REPORT_IMAGE_MAX_COUNT}
              className="sr-only"
            />

            <div className="flex flex-wrap gap-8">
              {images.map((image, index) => (
                <div
                  key={`${image.file.name}-${image.file.lastModified}-${index}`}
                  className="border-border-default bg-background-subtle rounded-8 relative h-80 w-80 overflow-hidden border"
                >
                  <Image
                    src={image.url}
                    alt={t("modal.attachmentAlt", { index: index + 1 })}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    disabled={createMutation.isPending}
                    aria-label={t("modal.removeAttachmentAria", { index: index + 1 })}
                    className={cn(
                      "absolute top-4 right-4",
                      "flex h-20 w-20 items-center justify-center rounded-full",
                      "bg-black/60 text-white",
                      "disabled:cursor-not-allowed disabled:opacity-50",
                    )}
                  >
                    ×
                  </button>
                </div>
              ))}

              {images.length < REPORT_IMAGE_MAX_COUNT && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={createMutation.isPending}
                  className={cn(
                    "border-border-default bg-background-surface",
                    "text-text-secondary",
                    "flex h-80 w-80 flex-col items-center justify-center gap-2",
                    "rounded-8 border border-dashed",
                    "transition-colors",
                    "hover:border-border-brand hover:text-text-brand",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                  )}
                >
                  <Text as="span" variant="lg-regular">
                    +
                  </Text>
                  <Text as="span" variant="xs-regular">
                    {t("modal.addImage")}
                  </Text>
                </button>
              )}
            </div>
          </div>

          {validationMessage && (
            <Text as="p" variant="xs-regular" className="text-text-error" role="alert">
              {validationMessage}
            </Text>
          )}

          {createMutation.isError && (
            <Text as="p" variant="xs-regular" className="text-text-error" role="alert">
              {t("modal.submitFailed")}
            </Text>
          )}
        </div>

        <div className="border-border-default flex items-center justify-between gap-12 border-t px-20 py-16 md:px-24">
          <button
            type="button"
            onClick={handleClose}
            disabled={createMutation.isPending}
            className={cn(
              "border-border-default bg-background-surface text-text-primary",
              "rounded-8 h-48 min-w-[100px] border px-20",
              "disabled:cursor-not-allowed disabled:opacity-50",
            )}
          >
            <Text as="span" variant="md-semibold">
              {tCommon("cancel")}
            </Text>
          </button>

          <button
            type="submit"
            disabled={!canSubmit}
            className={cn(
              "rounded-8 h-48 min-w-[160px] px-24",
              "transition-colors",
              canSubmit
                ? "bg-background-brand text-text-inverse"
                : "bg-background-disabled text-text-disabled cursor-not-allowed",
            )}
          >
            <Text as="span" variant="md-semibold">
              {createMutation.isPending ? t("modal.submitting") : t("modal.submit")}
            </Text>
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ReportModal;
