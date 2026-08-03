import { cn } from "@/lib/utils/cn";
import type { MoveType } from "@/types/move";
import { MoveTypeChip } from "@/components/common/Chip/MoveTypeChip";

interface MoverServiceTypeChipsProps {
  serviceTypes: MoveType[];
  size: "sm" | "md";
  className?: string;
}

export function MoverServiceTypeChips({
  serviceTypes,
  size,
  className,
}: MoverServiceTypeChipsProps) {
  return (
    <ul
      className={cn("flex flex-wrap items-start", size === "sm" ? "gap-8" : "gap-12", className)}
      aria-label="제공 이사 유형"
    >
      {serviceTypes.map((moveType) => (
        <li key={moveType}>
          <MoveTypeChip moveType={moveType} size={size} />
        </li>
      ))}
    </ul>
  );
}
