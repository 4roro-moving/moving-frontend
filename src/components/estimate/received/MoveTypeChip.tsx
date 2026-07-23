import { Text } from "@/components/common/Text";
import { BoxIcon, DocumentIcon } from "@/icons";
import { cn } from "@/lib/utils/cn";
import type { MoveType } from "@/types/estimate";

const MOVE_TYPE_LABEL: Record<MoveType, string> = {
  SMALL: "소형이사",
  HOME: "가정이사",
  OFFICE: "사무실이사",
};

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
        {MOVE_TYPE_LABEL[moveType]}
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
        "rounded-6 flex items-center justify-center gap-4 bg-[var(--color-red-100)] py-4 pr-8 pl-6 shadow-[4px_4px_4px_0_rgba(217,217,217,0.1)]",
        className,
      )}
    >
      <DocumentIcon className="size-20 shrink-0" aria-hidden="true" />
      <Text as="span" variant="md-semibold" className="text-text-error">
        지정 견적 요청
      </Text>
    </span>
  );
}
