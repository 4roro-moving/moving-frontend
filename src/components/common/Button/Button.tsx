import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, ReactNode, type ButtonHTMLAttributes } from "react";

import { Text } from "@/components/common/Text";
import { cn } from "@/lib/utils/cn";

const buttonVariants = cva(
  "inline-flex h-57 p-16 items-center justify-center gap-4 rounded-16 transition-colors disabled:cursor-not-allowed disabled:bg-background-disabled disabled:text-text-disabled",
  {
    variants: {
      variant: {
        solid: "bg-background-brand text-text-inverse hover:bg-background-brand-hover",
        outline:
          "border border-1 border-border-brand bg-background-surface text-text-brand hover:bg-background-brand-muted",
      },
      size: {
        sm: "min-w-[300px]",
        md: "min-w-[600px]",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "solid",
      size: "md",
      fullWidth: false,
    },
  },
);

const buttonTextVariant = {
  sm: "lg-semibold",
  md: "2lg-semibold",
} as const;

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  rightIcon?: ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant, size, fullWidth, type = "button", className, rightIcon, children, ...props },
  ref,
) {
  const resolvedSize = size ?? "md";

  return (
    <button
      ref={ref}
      type={type}
      className={cn(buttonVariants({ variant, size, fullWidth }), className)}
      {...props}
    >
      <Text as="span" variant={buttonTextVariant[resolvedSize]}>
        {children}
      </Text>
      {rightIcon}
    </button>
  );
});

export default Button;
