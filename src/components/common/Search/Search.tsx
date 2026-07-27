"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type ComponentPropsWithoutRef } from "react";

import { getTextVariantClass } from "@/components/common/Text";
import { cn } from "@/lib/utils/cn";
import { SearchIcon } from "@/components/estimate/icons";

const searchVariants = cva(
  [
    "flex items-center gap-10 rounded-16 border border-transparent bg-background-muted p-14 text-text-primary",
    "transition-[border-color,box-shadow] focus-within:border-border-brand focus-within:shadow-input",
  ],
  {
    variants: {
      size: {
        sm: "w-[260px]",
        md: "w-[560px]",
      },
    },
    defaultVariants: { size: "md" },
  },
);

export interface SearchProps
  extends
    Omit<ComponentPropsWithoutRef<"input">, "size" | "type">,
    VariantProps<typeof searchVariants> {}

const Search = forwardRef<HTMLInputElement, SearchProps>(function Search(
  { size, className, placeholder = "검색", ...props },
  ref,
) {
  return (
    <div className={cn(searchVariants({ size }), className)}>
      <span className="text-icon-default">
        <SearchIcon className="size-24" />
      </span>
      <input
        ref={ref}
        type="text"
        placeholder={placeholder}
        className={cn(
          getTextVariantClass({ base: "md-regular", md: "2lg-regular" }),
          "placeholder:text-text-placeholder w-full bg-transparent outline-none",
        )}
        {...props}
      />
    </div>
  );
});

export default Search;
