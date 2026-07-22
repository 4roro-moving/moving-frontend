"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils/cn";
import Image from "next/image";

const searchVariants = cva(
  "flex items-center gap-10 rounded-16 p-14 bg-background-muted text-text-primary transition-colors focus-within:border-border-brand",
  {
    variants: {
      size: {
        sm: "w-[260px] text-sm leading-6",
        lg: "w-[560px] text-lg leading-6",
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
      <span className="text-icon-default">
        <Image src="/icons/ic_search.svg" alt="search" width={24} height={24} />
      </span>
      <input
        ref={ref}
        type="text"
        placeholder={placeholder}
        className="placeholder:text-text-placeholder w-full bg-transparent focus:outline-none"
        {...props}
      />
    </div>
  );
});

export default Search;
