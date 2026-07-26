"use client";

import type { ReactNode } from "react";

import { Text, type TextVariantProp } from "@/components/common/Text";
import { cn } from "@/lib/utils/cn";

import { useSelectContext } from "./SelectMain";

interface SelectOptionProps {
  children: ReactNode;
  value: string;
}

function getOptionTextVariant(isSort: boolean, isMultiColumn: boolean): TextVariantProp {
  if (isSort) {
    return { base: "xs-medium", lg: "md-medium" };
  }

  if (isMultiColumn) {
    return { base: "md-medium", lg: "2lg-medium" };
  }

  return { base: "md-medium", lg: "lg-medium" };
}

const SelectOption = ({ children, value }: SelectOptionProps) => {
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
          "first:rounded-t-8 last:rounded-b-8 h-32 py-6 pr-6 pl-10 lg:h-auto lg:px-12 lg:py-8",
        !isSort &&
          !isMultiColumn &&
          "first:rounded-t-8 last:rounded-b-8 lg:first:rounded-t-12 lg:last:rounded-b-12 h-40 px-14 lg:h-60 lg:py-16 lg:pr-12 lg:pl-20",
        isMultiColumn &&
          "border-border-default h-36 border-r px-14 even:border-r-0 lg:h-64 lg:px-24 lg:py-16 [&:nth-last-child(-n+2)]:border-b-0",
        isSelected && "bg-background-hover",
      )}
      onClick={() => handleChange(value)}
    >
      <Text variant={getOptionTextVariant(isSort, isMultiColumn)} className="text-text-secondary">
        {children}
      </Text>
    </button>
  );
};

export default SelectOption;
