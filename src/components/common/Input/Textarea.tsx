"use client";

import { forwardRef, type ComponentPropsWithoutRef } from "react";

import { Text } from "@/components/common/Text";
import { cn } from "@/lib/utils/cn";

export interface TextareaProps extends ComponentPropsWithoutRef<"textarea"> {
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { error, className, ...props },
  ref,
) {
  return (
    <div className="flex w-full flex-col gap-4">
      <textarea
        ref={ref}
        aria-invalid={!!error}
        className={cn(
          "rounded-16 h-[180px] w-full border px-20 py-12",
          "border-border-default bg-background-surface text-text-primary transition-colors",
          "placeholder:text-text-placeholder focus:border-border-brand disabled:bg-background-disabled disabled:text-text-disabled focus:outline-none",
          "hover:bg-background-hover",
          error && "border-border-error",
          className,
        )}
        {...props}
      />
      {error && (
        <Text variant="xs-regular" className="text-text-error">
          {error}
        </Text>
      )}
    </div>
  );
});

export default Textarea;
