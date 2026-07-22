import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils/cn";

const buttonVariants = cva(
  "inline-flex h-15 p-16 items-center justify-center gap-8 rounded-16 font-semibold transition-colors disabled:cursor-not-allowed disabled:bg-background-disabled disabled:text-text-disabled",
  {
    variants: {
      variant: {
        solid: "bg-background-brand text-text-inverse hover:bg-background-brand-hover",
        outline:
          "border border-1 border-border-brand bg-background-surface text-text-brand hover:bg-background-brand-muted",
      },
      size: {
        sm: "min-w-[300px]",
        lg: "min-w-[600px]",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "solid",
      size: "lg",
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
