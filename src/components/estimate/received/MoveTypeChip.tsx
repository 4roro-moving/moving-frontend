import { Text } from "@/components/common/Text";
import { BoxIcon, DocumentIcon, HomeIcon, CompanyIcon } from "@/icons";
import { cn } from "@/lib/utils/cn";
import { getMoveTypeLabel } from "@/lib/utils/estimateFormat";
import type { MoveType } from "@/types/move";

type ChipSize = "sm" | "md";

interface MoveTypeChipProps {
  moveType: MoveType;
  className?: string;
  size?: ChipSize;
}

const MOVE_TYPE_ICON = {
  SMALL: BoxIcon,
  HOME: HomeIcon,
  OFFICE: CompanyIcon,
};

export default function MoveTypeChip({ moveType, className, size = "md" }: MoveTypeChipProps) {
  const isSm = size === "sm";
  const Icon = MOVE_TYPE_ICON[moveType];

  return (
    <span
      className={cn(
        "bg-background-brand-muted flex items-center justify-center shadow-[4px_4px_4px_0_rgba(217,217,217,0.1)]",
        isSm ? "rounded-4 gap-2 py-2 pr-7 pl-4" : "rounded-6 gap-4 py-4 pr-8 pl-6",
        className,
      )}
    >
      <Icon className="text-icon-brand size-20 shrink-0" />
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
      <DocumentIcon className="size-20 shrink-0 text-red-200" />
      <Text as="span" variant={isSm ? "sm-semibold" : "md-semibold"} className="text-red-200">
        지정 견적 요청
      </Text>
    </span>
  );
}
