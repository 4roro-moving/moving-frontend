"use client";

import Button from "@/components/common/Button/Button";
import { Text } from "@/components/common/Text";
import { ConfirmedCheckIcon } from "@/icons";

interface EstimateDetailActionsProps {
  isConfirmed: boolean;
  canConfirm: boolean;
  confirmDisabledReason: string | null;
  isConfirming: boolean;
  onConfirm: () => void;
}

export default function EstimateDetailActions({
  isConfirmed,
  canConfirm,
  confirmDisabledReason,
  isConfirming,
  onConfirm,
}: EstimateDetailActionsProps) {
  // 2026.07.24 정슬기 - [수정] 확정 완료 시 확정 버튼을 숨기고 완료 상태만 표시
  if (isConfirmed) {
    return (
      <div className="flex w-full flex-col gap-16">
        <div className="flex items-center justify-center gap-6">
          <ConfirmedCheckIcon className="text-icon-brand size-24 shrink-0" aria-hidden="true" />
          <Text as="p" variant="2lg-semibold" className="text-text-brand">
            견적이 확정되었습니다
          </Text>
        </div>
      </div>
    );
  }

  // 2026.07.24 정슬기 - [추가] 확정 견적 존재 시 대기 견적 확정 버튼 비활성화
  const disabled = !canConfirm || isConfirming;
  const reason =
    confirmDisabledReason ??
    (!canConfirm ? "이미 확정된 견적이 있어 추가로 확정할 수 없습니다." : null);

  return (
    <div className="flex w-full flex-col gap-12">
      <Button
        type="button"
        variant="solid"
        size="sm"
        fullWidth
        disabled={disabled}
        onClick={onConfirm}
      >
        {isConfirming ? "확정 중..." : "견적 확정하기"}
      </Button>
      {disabled && reason ? (
        <Text as="p" variant="md-regular" className="text-text-muted text-center">
          {reason}
        </Text>
      ) : null}
    </div>
  );
}
