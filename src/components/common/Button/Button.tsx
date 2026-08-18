import { cva, type VariantProps } from "class-variance-authority";
import Link, { type LinkProps } from "next/link";
import {
  forwardRef,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type ForwardedRef,
  type MouseEvent,
  type ReactNode,
} from "react";

import { Text, type TextVariantProp } from "@/components/common/Text";
import { cn } from "@/lib/utils/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-4 transition-colors disabled:cursor-not-allowed aria-disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        solid:
          "bg-background-brand text-text-inverse hover:bg-background-brand-hover disabled:bg-background-disabled disabled:text-text-inverse disabled:hover:bg-background-disabled aria-disabled:bg-background-disabled aria-disabled:text-text-inverse aria-disabled:hover:bg-background-disabled",
        outline:
          "border border-1 border-border-brand bg-background-surface text-text-brand hover:bg-background-brand-muted disabled:border-border-disabled disabled:text-text-disabled disabled:hover:bg-background-surface aria-disabled:border-border-disabled aria-disabled:text-text-disabled aria-disabled:hover:bg-background-surface",
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

// 일반 버튼, 링크 버튼의 공통 props
interface ButtonCommonProps extends VariantProps<typeof buttonVariants> {
  rightIcon?: ReactNode;
}

// 일반 버튼 props */
type NativeButtonProps = ButtonCommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: never;
  };

/** href가 있으면 Next.js Link로 렌더링하는 버튼 props */
type LinkButtonProps = ButtonCommonProps &
  // Anchor와 Next Link의 href를 제거한 뒤, 아래에서 Next Link 기준의 필수 prop으로 통일
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> &
  Omit<LinkProps, "href"> & {
    href: LinkProps["href"];
    /** <a>에는 disabled가 없으므로 Button의 비활성 동작을 위해 별도로 지원 */
    disabled?: boolean;
  };

export type ButtonProps = NativeButtonProps | LinkButtonProps;

function getButtonClassName(
  variant: ButtonCommonProps["variant"],
  size: ButtonCommonProps["size"],
  fullWidth: ButtonCommonProps["fullWidth"],
  className?: string,
) {
  const resolvedVariant = variant ?? "solid";
  const resolvedSize = size ?? "md";

  return cn(
    buttonVariants({
      variant: resolvedVariant,
      size: resolvedSize,
      fullWidth: fullWidth ?? false,
    }),
    className,
  );
}

function ButtonContent({
  children,
  rightIcon,
  size,
}: {
  children?: ReactNode;
  rightIcon?: ReactNode;
  size: ButtonCommonProps["size"];
}) {
  const resolvedSize = size ?? "md";

  return (
    <>
      <Text as="span" variant={buttonTextVariant[resolvedSize]}>
        {children}
      </Text>
      {rightIcon}
    </>
  );
}

const NativeButton = forwardRef<HTMLButtonElement, NativeButtonProps>(function NativeButton(
  { variant, size, fullWidth, className, rightIcon, children, type = "button", ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={getButtonClassName(variant, size, fullWidth, className)}
      {...props}
    >
      <ButtonContent size={size} rightIcon={rightIcon}>
        {children}
      </ButtonContent>
    </button>
  );
});

const LinkButton = forwardRef<HTMLAnchorElement, LinkButtonProps>(function LinkButton(
  { href, variant, size, fullWidth, className, rightIcon, children, disabled, onClick, ...props },
  ref,
) {
  // <a>는 disabled를 지원하지 않아 이동을 직접 차단
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (disabled) {
      event.preventDefault();
      return;
    }

    onClick?.(event);
  };

  return (
    <Link
      ref={ref}
      href={href}
      className={getButtonClassName(variant, size, fullWidth, className)}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : undefined}
      onClick={handleClick}
      {...props}
    >
      <ButtonContent size={size} rightIcon={rightIcon}>
        {children}
      </ButtonContent>
    </Link>
  );
});

// href 유무에 따라 실제 요소와 ref 타입을 맞춰 렌더링
const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  function Button(props, ref) {
    if (props.href) {
      return <LinkButton ref={ref as ForwardedRef<HTMLAnchorElement>} {...props} />;
    }

    return (
      <NativeButton
        ref={ref as ForwardedRef<HTMLButtonElement>}
        {...(props as NativeButtonProps)}
      />
    );
  },
);

export { buttonVariants };
export default Button;
