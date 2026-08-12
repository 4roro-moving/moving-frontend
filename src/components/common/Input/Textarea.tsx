"use client";

import { forwardRef, useId, type ComponentPropsWithoutRef } from "react";

import { Text } from "@/components/common/Text";
import { cn } from "@/lib/utils/cn";

export interface TextareaProps extends ComponentPropsWithoutRef<"textarea"> {
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { error, className, "aria-describedby": ariaDescribedBy, ...props },
  ref,
) {
  const errorId = useId();
  const describedBy =
    [ariaDescribedBy, error ? errorId : undefined].filter(Boolean).join(" ") || undefined;

  return (
    <div className="flex w-full flex-col gap-4">
      <textarea
        ref={ref}
        aria-invalid={!!error}
        aria-describedby={describedBy}
        className={cn(
          "rounded-16 h-[180px] w-full border px-16 py-14",
          "border-border-default bg-background-surface text-text-primary transition-colors",
          "placeholder:text-text-placeholder disabled:bg-background-disabled disabled:text-text-disabled focus:outline-none",
          "hover:bg-background-hover",
          error
            ? "border-border-error"
            : "focus-within:shadow-input focus-within:border-border-brand",
          className,
        )}
        {...props}
      />
      {error && (
        <Text id={errorId} variant="xs-regular" className="text-text-error">
          {error}
        </Text>
      )}
    </div>
  );
});

export default Textarea;
