import { Text } from "@/components/common/Text";

import { cn } from "@/lib/utils/cn";

interface EstimatesQueryStatusProps {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  actionBusy?: boolean;
  className?: string;
}

/**
 * 견적·리뷰 목록/상세 공통 로딩·에러 상태 UI
 * // 2026.07.30 정슬기 - [수정] ReceivedEstimatesStatus → EstimatesQueryStatus (도메인 중립화)
 */
export default function EstimatesQueryStatus({
  message,
  actionLabel,
  onAction,
  actionBusy = false,
  className,
}: EstimatesQueryStatusProps) {
  return (
    <div
      className={cn(
        "px-margin-mobile flex w-full flex-col items-center justify-center gap-16 py-64 md:px-0 md:py-80",
        className,
      )}
      role={actionLabel ? "alert" : "status"}
      {...(actionLabel ? {} : { "aria-live": "polite" as const })}
    >
      <Text as="p" variant="lg-regular" className="text-text-muted text-center">
        {message}
      </Text>
      {actionLabel && onAction ? (
        <button
          type="button"
          onClick={onAction}
          disabled={actionBusy}
          aria-busy={actionBusy}
          className="text-text-brand focus-visible:ring-border-brand rounded-4 underline-offset-2 hover:underline focus-visible:ring-2 focus-visible:outline-none"
        >
          <Text as="span" variant="md-semibold" className="text-text-brand">
            {actionLabel}
          </Text>
        </button>
      ) : null}
    </div>
  );
}
