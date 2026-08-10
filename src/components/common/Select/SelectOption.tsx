"use client";

import type { ReactNode } from "react";

import { Text, type TextVariantProp } from "@/components/common/Text";
import { cn } from "@/lib/utils/cn";

import { useSelectContext } from "./SelectMain";

interface SelectOptionProps {
  children: ReactNode;
  value: string;
  /** 옵션 선택 전에 필요한 데이터 prefetch 적용 */
  onPrefetch?: () => void;
}

function getOptionTextVariant(isSort: boolean, isMultiColumn: boolean): TextVariantProp {
  if (isSort) {
    return { base: "xs-medium", xl: "md-medium" };
  }

  if (isMultiColumn) {
    return { base: "md-medium", xl: "2lg-medium" };
  }

  return { base: "md-medium", xl: "lg-medium" };
}

const SelectOption = ({ children, value, onPrefetch }: SelectOptionProps) => {
  const { selected, handleChange, variant, columns } = useSelectContext();
  const isSelected = selected === value;
  const isSort = variant === "sort";
  const isMultiColumn = columns > 1;

  return (
    <button
      type="button"
      role="option"
      aria-selected={isSelected}
      className={cn(
        "hover:bg-background-hover w-full text-left whitespace-nowrap",
        isSort &&
          "first:rounded-t-8 last:rounded-b-8 h-32 py-6 pr-6 pl-10 xl:h-auto xl:px-12 xl:py-8",
        !isSort &&
          !isMultiColumn &&
          "first:rounded-t-8 last:rounded-b-8 xl:first:rounded-t-12 xl:last:rounded-b-12 h-40 px-14 xl:h-60 xl:py-16 xl:pr-12 xl:pl-20",
        isMultiColumn &&
          "border-border-default h-36 border-r px-14 even:border-r-0 xl:h-64 xl:px-24 xl:py-16",
        isSelected && "bg-background-hover",
      )}
      onClick={() => handleChange(value)}
      onFocus={onPrefetch}
      onPointerEnter={onPrefetch}
    >
      <Text variant={getOptionTextVariant(isSort, isMultiColumn)} className="text-text-secondary">
        {children}
      </Text>
    </button>
  );
};

export default SelectOption;
