import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-8 rounded-4 font-semibold transition-colors disabled:cursor-not-allowed disabled:bg-background-disabled disabled:text-text-disabled",
  {
    variants: {
      variant: {
        pri: "bg-background-brand text-text-inverse hover:bg-background-brand-hover",
        sec: "border border-border-default bg-background-surface text-text-primary hover:bg-background-hover",
        google: "border border-border-default bg-white text-text-primary hover:bg-background-hover",
      },
      size: {
        sm: "h-[38px] px-16 text-[length:var(--font-size-13)] leading-[var(--line-height-22)]",
        md: "h-[48px] px-24 text-[length:var(--font-size-14)] leading-[var(--line-height-24)]",
        lg: "h-[56px] px-32 text-[length:var(--font-size-16)] leading-[var(--line-height-26)]",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "pri",
      size: "md",
      fullWidth: false,
    },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant, size, fullWidth, type = "button", className, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(buttonVariants({ variant, size, fullWidth }), className)}
      {...props}
    />
  );
});

export default Button;
