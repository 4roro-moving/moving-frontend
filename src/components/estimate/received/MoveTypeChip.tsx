import { Text } from "@/components/common/Text";
import { BoxIcon, DocumentIcon } from "@/icons";
import { cn } from "@/lib/utils/cn";
import { getMoveTypeLabel } from "@/lib/utils/estimateFormat";
import type { MoveType } from "@/types/estimate";

type ChipSize = "sm" | "md";

interface MoveTypeChipProps {
  moveType: MoveType;
  className?: string;
  /** Figma Chip size — default md (받은 견적·Tablet/Desktop). sm = Mobile pending */
  size?: ChipSize;
}

// 2026.07.25 정슬기 - [수정] Figma Chip sm/md size 지원 (default md — 기존 호출부 유지)
export default function MoveTypeChip({ moveType, className, size = "md" }: MoveTypeChipProps) {
  const isSm = size === "sm";

  return (
    <span
      className={cn(
        "bg-background-brand-muted flex items-center justify-center shadow-[4px_4px_4px_0_rgba(217,217,217,0.1)]",
        isSm ? "rounded-4 gap-2 py-2 pr-7 pl-4" : "rounded-6 gap-4 py-4 pr-8 pl-6",
        className,
      )}
    >
      <BoxIcon className="text-icon-brand size-20 shrink-0" aria-hidden="true" />
      <Text as="span" variant={isSm ? "sm-semibold" : "md-semibold"} className="text-text-brand">
        {getMoveTypeLabel(moveType)}
      </Text>
    </span>
  );
}

interface DesignatedChipProps {
  className?: string;
  size?: ChipSize;
}

export function DesignatedChip({ className, size = "md" }: DesignatedChipProps) {
  const isSm = size === "sm";

  return (
    <span
      className={cn(
        // 2026.07.24 정슬기 - [수정] 지정 견적 칩 배경을 red-100 토큰 유틸로 교체
        "flex items-center justify-center bg-red-100 shadow-[4px_4px_4px_0_rgba(217,217,217,0.1)]",
        isSm ? "rounded-4 gap-2 py-2 pr-7 pl-4" : "rounded-6 gap-4 py-4 pr-8 pl-6",
        className,
      )}
    >
      <DocumentIcon className="text-text-error size-20 shrink-0" aria-hidden="true" />
      <Text as="span" variant={isSm ? "sm-semibold" : "md-semibold"} className="text-text-error">
        지정 견적 요청
      </Text>
    </span>
  );
}
