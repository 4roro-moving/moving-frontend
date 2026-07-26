"use client";

import type { ReactNode } from "react";

import { Text } from "@/components/common/Text";
import { cn } from "@/lib/utils/cn";

import { useSelectContext } from "./SelectMain";

interface SelectOptionProps {
  children: ReactNode;
  value: string;
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
        isSort && "first:rounded-t-8 last:rounded-b-8 px-12 py-8",
        !isSort &&
          !isMultiColumn &&
          "text-text-secondary first:rounded-t-12 last:rounded-b-12 px-16 py-20",
        isMultiColumn &&
          "border-border-default h-64 border-r px-24 py-16 even:border-r-0 [&:nth-last-child(-n+2)]:border-b-0",
        isSelected && "bg-background-hover",
      )}
      onClick={() => handleChange(value)}
    >
      <Text
        variant={isSort ? "md-medium" : isMultiColumn ? "2lg-medium" : "lg-medium"}
        className="text-text-secondary"
      >
        {children}
      </Text>
    </button>
  );
};

export default SelectOption;
