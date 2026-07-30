import Button from "@/components/common/Button/Button";
import { Text } from "@/components/common/Text";
import { ConfirmedCheckIcon } from "@/icons";
import { formatPrice } from "@/lib/utils/estimateFormat";

interface EstimateDetailActionsProps {
  isConfirmed: boolean;
  canConfirm: boolean;
  confirmDisabledReason: string | null;
  isConfirming: boolean;
  onConfirm: () => void;
  /** 대기 상세 Figma: CTA 위 견적가 재표시 */
  price?: number;
  /** received: sm / pending: detail */
  buttonSize?: "sm" | "detail";
}

/**
 * 견적 상세 확정 CTA (받았던·대기 상세 공통)
 * // 2026.07.24 정슬기 - [추가]
 * // 2026.07.30 정슬기 - [수정] PendingEstimateDetailActions 통합 (optional price·buttonSize)
 */
export default function EstimateDetailActions({
  isConfirmed,
  canConfirm,
  confirmDisabledReason,
  isConfirming,
  onConfirm,
  price,
  buttonSize = "sm",
}: EstimateDetailActionsProps) {
  const showPrice = typeof price === "number";

  const priceBlock = showPrice ? (
    <div className="flex w-full flex-col gap-0">
      <Text as="p" variant="2lg-semibold" className="text-text-weak">
        견적가
      </Text>
      <Text as="p" variant="2xl-bold" className="text-text-primary">
        {formatPrice(price)}
      </Text>
    </div>
  ) : null;

  if (isConfirmed) {
    return (
      <div className="flex w-full flex-col gap-16">
        {priceBlock}
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
    <div className={showPrice ? "flex w-full flex-col gap-30" : "flex w-full flex-col gap-12"}>
      {priceBlock}

      <div className="flex w-full flex-col gap-12">
        <Button
          type="button"
          variant="solid"
          size={buttonSize}
          fullWidth
          disabled={disabled}
          onClick={onConfirm}
          className="max-w-full min-w-0"
          aria-busy={isConfirming}
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
