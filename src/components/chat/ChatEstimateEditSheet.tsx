"use client";

import { useRef, type FormEvent, type RefObject } from "react";

import { Text } from "@/components/common/Text";
import { formatDateToISODate } from "@/lib/utils/date";
import { usePresence } from "@/hooks/usePresence";
import { cn } from "@/lib/utils/cn";
import { SHEET_EXIT_DURATION_MS } from "@/lib/utils/uiMotion";

export interface ChatEstimateEditSubmitInput {
  requestedMoveDate: string;
  requestedPrice: number;
  requestedComment: string;
}

export interface ChatEstimateEditSheetProps {
  open: boolean;
  moveDateValue: string;
  priceValue: number;
  commentValue: string;
  onCancel: () => void;
  onSubmit: (input: ChatEstimateEditSubmitInput) => boolean | void | Promise<boolean | void>;
  isSubmitting?: boolean;
  focusRef?: RefObject<HTMLDivElement | null>;
  className?: string;
}

/**
 * 채팅 내 견적 수정 시트 (이사 일시 · 견적 금액)
 * // 2026.08.10 김성현 - [추가] Figma EstimateEditSheet 기반 presentational 시트
 */
export default function ChatEstimateEditSheet({
  open,
  moveDateValue,
  priceValue,
  commentValue,
  onCancel,
  onSubmit,
  isSubmitting = false,
  focusRef,
  className,
}: ChatEstimateEditSheetProps) {
  const { isRendered, isVisible } = usePresence(open, SHEET_EXIT_DURATION_MS);
  const formRef = useRef<HTMLFormElement>(null);
  const minMoveDate = formatDateToISODate(new Date());

  if (!isRendered) return null;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = formRef.current;

    if (!form || !form.reportValidity()) {
      return;
    }

    const formData = new FormData(form);
    const requestedMoveDate = String(formData.get("requestedMoveDate") ?? "");
    const requestedPrice = Number(formData.get("requestedPrice"));
    const requestedComment = String(formData.get("requestedComment") ?? "").trim();

    void onSubmit({
      requestedMoveDate,
      requestedPrice,
      requestedComment,
    });
  };

  return (
    <div
      ref={focusRef}
      role="region"
      aria-label="견적 수정"
      aria-hidden={!isVisible}
      tabIndex={-1}
      className={cn(
        "bg-background-surface shrink-0 px-24 py-20",
        "focus-visible:ring-border-brand focus-visible:ring-2 focus-visible:outline-none",
        "motion-reduce:animate-none",
        isVisible ? "animate-modal-sheet-in" : "animate-modal-sheet-out pointer-events-none",
        className,
      )}
    >
      <form ref={formRef} className="flex w-full flex-col gap-16" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4">
          <Text as="h2" variant="lg-semibold" className="text-text-primary">
            견적 수정
          </Text>
          <Text as="p" variant="sm-medium" className="text-text-muted">
            이사 일시와 견적 금액을 수정한 뒤 고객에게 전송하세요.
          </Text>
        </div>

        <div className="flex w-full flex-col gap-8">
          <label htmlFor="chat-estimate-move-date" className="text-text-secondary">
            <Text as="span" variant="sm-semibold">
              이사 일시
            </Text>
          </label>
          <input
            id="chat-estimate-move-date"
            name="requestedMoveDate"
            type="date"
            min={minMoveDate}
            defaultValue={moveDateValue.slice(0, 10)}
            required
            disabled={isSubmitting}
            className={cn(
              "bg-background-muted text-text-primary rounded-12 h-48 w-full px-16",
              "disabled:bg-background-disabled disabled:text-text-disabled disabled:cursor-not-allowed",
              "focus-visible:ring-border-brand focus-visible:ring-2 focus-visible:outline-none",
            )}
          />
        </div>

        <div className="flex w-full flex-col gap-8">
          <label htmlFor="chat-estimate-price" className="text-text-secondary">
            <Text as="span" variant="sm-semibold">
              견적 금액
            </Text>
          </label>
          <input
            id="chat-estimate-price"
            name="requestedPrice"
            type="number"
            inputMode="numeric"
            min={1}
            max={100000000}
            defaultValue={priceValue}
            required
            disabled={isSubmitting}
            className={cn(
              "bg-background-muted text-text-primary rounded-12 h-48 w-full px-16",
              "disabled:bg-background-disabled disabled:text-text-disabled disabled:cursor-not-allowed",
              "focus-visible:ring-border-brand focus-visible:ring-2 focus-visible:outline-none",
            )}
          />
        </div>

        <div className="flex w-full flex-col gap-8">
          <label htmlFor="chat-estimate-comment" className="text-text-secondary">
            <Text as="span" variant="sm-semibold">
              기사님 코멘트
            </Text>
          </label>
          <textarea
            id="chat-estimate-comment"
            name="requestedComment"
            defaultValue={commentValue}
            disabled={isSubmitting}
            rows={3}
            minLength={10}
            maxLength={1000}
            required
            className={cn(
              "bg-background-muted text-text-primary rounded-12 min-h-80 w-full resize-none px-16 py-12",
              "disabled:bg-background-disabled disabled:text-text-disabled disabled:cursor-not-allowed",
              "focus-visible:ring-border-brand focus-visible:ring-2 focus-visible:outline-none",
            )}
          />
        </div>

        <div className="flex w-full gap-12">
          <button
            type="button"
            className={cn(
              "bg-background-muted text-text-secondary hover:bg-background-hover rounded-12 flex h-48 flex-1 items-center justify-center",
              "focus-visible:ring-border-brand focus-visible:ring-2 focus-visible:outline-none",
              "disabled:bg-background-disabled disabled:text-text-disabled disabled:cursor-not-allowed",
            )}
            disabled={isSubmitting}
            onClick={onCancel}
          >
            <Text as="span" variant="md-semibold">
              취소
            </Text>
          </button>
          <button
            type="submit"
            className={cn(
              "bg-background-brand text-text-inverse hover:bg-background-brand-hover rounded-12 flex h-48 flex-1 items-center justify-center",
              "focus-visible:ring-border-brand focus-visible:ring-2 focus-visible:outline-none",
              "disabled:bg-background-disabled disabled:text-text-disabled disabled:hover:bg-background-disabled disabled:cursor-not-allowed",
            )}
            disabled={isSubmitting}
            aria-busy={isSubmitting}
          >
            <Text as="span" variant="md-semibold">
              {isSubmitting ? "전송 중..." : "고객에게 전송"}
            </Text>
          </button>
        </div>
      </form>
    </div>
  );
}
