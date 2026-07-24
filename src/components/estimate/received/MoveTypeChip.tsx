import { Text } from "@/components/common/Text";
import { BoxIcon, DocumentIcon } from "@/icons";
import { cn } from "@/lib/utils/cn";
import { getMoveTypeLabel } from "@/lib/utils/estimateFormat";
import type { MoveType } from "@/types/estimate";

interface MoveTypeChipProps {
  moveType: MoveType;
  className?: string;
}

export default function MoveTypeChip({ moveType, className }: MoveTypeChipProps) {
  return (
    <span
      className={cn(
        "bg-background-brand-muted rounded-6 flex items-center justify-center gap-4 py-4 pr-8 pl-6 shadow-[4px_4px_4px_0_rgba(217,217,217,0.1)]",
        className,
      )}
    >
      <BoxIcon className="text-icon-brand size-20 shrink-0" aria-hidden="true" />
      <Text as="span" variant="md-semibold" className="text-text-brand">
        {getMoveTypeLabel(moveType)}
      </Text>
    </span>
  );
}

interface DesignatedChipProps {
  className?: string;
}

export function DesignatedChip({ className }: DesignatedChipProps) {
  return (
    <span
      className={cn(
        // 2026.07.24 정슬기 - [수정] 지정 견적 칩 배경을 red-100 토큰 유틸로 교체
        "rounded-6 flex items-center justify-center gap-4 bg-red-100 py-4 pr-8 pl-6 shadow-[4px_4px_4px_0_rgba(217,217,217,0.1)]",
        className,
      )}
    >
      <DocumentIcon className="text-text-error size-20 shrink-0" aria-hidden="true" />
      <Text as="span" variant="md-semibold" className="text-text-error">
        지정 견적 요청
      </Text>
    </span>
  );
}
