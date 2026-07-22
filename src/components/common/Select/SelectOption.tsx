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
  const { selected, handleChange } = useSelectContext();
  const isSelected = selected === value;

  return (
    <button
      type="button"
      role="option"
      aria-selected={isSelected}
      className={cn(
        "hover:bg-background-hover text-text-secondary shadow-card w-full px-16 py-20 text-left whitespace-nowrap",
        "first:rounded-t-12 last:rounded-b-12",
        isSelected && "bg-background-hover",
      )}
      onClick={() => handleChange(value, children)}
    >
      <Text variant="lg-regular" className="text-text-primary">
        {children}
      </Text>
    </button>
  );
};

export default SelectOption;
