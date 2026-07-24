import { Text } from "@/components/common/Text";

interface ReceivedEstimatesStatusProps {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

// 2026.07.24 정슬기 - [추가] 받은 견적 도메인 전용 로딩·빈·에러 상태 UI
export default function ReceivedEstimatesStatus({
  message,
  actionLabel,
  onAction,
}: ReceivedEstimatesStatusProps) {
  return (
    <div className="px-margin-mobile flex w-full flex-col items-center justify-center gap-16 py-64 md:px-0 md:py-80">
      <Text as="p" variant="lg-regular" className="text-text-muted text-center">
        {message}
      </Text>
      {actionLabel && onAction ? (
        <button
          type="button"
          onClick={onAction}
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
