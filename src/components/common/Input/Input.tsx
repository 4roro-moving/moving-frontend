"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type ChangeEvent, type ComponentPropsWithoutRef, type ReactNode } from "react";

import { Text, getTextVariantClass, type TextVariantProp } from "@/components/common/Text";
import { cn } from "@/lib/utils/cn";

/**
 * Figma input/text_field size
 * - sm: Mobile (Lg/Regular 16)
 * - md: Tablet·Desktop (Mobile에서는 sm 타이포, md:부터 2lg/Regular 18 + h64)
 */
const inputVariants = cva(
  "flex w-full items-center gap-8 rounded-16 border border-border-default bg-background-surface p-14 transition-colors has-[input:disabled]:bg-background-disabled",
  {
    variants: {
      size: {
        sm: "",
        md: "md:h-64 md:pr-24",
      },
    },
    defaultVariants: { size: "sm" },
  },
);

const INPUT_TEXT_VARIANT = {
  sm: "lg-regular",
  md: { base: "lg-regular", md: "2lg-regular" },
} as const satisfies Record<"sm" | "md", TextVariantProp>;

const INPUT_ERROR_TEXT_VARIANT = {
  sm: "sm-medium",
  md: { base: "sm-medium", md: "lg-medium" },
} as const satisfies Record<"sm" | "md", TextVariantProp>;

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
  const resolvedSize = size ?? "sm";

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (numericOnly) {
      const input = event.target;
      const prevValue = input.value;
      // 현재 커서 위치
      const cursorPos = input.selectionStart ?? prevValue.length;
      // 커서 앞 구간 개수 세기
      const digitsBeforeCursor = prevValue.slice(0, cursorPos).replace(/[^0-9]/g, "").length;
      const digitsOnly = prevValue.replace(/[^0-9]/g, "");
      const nextValue = digitsOnly.replace(/^0+(?=\d)/, "");
      // 선행 0 제거로 앞쪽에서 사라진 글자 수
      const strippedLeadingZeros = digitsOnly.length - nextValue.length;
      if (nextValue !== prevValue) {
        input.value = nextValue;
        const nextCursorPos = Math.max(0, digitsBeforeCursor - strippedLeadingZeros);
        input.setSelectionRange(nextCursorPos, nextCursorPos);
      }
    }
    onChange?.(event);
  };

  return (
    <div className={cn("flex w-full flex-col", resolvedSize === "md" ? "gap-4 md:gap-8" : "gap-4")}>
      <div
        className={cn(
          inputVariants({ size: resolvedSize }),
          error
            ? "border-border-error"
            : "focus-within:shadow-input focus-within:border-border-brand",
          className,
          "hover:bg-background-hover",
        )}
      >
        {leftSlot}
        <input
          ref={ref}
          type={type}
          aria-invalid={!!error}
          className={cn(
            getTextVariantClass(INPUT_TEXT_VARIANT[resolvedSize]),
            "text-text-primary placeholder:text-text-placeholder disabled:text-text-disabled w-full bg-transparent focus:outline-none",
          )}
          onChange={handleChange}
          {...props}
        />
        {rightSlot}
      </div>
      {error && (
        <Text variant={INPUT_ERROR_TEXT_VARIANT[resolvedSize]} className="text-text-error">
          {error}
        </Text>
      )}
    </div>
  );
});

export default Input;
