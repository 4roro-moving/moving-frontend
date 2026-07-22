"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils/cn";
import Image from "next/image";

const searchVariants = cva(
  "flex items-center gap-10 rounded-4 border border-border-default bg-background-surface text-text-primary transition-colors focus-within:border-border-brand",
  {
    variants: {
      size: {
        sm: "w-[200px] px-20 py-[11px] text-[length:var(--font-size-13)] leading-[var(--line-height-22)]",
        md: "h-[50px] w-[320px] rounded-2 px-20 py-[13px] text-[length:var(--font-size-13)] leading-[var(--line-height-22)]",
        lg: "w-[345px] px-20 py-[11px] text-[length:var(--font-size-14)] leading-[var(--line-height-24)]",
      },
    },
    defaultVariants: { size: "lg" },
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
      <input
        ref={ref}
        type="text"
        placeholder={placeholder}
        className="placeholder:text-text-placeholder w-full bg-transparent focus:outline-none"
        {...props}
      />
      <span className="text-icon-default">
        <Image src="/icons/ic_search.svg" alt="search" width={24} height={24} />
      </span>
    </div>
  );
});

export default Search;
