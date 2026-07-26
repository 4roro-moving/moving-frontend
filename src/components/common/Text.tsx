import { cva, type VariantProps } from "class-variance-authority";
import { type ComponentPropsWithoutRef, type ElementType, type ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

const textVariants = cva("tracking-[var(--letter-spacing-0)]", {
  variants: {
    variant: {
      "xs-regular":
        "text-[length:var(--font-size-12)] leading-[var(--line-height-18)] font-regular",
      "xs-medium": "text-[length:var(--font-size-12)] leading-[var(--line-height-18)] font-medium",
      "xs-semibold":
        "text-[length:var(--font-size-12)] leading-[var(--line-height-18)] font-semibold",

      "sm-medium": "text-[length:var(--font-size-13)] leading-[var(--line-height-22)] font-medium",
      "sm-semibold":
        "text-[length:var(--font-size-13)] leading-[var(--line-height-22)] font-semibold",

      "md-regular":
        "text-[length:var(--font-size-14)] leading-[var(--line-height-24)] font-regular",
      "md-medium": "text-[length:var(--font-size-14)] leading-[var(--line-height-24)] font-medium",
      "md-semibold":
        "text-[length:var(--font-size-14)] leading-[var(--line-height-24)] font-semibold",
      "md-bold": "text-[length:var(--font-size-14)] leading-[var(--line-height-24)] font-bold",

      "lg-regular":
        "text-[length:var(--font-size-16)] leading-[var(--line-height-26)] font-regular",
      "lg-medium": "text-[length:var(--font-size-16)] leading-[var(--line-height-26)] font-medium",
      "lg-semibold":
        "text-[length:var(--font-size-16)] leading-[var(--line-height-26)] font-semibold",
      "lg-bold": "text-[length:var(--font-size-16)] leading-[var(--line-height-26)] font-bold",

      "2lg-regular":
        "text-[length:var(--font-size-18)] leading-[var(--line-height-26)] font-regular",
      "2lg-medium": "text-[length:var(--font-size-18)] leading-[var(--line-height-26)] font-medium",
      "2lg-semibold":
        "text-[length:var(--font-size-18)] leading-[var(--line-height-26)] font-semibold",
      "2lg-bold": "text-[length:var(--font-size-18)] leading-[var(--line-height-26)] font-bold",

      "xl-regular":
        "text-[length:var(--font-size-20)] leading-[var(--line-height-32)] font-regular",
      "xl-medium": "text-[length:var(--font-size-20)] leading-[var(--line-height-32)] font-medium",
      "xl-semibold":
        "text-[length:var(--font-size-20)] leading-[var(--line-height-32)] font-semibold",
      "xl-bold": "text-[length:var(--font-size-20)] leading-[var(--line-height-32)] font-bold",

      "2xl-regular":
        "text-[length:var(--font-size-24)] leading-[var(--line-height-32)] font-regular",
      "2xl-medium": "text-[length:var(--font-size-24)] leading-[var(--line-height-32)] font-medium",
      "2xl-semibold":
        "text-[length:var(--font-size-24)] leading-[var(--line-height-32)] font-semibold",
      "2xl-bold": "text-[length:var(--font-size-24)] leading-[var(--line-height-32)] font-bold",

      "3xl-semibold":
        "text-[length:var(--font-size-32)] leading-[var(--line-height-46)] font-semibold",
      "3xl-bold": "text-[length:var(--font-size-32)] leading-[var(--line-height-46)] font-bold",

      "link-xs":
        "text-[length:var(--font-size-12)] leading-[var(--line-height-18)] font-semibold underline",
      "link-xl":
        "text-[length:var(--font-size-20)] leading-[var(--line-height-32)] font-semibold underline",

      "rating-score": "text-[length:var(--font-size-40)] leading-[var(--line-height-48)] font-bold",
    },
  },
  defaultVariants: {
    variant: "md-regular",
  },
});

export type TextVariant = NonNullable<VariantProps<typeof textVariants>["variant"]>;

/** 모바일(base) / 태블릿(md) / 데스크톱(lg)별 Text Style */
export interface ResponsiveTextVariant {
  base: TextVariant;
  md?: TextVariant;
  lg?: TextVariant;
}

export type TextVariantProp = TextVariant | ResponsiveTextVariant;

type TextOwnProps<T extends ElementType> = {
  as?: T;
  children: ReactNode;
  className?: string;
  variant?: TextVariantProp;
};

type TextProps<T extends ElementType> = TextOwnProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof TextOwnProps<T>>;

function isResponsiveTextVariant(variant: TextVariantProp): variant is ResponsiveTextVariant {
  return typeof variant === "object" && variant !== null && "base" in variant;
}

function prefixBreakpointClasses(classNames: string, breakpoint: "md" | "lg") {
  return classNames
    .split(/\s+/)
    .filter(Boolean)
    .map((className) => `${breakpoint}:${className}`)
    .join(" ");
}

/** Text / input 등에서 Figma Text Style 클래스를 재사용할 때 사용 */
export function getTextVariantClass(variant: TextVariantProp | undefined) {
  if (!variant) {
    return textVariants({ variant: "md-regular" });
  }

  if (!isResponsiveTextVariant(variant)) {
    return textVariants({ variant });
  }

  return cn(
    textVariants({ variant: variant.base }),
    variant.md && prefixBreakpointClasses(textVariants({ variant: variant.md }), "md"),
    variant.lg && prefixBreakpointClasses(textVariants({ variant: variant.lg }), "lg"),
  );
}

/**
 * Figma Text Style을 코드에서 재사용하기 위한 공통 텍스트 컴포넌트
 *
 * - `variant`는 Figma의 Text Style 이름(Text/Lg/Semibold 등)에 대응합니다.
 * - 반응형이 필요하면 `{ base, md?, lg? }` 객체를 넘깁니다.
 * - 색상은 포함하지 않고, 전역 기본 텍스트 색 또는 semantic color className으로 제어합니다.
 * - `as` prop으로 p, span, h1, strong, label 등 의미에 맞는 HTML 태그를 선택할 수 있습니다.
 *
 * Example:
 * <Text as="span" variant="md-medium" className="text-text-muted">
 *   전체 결과 8건
 * </Text>
 *
 *  화면 사이즈에 따라 Text Style이 달라져야 할 경우
 * <Text
 *   as="h1"
 *   variant={{ base: "2lg-semibold", lg: "2xl-semibold" }}
 *   className="text-text-primary"
 * >
 *   기사님 찾기
 * </Text>
 */
export function Text<T extends ElementType = "p">({
  as,
  variant,
  children,
  className,
  ...props
}: TextProps<T>) {
  const Component = as ?? "span";

  return (
    <Component className={cn(getTextVariantClass(variant), className)} {...props}>
      {children}
    </Component>
  );
}
