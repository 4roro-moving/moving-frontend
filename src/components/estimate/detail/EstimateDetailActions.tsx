import type { Ref } from "react";

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
  /** 상세 CTA — received/pending 모두 detail(h-64)로 Tablet·Desktop 정렬 */
  buttonSize?: "sm" | "detail";
  /** 요청 상태가 PENDING|OPEN일 때만 취소 아이콘 노출 */
  // 2026.08.03 정슬기 - [추가]
  canCancelRequest?: boolean;
  isCanceling?: boolean;
  onCancelRequest?: () => void;
  /** 모달 닫힘 후 포커스 복귀용 */
  // 2026.08.04 정슬기 - [추가]
  cancelButtonRef?: Ref<HTMLButtonElement>;
}

/**
 * 견적 상세 확정 CTA (받았던·대기 상세 공통)
 * // 2026.07.24 정슬기 - [추가]
 * // 2026.07.30 정슬기 - [수정] PendingEstimateDetailActions 통합 (optional price·buttonSize)
 * // 2026.08.03 정슬기 - [수정] 확정 Primary + Trash 아이콘 버튼
 * // 2026.08.04 정슬기 - [수정] 미확정 전제 · cancel ref 포커스 복귀
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
  cancelButtonRef,
}: EstimateDetailActionsProps) {
  const showPrice = typeof price === "number";
  const showCancel = canCancelRequest && typeof onCancelRequest === "function";
  // Primary(sm h-57 / detail h-64)와 Trash 정사각 높이를 맞춤 — Tablet 스택에서도 정렬 유지
  // 2026.08.04 정슬기 - [수정]
  const trashSizeClass = buttonSize === "detail" ? "size-64" : "size-57";
  const trashIconClass = buttonSize === "detail" ? "size-24" : "size-20";

  // Desktop(aside, xl+)에서만 CTA 위 견적가 — Mobile/Tablet 본문 Price와 중복 방지
  // 2026.08.04 정슬기 - [수정] lg → xl
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
    // 확정 안내 문구는 DriverSummary의 "확정견적" 배지로 통일 — 중복 텍스트 제거
    // 호출부는 미확정일 때만 Actions를 넘김. 방어적으로 견적가만 Desktop 노출.
    // 2026.08.04 정슬기 - [수정] CodeRabbit: 확정+취소 조합은 호출부에서 제거
    if (!showPrice) {
      return null;
    }

    // Desktop aside(xl+)에서만 견적가 — Tablet 세로 스택과 본문 Price 중복 방지
    // 2026.08.04 정슬기 - [수정]
    return <div className="hidden w-full flex-col gap-16 xl:flex">{priceBlock}</div>;
  }

  const confirmDisabled = !canConfirm || isConfirming || isCanceling;
  const reason =
    confirmDisabledReason ??
    (!canConfirm ? "이미 확정된 견적이 있어 추가로 확정할 수 없습니다." : null);

  return (
    <div className={cn("flex w-full flex-col", showPrice ? "gap-12 xl:gap-30" : "gap-12")}>
      {showPrice ? <div className="hidden w-full xl:block">{priceBlock}</div> : null}

      <div className="flex w-full flex-col gap-12">
        {/* [Trash] [견적 확정하기] — Primary 높이에 맞춘 정사각 Trash */}
        {/* 2026.08.04 정슬기 - [수정] Tablet/Desktop Trash·Primary 높이 정렬 */}
        <div className="flex w-full flex-row items-center gap-8 md:gap-12">
          {showCancel ? (
            <button
              ref={cancelButtonRef}
              type="button"
              aria-label="견적 요청 취소"
              aria-busy={isCanceling}
              disabled={isCanceling || isConfirming}
              onClick={onCancelRequest}
              className={cn(
                "border-border-default text-text-primary bg-background-surface rounded-16 shrink-0 border",
                "hover:bg-background-hover",
                "focus-visible:ring-border-brand focus-visible:ring-2 focus-visible:outline-none",
                "disabled:cursor-not-allowed disabled:opacity-40",
                "flex items-center justify-center",
                trashSizeClass,
              )}
            >
              <TrashIcon className={trashIconClass} aria-hidden="true" />
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
