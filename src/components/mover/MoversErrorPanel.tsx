"use client";

import Button from "@/components/common/Button/Button";
import { Text } from "@/components/common/Text";

export interface MoversErrorPanelProps {
  title: string;
  description: string;
  actionLabel: string;
  isRetrying: boolean;
  onRetry: () => void;
}

/** 기사님 찾기 / 상세 공통 네트워크·조회 실패 패널 */
export default function MoversErrorPanel({
  title,
  description,
  actionLabel,
  isRetrying,
  onRetry,
}: MoversErrorPanelProps) {
  return (
    <div className="flex w-full flex-col items-center gap-16 py-40 text-center">
      <div className="flex flex-col gap-8">
        <Text as="p" variant="lg-semibold" className="text-text-secondary">
          {title}
        </Text>
        <Text as="p" variant="md-regular" className="text-text-muted">
          {description}
        </Text>
      </div>
      <Button
        type="button"
        variant="outline"
        size="cta"
        disabled={isRetrying}
        onClick={onRetry}
        className="min-w-[160px]"
      >
        {isRetrying ? "다시 시도 중..." : actionLabel}
      </Button>
    </div>
  );
}
