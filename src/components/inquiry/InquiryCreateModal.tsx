"use client";

import { type FormEvent, useState } from "react";
import { useTranslations } from "next-intl";

import Modal from "@/components/common/Modal/Modal";
import Select from "@/components/common/Select/Select";
import { Text } from "@/components/common/Text";
import { useCreateInquiry } from "@/hooks/inquiry/useCreateInquiry";
import { cn } from "@/lib/utils/cn";
import type { InquiryCategory } from "@/types/inquiry";

interface InquiryCreateModalProps {
  isOpen: boolean;
  isSuspensionAppealAccess?: boolean;
  onClose: () => void;
}

const InquiryCreateModal = ({
  isOpen,
  isSuspensionAppealAccess = false,
  onClose,
}: InquiryCreateModalProps) => {
  const t = useTranslations("supportInquiry");
  const [category, setCategory] = useState<InquiryCategory | "">("");

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const createMutation = useCreateInquiry();

  const resetForm = () => {
    setCategory("");
    setTitle("");
    setContent("");
  };

  const handleClose = () => {
    if (createMutation.isPending) {
      return;
    }

    resetForm();
    onClose();
  };

  const trimmedTitle = title.trim();
  const trimmedContent = content.trim();

  const effectiveCategory: InquiryCategory | "" = isSuspensionAppealAccess
    ? "SUSPENSION_APPEAL"
    : category;
  const hasCategory = effectiveCategory !== "";

  const categoryOptions: { value: InquiryCategory; label: string }[] = [
    { value: "SERVICE", label: t("categories.SERVICE") },
    { value: "ACCOUNT", label: t("categories.ACCOUNT") },
    { value: "SUSPENSION_APPEAL", label: t("categories.SUSPENSION_APPEAL") },
    { value: "ETC", label: t("categories.ETC") },
  ];

  const canSubmit =
    hasCategory &&
    trimmedTitle.length > 0 &&
    trimmedContent.length > 0 &&
    !createMutation.isPending;

  const handleCategoryChange = (value: string) => {
    const nextCategory = categoryOptions.find((option) => option.value === value)?.value;

    if (!nextCategory) {
      return;
    }

    setCategory(nextCategory);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!effectiveCategory || !trimmedTitle || !trimmedContent || createMutation.isPending) {
      return;
    }

    createMutation.mutate(
      {
        category: effectiveCategory,
        title: trimmedTitle,
        content: trimmedContent,
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
      dismissible={false}
      className={cn("items-stretch gap-0 p-0", "md:max-w-[720px]", "xl:w-full xl:max-w-[720px]")}
      aria-label={t("create")}
    >
      <div className="border-border-default flex items-center justify-between border-b px-20 py-18 md:px-24">
        <div className="flex flex-col gap-4">
          <Modal.Title className="text-text-primary">{t("create")}</Modal.Title>

          <Text as="p" variant="xs-regular" className="text-text-secondary">
            {t("createDescription")}
          </Text>
        </div>

        <Modal.Close onClose={handleClose} disabled={createMutation.isPending} size="sm" />
      </div>

      <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
        <div className="flex flex-col gap-20 overflow-y-auto px-20 py-20 md:px-24 md:py-24">
          {!isSuspensionAppealAccess ? (
            <div className="flex flex-col gap-8">
              <Text as="span" variant="xs-semibold" className="text-text-primary">
                {t("categoryLabel")}
              </Text>

              <Select
                desc={t("categoryPlaceholder")}
                label={t("categoryLabel")}
                defaultValue={category}
                onChange={handleCategoryChange}
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
                {categoryOptions.map((option) => (
                  <Select.Option key={option.value} value={option.value}>
                    {option.label}
                  </Select.Option>
                ))}
              </Select>
            </div>
          ) : (
            <div className="bg-background-subtle rounded-8 px-14 py-12">
              <Text as="p" variant="xs-regular" className="text-text-secondary">
                {t("suspensionAppealNotice")}
              </Text>
            </div>
          )}

          <div className="flex flex-col gap-8">
            <label htmlFor="inquiry-title">
              <Text as="span" variant="xs-semibold" className="text-text-primary">
                {t("subjectLabel")}
              </Text>
            </label>

            <input
              id="inquiry-title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder={t("subjectPlaceholder")}
              disabled={createMutation.isPending}
              className={cn(
                "border-border-default bg-background-surface text-text-primary",
                "placeholder:text-text-muted",
                "rounded-8 h-48 w-full border px-14",
                "transition-colors outline-none",
                "focus:border-border-brand",
                "disabled:bg-background-disabled disabled:cursor-not-allowed",
              )}
            />
          </div>

          <div className="flex flex-col gap-8">
            <label htmlFor="inquiry-content">
              <Text as="span" variant="xs-semibold" className="text-text-primary">
                {t("threadLabel")}
              </Text>
            </label>

            <div className="border-border-default bg-background-surface rounded-8 border">
              <div className="flex min-h-[148px] flex-col gap-12 px-14 py-14">
                <Text as="span" variant="xs-semibold" className="text-text-primary">
                  {t("newInquiry")}
                </Text>

                <textarea
                  id="inquiry-content"
                  value={content}
                  onChange={(event) => setContent(event.target.value)}
                  placeholder={t("contentPlaceholder")}
                  disabled={createMutation.isPending}
                  rows={4}
                  className={cn(
                    "text-text-primary placeholder:text-text-muted",
                    "min-h-[92px] w-full resize-none",
                    "bg-transparent outline-none",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                  )}
                />
              </div>

              <div className="border-border-default mx-14 border-t" />

              <div className="flex min-h-[72px] items-start px-14 py-16">
                <Text as="p" variant="xs-semibold" className="text-text-primary">
                  {t("adminReplyPreview")}
                </Text>
              </div>
            </div>

            <Text as="p" variant="xs-regular" className="text-text-secondary">
              {t("threadHint")}
            </Text>
          </div>

          {createMutation.isError && (
            <Text as="p" variant="xs-regular" className="text-text-error" role="alert">
              {t("createFailed")}
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
              {t("cancel")}
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
              {createMutation.isPending ? t("creating") : t("createSubmit")}
            </Text>
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default InquiryCreateModal;
