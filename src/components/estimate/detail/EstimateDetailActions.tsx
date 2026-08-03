import Button from "@/components/common/Button/Button";
import { Text } from "@/components/common/Text";
import { TrashIcon } from "@/icons";
import { cn } from "@/lib/utils/cn";
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
  /** 요청 상태가 PENDING|OPEN일 때만 취소 아이콘 노출 */
  // 2026.08.03 정슬기 - [추가]
  canCancelRequest?: boolean;
  isCanceling?: boolean;
  onCancelRequest?: () => void;
}

/**
 * 견적 상세 확정 CTA (받았던·대기 상세 공통)
 * // 2026.07.24 정슬기 - [추가]
 * // 2026.07.30 정슬기 - [수정] PendingEstimateDetailActions 통합 (optional price·buttonSize)
 * // 2026.08.03 정슬기 - [수정] 확정 Primary + 우측 Trash 아이콘 버튼
 */
export default function EstimateDetailActions({
  isConfirmed,
  canConfirm,
  confirmDisabledReason,
  isConfirming,
  onConfirm,
  price,
  buttonSize = "sm",
  canCancelRequest = false,
  isCanceling = false,
  onCancelRequest,
}: EstimateDetailActionsProps) {
  const showPrice = typeof price === "number";
  const showCancel = canCancelRequest && typeof onCancelRequest === "function";

  const priceBlock = showPrice ? (
    // Desktop(aside)에서만 CTA 위 견적가 표시 — Mobile/Tablet은 본문 EstimateDetailPrice와 중복
    // 2026.08.03 정슬기 - [수정]
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
    // 확정 안내 문구는 DriverSummary의 "확정견적" 배지로 통일 — 중복 텍스트 제거
    // 2026.08.03 정슬기 - [수정] "견적이 확정되었습니다" 제거 (대기 상세는 견적가만 유지)
    // Desktop에서만 aside 견적가 노출
    if (!showPrice) {
      return null;
    }

    return <div className="hidden w-full flex-col gap-16 lg:flex">{priceBlock}</div>;
  }

  const confirmDisabled = !canConfirm || isConfirming || isCanceling;
  const reason =
    confirmDisabledReason ??
    (!canConfirm ? "이미 확정된 견적이 있어 추가로 확정할 수 없습니다." : null);

  return (
    <div className={cn("flex w-full flex-col", showPrice ? "gap-12 lg:gap-30" : "gap-12")}>
      {showPrice ? <div className="hidden w-full lg:block">{priceBlock}</div> : null}

      <div className="flex w-full flex-col gap-12">
        {/* [Trash] [견적 확정하기] — Trash size-57 통일, 세로 가운데 정렬 */}
        {/* 2026.08.03 정슬기 - [수정] 버튼 순서 교체 · Trash 크기 통일 */}
        <div className="flex w-full flex-row items-center gap-8 md:gap-12">
          {showCancel ? (
            <button
              type="button"
              aria-label="견적 요청 취소"
              aria-busy={isCanceling}
              disabled={isCanceling || isConfirming}
              onClick={onCancelRequest}
              className={cn(
                "border-border-default text-text-primary bg-background-surface rounded-16 size-57 shrink-0 border",
                "hover:bg-background-hover",
                "focus-visible:ring-border-brand focus-visible:ring-2 focus-visible:outline-none",
                "disabled:cursor-not-allowed disabled:opacity-40",
                "flex items-center justify-center",
              )}
            >
              <TrashIcon className="size-24" aria-hidden="true" />
            </button>
          ) : null}

          <Button
            type="button"
            variant="solid"
            size={buttonSize}
            fullWidth
            disabled={confirmDisabled}
            onClick={onConfirm}
            className={cn("min-w-0 whitespace-nowrap", showCancel ? "flex-1" : "max-w-full")}
            aria-busy={isConfirming}
          >
            {isConfirming ? "확정 중..." : "견적 확정하기"}
          </Button>
        </div>
        {confirmDisabled && reason && !isConfirming && !isCanceling ? (
          <Text as="p" variant="md-regular" className="text-text-muted text-center">
            {reason}
          </Text>
        ) : null}
      </div>
    </div>
  );
}
