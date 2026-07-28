import { Text } from "@/components/common/Text";
import { cn } from "@/lib/utils/cn";
import { getMoveTypeLabel } from "@/lib/utils/estimateFormat";
import type { MoveType } from "@/types/move";

type MoverServiceChipVariant = "service" | "region";

interface MoverServiceChipProps {
  label: string;
  /** 제공 서비스: 주황 / 서비스 가능 지역: 회색 */
  variant?: MoverServiceChipVariant;
  className?: string;
}

const chipVariantClassName: Record<MoverServiceChipVariant, string> = {
  service: "border-border-brand bg-brand-primary-subtle text-text-brand border",
  region: "border-border-muted bg-background-subtle text-text-secondary border",
};

export function MoverServiceChip({ label, variant = "service", className }: MoverServiceChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full px-12 py-6 md:px-20 md:py-10",
        chipVariantClassName[variant],
        className,
      )}
    >
      <Text
        as="span"
        variant={
          variant === "service"
            ? { base: "md-medium", md: "2lg-medium" }
            : { base: "md-regular", md: "2lg-regular" }
        }
      >
        {label}
      </Text>
    </span>
  );
}

interface MoverOfferedServiceChipsProps {
  serviceTypes: MoveType[];
}

/** 상세「제공 서비스」영역용 주황 basic 칩 목록 (이사유형 MoveTypeChip과 별개) */
export function MoverOfferedServiceChips({ serviceTypes }: MoverOfferedServiceChipsProps) {
  return (
    <div className="flex flex-wrap gap-8 md:gap-12">
      {serviceTypes.map((type) => (
        <MoverServiceChip key={type} label={getMoveTypeLabel(type)} variant="service" />
      ))}
    </div>
  );
}
