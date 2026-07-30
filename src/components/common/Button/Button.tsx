import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, ReactNode, type ButtonHTMLAttributes } from "react";

import { Text, type TextVariantProp } from "@/components/common/Text";
import { cn } from "@/lib/utils/cn";

// 2026.07.25 정슬기 - [수정] size별 height/radius를 분리하고 Figma Button/*/CTA(h54,r12)용 cta 추가
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-4 transition-colors disabled:cursor-not-allowed disabled:bg-background-disabled disabled:text-text-disabled",
  {
    variants: {
      variant: {
        solid: "bg-background-brand text-text-inverse hover:bg-background-brand-hover",
        outline:
          "border border-1 border-border-brand bg-background-surface text-text-brand hover:bg-background-brand-muted",
      },
      size: {
        sm: "h-57 min-w-[300px] rounded-16 p-16",
        md: "h-57 min-w-[600px] rounded-16 p-16",
        // Figma: Button/solid|outlined/CTA (대기 견적 카드)
        cta: "h-54 min-w-0 rounded-12 p-16",
        // Figma: 대기 견적 상세 Desktop sidebar CTA (320×64, r16, 18 semibold)
        detail: "h-64 min-w-0 w-full rounded-16 p-16",
        // Figma: Auth login CTA (Mobile h54 r12 / Tablet·Desktop h60 r16)
        auth: "h-54 min-w-0 w-full rounded-12 p-16 md:h-60 md:rounded-16",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    compoundVariants: [
      // Figma outlined/CTA: px24 py16 + soft shadow
      {
        variant: "outline",
        size: "cta",
        class: "px-24 py-16 shadow-cta",
      },
    ],
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
  cta: "lg-semibold",
  detail: "2lg-semibold",
  auth: { base: "lg-semibold", md: "2lg-semibold" },
} as const satisfies Record<string, TextVariantProp>;

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  rightIcon?: ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant, size, fullWidth, type = "button", className, rightIcon, children, ...props },
  ref,
) {
  // 2026.07.26 정슬기 - [수정] null이면 cva defaultVariants를 타지 않으므로 resolved*로 통일
  const resolvedVariant = variant ?? "solid";
  const resolvedSize = size ?? "md";
  const resolvedFullWidth = fullWidth ?? false;

  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        buttonVariants({
          variant: resolvedVariant,
          size: resolvedSize,
          fullWidth: resolvedFullWidth,
        }),
        className,
      )}
      {...props}
    >
      <Text as="span" variant={buttonTextVariant[resolvedSize]}>
        {children}
      </Text>
      {rightIcon}
    </button>
  );
});

export { buttonVariants };
export default Button;
