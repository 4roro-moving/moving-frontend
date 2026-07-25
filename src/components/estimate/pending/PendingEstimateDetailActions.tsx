"use client";

import Button from "@/components/common/Button/Button";
import { Text } from "@/components/common/Text";
import { ConfirmedCheckIcon } from "@/icons";
import { formatPrice } from "@/lib/utils/estimateFormat";

interface PendingEstimateDetailActionsProps {
  price: number;
  isConfirmed: boolean;
  canConfirm: boolean;
  confirmDisabledReason: string | null;
  isConfirming: boolean;
  onConfirm: () => void;
}

/**
 * 대기 견적 상세 Desktop 사이드 CTA
 * Figma: 견적가 재표시 + solid 320×64
 * CTA 문구: Figma '견적 요청하기'는 플로우상 오타로 판단 → '견적 확정하기' 사용
 * // 2026.07.25 정슬기 - [추가] received EstimateDetailActions와 분리 (받은 상세 미수정)
 */
export default function PendingEstimateDetailActions({
  price,
  isConfirmed,
  canConfirm,
  confirmDisabledReason,
  isConfirming,
  onConfirm,
}: PendingEstimateDetailActionsProps) {
  if (isConfirmed) {
    return (
      <div className="flex w-full flex-col gap-16">
        <div className="flex w-full flex-col gap-0">
          <Text as="p" variant="2lg-semibold" className="text-text-weak">
            견적가
          </Text>
          <Text as="p" variant="2xl-bold" className="text-text-primary">
            {formatPrice(price)}
          </Text>
        </div>
        <div className="flex items-center justify-center gap-6">
          <ConfirmedCheckIcon className="text-icon-brand size-24 shrink-0" aria-hidden="true" />
          <Text as="p" variant="2lg-semibold" className="text-text-brand">
            견적이 확정되었습니다
          </Text>
        </div>
      </div>
    );
  }

  const disabled = !canConfirm || isConfirming;
  const reason =
    confirmDisabledReason ??
    (!canConfirm ? "이미 확정된 견적이 있어 추가로 확정할 수 없습니다." : null);

  return (
    // 2026.07.25 정슬기 - [수정] Desktop 사이드 견적가 18/600/26 + #ABABAB, CTA 320×64 (Figma)
    <div className="flex w-full flex-col gap-30">
      <div className="flex w-full flex-col">
        <Text as="p" variant="2lg-semibold" className="text-text-weak">
          견적가
        </Text>
        <Text as="p" variant="2xl-bold" className="text-text-primary">
          {formatPrice(price)}
        </Text>
      </div>

      <div className="flex w-full flex-col gap-12">
        <Button
          type="button"
          variant="solid"
          size="detail"
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
    </div>
  );
}
