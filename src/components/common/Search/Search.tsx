"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, useState, type ComponentPropsWithoutRef } from "react";

import { getTextVariantClass } from "@/components/common/Text";
import { ClearIcon, SearchIcon } from "@/icons";
import { cn } from "@/lib/utils/cn";

const searchVariants = cva(
  [
    "flex items-center rounded-16 border border-transparent bg-background-muted text-text-primary",
    "transition-[border-color,box-shadow] focus-within:border-border-brand focus-within:shadow-input",
  ],
  {
    variants: {
      size: {
        sm: "h-[52px] w-[260px] gap-6 px-16 py-14",
        md: "h-64 w-[560px] gap-8 px-24 py-14",
        responsive: "h-[52px] gap-6 px-16 py-14 md:h-64 md:gap-8 md:px-24",
      },
    },
    defaultVariants: { size: "md" },
  },
);

export interface SearchProps
  extends
    Omit<ComponentPropsWithoutRef<"input">, "size" | "type">,
    VariantProps<typeof searchVariants> {
  onClear?: () => void;
}

const Search = forwardRef<HTMLInputElement, SearchProps>(function Search(
  { size, className, placeholder = "검색", value, onClear, ...props },
  ref,
) {
  const [isFocused, setIsFocused] = useState(false);
  const resolvedSize = size ?? "md";
  const hasValue = value !== undefined && String(value).length > 0;
  const isSmall = resolvedSize === "sm";
  const isResponsive = resolvedSize === "responsive";
  const iconSizeClass = isSmall ? "size-24" : isResponsive ? "size-24 md:size-36" : "size-36";
  const clearIconSizeClass = isSmall ? "size-20" : isResponsive ? "size-20 md:size-28" : "size-28";
  const actionGapClass = isSmall ? "gap-12" : isResponsive ? "gap-12 md:gap-16" : "gap-16";
  const textVariantClass = isResponsive
    ? cn(
        getTextVariantClass("md-regular"),
        "md:text-[length:var(--font-size-18)] md:leading-[var(--line-height-26)]",
      )
    : getTextVariantClass(isSmall ? "md-regular" : "2lg-regular");

  return (
    <div
      className={cn(searchVariants({ size: resolvedSize }), className)}
      onFocusCapture={() => setIsFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setIsFocused(false);
        }
      }}
    >
      {!isFocused ? (
        <SearchIcon className={cn("text-icon-default shrink-0", iconSizeClass)} />
      ) : null}
      <input
        ref={ref}
        type="text"
        value={value}
        placeholder={placeholder}
        className={cn(
          textVariantClass,
          "placeholder:text-text-placeholder min-w-0 flex-1 bg-transparent outline-none",
        )}
        {...props}
      />
      {isFocused ? (
        <div className={cn("flex shrink-0 items-center", actionGapClass)}>
          {hasValue && onClear ? (
            <button
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={onClear}
              aria-label="검색어 지우기"
              className={cn(
                "focus-visible:ring-border-brand flex shrink-0 items-center justify-center rounded-full focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
                iconSizeClass,
              )}
            >
              <ClearIcon className={clearIconSizeClass} />
            </button>
          ) : null}
          <button
            type="submit"
            onMouseDown={(event) => event.preventDefault()}
            aria-label="검색"
            className={cn(
              "focus-visible:ring-border-brand flex shrink-0 items-center justify-center rounded-full focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
              iconSizeClass,
            )}
          >
            <SearchIcon className={cn("text-icon-default", iconSizeClass)} />
          </button>
        </div>
      ) : null}
    </div>
  );
});

export default Search;
