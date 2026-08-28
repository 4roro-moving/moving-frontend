"use client";

import { useTranslations } from "next-intl";

import SelectableChip from "@/components/common/Chip/SelectableChip";
import type { MoveType } from "@/types/move";

type MoverServiceChipVariant = "service" | "region";

interface MoverServiceChipProps {
  label: string;
  /** 제공 서비스: 주황 / 서비스 가능 지역: 회색 */
  variant?: MoverServiceChipVariant;
  className?: string;
}

export function MoverServiceChip({ label, variant = "service", className }: MoverServiceChipProps) {
  return (
    <SelectableChip size="responsive" selected={variant === "service"} className={className}>
      {label}
    </SelectableChip>
  );
}

interface MoverOfferedServiceChipsProps {
  serviceTypes: MoveType[];
}

/** 상세「제공 서비스」영역용 주황 basic 칩 목록 (이사유형 MoveTypeChip과 별개) */
export function MoverOfferedServiceChips({ serviceTypes }: MoverOfferedServiceChipsProps) {
  const t = useTranslations("moverSearch");
  return (
    <div className="flex flex-wrap gap-8 md:gap-12">
      {serviceTypes.map((type) => (
        <MoverServiceChip key={type} label={t(`moveTypes.${type}`)} variant="service" />
      ))}
    </div>
  );
}
