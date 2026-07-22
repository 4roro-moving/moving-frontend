"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type ChangeEvent, type ComponentPropsWithoutRef, type ReactNode } from "react";

import { Text } from "@/components/common/Text";
import { cn } from "@/lib/utils/cn";

const inputVariants = cva(
  "flex w-full items-center gap-8 rounded-16 border border-border-default bg-background-surface p-14 transition-colors focus-within:border-border-brand has-[input:disabled]:bg-background-disabled",
  {
    variants: {
      size: {
        sm: "text-[length:var(--font-size-13)] leading-[var(--line-height-22)]",
        lg: "text-[length:var(--font-size-14)] leading-[var(--line-height-24)]",
      },
    },
    defaultVariants: { size: "lg" },
  },
);

export interface InputProps
  extends Omit<ComponentPropsWithoutRef<"input">, "size">, VariantProps<typeof inputVariants> {
  error?: string;
  /* input 내부에 들어갈 요소 (왼쪽) */
  leftSlot?: ReactNode;
  /* input 내부에 들어갈 요소 (오른쪽) */
  rightSlot?: ReactNode;
  /** 숫자만 입력받도록 자동 필터링 (선행 0 제거) */
  numericOnly?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { size, error, leftSlot, rightSlot, numericOnly, className, onChange, type = "text", ...props },
  ref,
) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (numericOnly) {
      event.target.value = event.target.value.replace(/[^0-9]/g, "").replace(/^0+(?=\d)/, "");
    }
    onChange?.(event);
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <div
        className={cn(
          inputVariants({ size }),
          error && "border-border-error",
          className,
          "hover:bg-background-hover focus:shadow-md",
        )}
      >
        {leftSlot}
        <input
          ref={ref}
          type={type}
          aria-invalid={!!error}
          className="text-text-primary placeholder:text-text-placeholder disabled:text-text-disabled disable w-full bg-transparent focus:outline-none"
          onChange={handleChange}
          {...props}
        />
        {rightSlot}
      </div>
      {error && (
        <Text variant="xs-regular" className="text-text-error">
          {error}
        </Text>
      )}
    </div>
  );
});

export default Input;
