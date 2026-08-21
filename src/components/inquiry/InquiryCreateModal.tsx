"use client";

import { type FormEvent, useState } from "react";

import Modal from "@/components/common/Modal/Modal";
import Select from "@/components/common/Select/Select";
import { Text } from "@/components/common/Text";
import { useCreateInquiry } from "@/hooks/inquiry/useCreateInquiry";
import { cn } from "@/lib/utils/cn";
import type { InquiryCategory } from "@/types/inquiry";

interface InquiryCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORY_OPTIONS: {
  value: InquiryCategory;
  label: string;
}[] = [
  {
    value: "SERVICE",
    label: "서비스 이용",
  },
  {
    value: "ACCOUNT",
    label: "계정",
  },
  {
    value: "SUSPENSION_APPEAL",
    label: "정지 이의신청",
  },
  {
    value: "ETC",
    label: "기타",
  },
];

const InquiryCreateModal = ({ isOpen, onClose }: InquiryCreateModalProps) => {
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

  const hasCategory = category !== "";

  const canSubmit =
    hasCategory &&
    trimmedTitle.length > 0 &&
    trimmedContent.length > 0 &&
    !createMutation.isPending;

  const handleCategoryChange = (value: string) => {
    const nextCategory = CATEGORY_OPTIONS.find((option) => option.value === value)?.value;

    if (!nextCategory) {
      return;
    }

    setCategory(nextCategory);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!category || !trimmedTitle || !trimmedContent || createMutation.isPending) {
      return;
    }

    createMutation.mutate(
      {
        category,
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
      dismissible={!createMutation.isPending}
      className={cn("items-stretch gap-0 p-0", "md:max-w-[720px]", "xl:w-full xl:max-w-[720px]")}
      aria-label="1:1 문의하기"
    >
      <div className="border-border-default flex items-center justify-between border-b px-20 py-18 md:px-24">
        <div className="flex flex-col gap-4">
          <Modal.Title className="text-text-primary">1:1 문의하기</Modal.Title>

          <Text as="p" variant="xs-regular" className="text-text-secondary">
            궁금한 점을 남겨주시면 확인 후 답변드릴게요.
          </Text>
        </div>

        <Modal.Close onClose={handleClose} disabled={createMutation.isPending} size="sm" />
      </div>

      <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
        <div className="flex flex-col gap-20 overflow-y-auto px-20 py-20 md:px-24 md:py-24">
          <div className="flex flex-col gap-8">
            <Text as="span" variant="xs-semibold" className="text-text-primary">
              문의 유형
            </Text>

            <Select
              desc="문의 유형을 선택해주세요"
              label="문의 유형"
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
              {CATEGORY_OPTIONS.map((option) => (
                <Select.Option key={option.value} value={option.value}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          </div>

          <div className="flex flex-col gap-8">
            <label htmlFor="inquiry-title">
              <Text as="span" variant="xs-semibold" className="text-text-primary">
                제목
              </Text>
            </label>

            <input
              id="inquiry-title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="문의 제목을 입력해주세요"
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
                문의 스레드
              </Text>
            </label>

            <div className="border-border-default bg-background-surface rounded-8 border">
              <div className="flex min-h-[148px] flex-col gap-12 px-14 py-14">
                <Text as="span" variant="xs-semibold" className="text-text-primary">
                  사용자 문의 · 새 문의
                </Text>

                <textarea
                  id="inquiry-content"
                  value={content}
                  onChange={(event) => setContent(event.target.value)}
                  placeholder="문의 내용을 자세히 작성해주세요"
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
                  관리자 답변 · 문의 등록 후 답변이 이 아래에 이어서 표시됩니다.
                </Text>
              </div>
            </div>

            <Text as="p" variant="xs-regular" className="text-text-secondary">
              ※ 답변과 추가 문의는 이 스레드에 시간순으로 이어집니다.
            </Text>
          </div>

          {createMutation.isError && (
            <Text as="p" variant="xs-regular" className="text-text-error" role="alert">
              문의 등록에 실패했습니다. 잠시 후 다시 시도해주세요.
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
              취소
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
              {createMutation.isPending ? "등록 중..." : "문의 등록"}
            </Text>
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default InquiryCreateModal;
