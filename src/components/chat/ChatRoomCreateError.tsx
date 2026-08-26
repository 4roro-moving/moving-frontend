"use client";

import { useTranslations } from "next-intl";

import Button from "@/components/common/Button/Button";
import { Text } from "@/components/common/Text";
import { cn } from "@/lib/utils/cn";

export interface ChatRoomCreateErrorProps {
  /** API/네트워크 등에서 전달된 실패 사유 */
  message?: string;
  isRetrying?: boolean;
  onRetry: () => void;
  className?: string;
}

/**
 * 채팅방 생성/입장 실패 시 모달 내부 안내 + 재시도
 * // 2026.08.08 김성현 - [추가] 권한·네트워크·서버·견적상태 실패 공통 UI
 */
export default function ChatRoomCreateError({
  message,
  isRetrying = false,
  onRetry,
  className,
}: ChatRoomCreateErrorProps) {
  const t = useTranslations("chat.error");
  const displayMessage = message?.trim() || t("defaultMessage");

  return (
    <div
      role="alert"
      className={cn(
        "flex h-full w-full flex-col items-center justify-center gap-16 px-24 py-40 text-center",
        className,
      )}
    >
      <div
        className="bg-background-brand-muted text-text-brand flex size-64 items-center justify-center rounded-full"
        aria-hidden="true"
      >
        <span className="text-[28px] leading-[42px] font-semibold">i</span>
      </div>

      <div className="flex flex-col items-center gap-8">
        <Text as="p" variant="lg-semibold" className="text-text-secondary">
          {t("title")}
        </Text>
        <Text as="p" variant="md-regular" className="text-text-muted whitespace-pre-line">
          {displayMessage}
        </Text>
      </div>

      <Button
        type="button"
        variant="solid"
        size="cta"
        className="w-[200px]"
        disabled={isRetrying}
        aria-busy={isRetrying}
        onClick={onRetry}
      >
        {isRetrying ? t("retrying") : t("retry")}
      </Button>

      <Text as="p" variant="xs-regular" className="text-text-muted">
        {t("help")}
      </Text>
    </div>
  );
}
