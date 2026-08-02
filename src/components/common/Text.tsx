import { cva } from "class-variance-authority";
import { type ComponentPropsWithoutRef, type ElementType, type ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

/**
 * Figma Text Style → Tailwind 클래스 맵
 *
 * `variant` 사용 방식 (우선순위: 역할명 → 반응형 객체 → 원자 스타일)
 * 1. 역할(semantic): `pageTitle`, `fieldLabel` …
 * 2. 반응형 객체: `{ base, md?, lg? }`
 * 3. 원자 스타일: `lg-semibold` (Figma Text/Lg/Semibold)
 *
 * md:/lg: 클래스는 런타임 문자열 연결이 아니라 아래 맵에 리터럴로 둬야 Tailwind가 CSS를 생성합니다.
 */

/** base (모바일 기본) */
const TEXT_VARIANT_STYLES = {
  "xs-regular": "text-[length:var(--font-size-12)] leading-[var(--line-height-18)] font-regular",
  "xs-medium": "text-[length:var(--font-size-12)] leading-[var(--line-height-18)] font-medium",
  "xs-semibold": "text-[length:var(--font-size-12)] leading-[var(--line-height-18)] font-semibold",

  "sm-medium": "text-[length:var(--font-size-13)] leading-[var(--line-height-22)] font-medium",
  "sm-semibold": "text-[length:var(--font-size-13)] leading-[var(--line-height-22)] font-semibold",

  "md-regular": "text-[length:var(--font-size-14)] leading-[var(--line-height-24)] font-regular",
  "md-medium": "text-[length:var(--font-size-14)] leading-[var(--line-height-24)] font-medium",
  "md-semibold": "text-[length:var(--font-size-14)] leading-[var(--line-height-24)] font-semibold",
  "md-bold": "text-[length:var(--font-size-14)] leading-[var(--line-height-24)] font-bold",

  "lg-regular": "text-[length:var(--font-size-16)] leading-[var(--line-height-26)] font-regular",
  "lg-medium": "text-[length:var(--font-size-16)] leading-[var(--line-height-26)] font-medium",
  "lg-semibold": "text-[length:var(--font-size-16)] leading-[var(--line-height-26)] font-semibold",
  "lg-bold": "text-[length:var(--font-size-16)] leading-[var(--line-height-26)] font-bold",

  "2lg-regular": "text-[length:var(--font-size-18)] leading-[var(--line-height-26)] font-regular",
  "2lg-medium": "text-[length:var(--font-size-18)] leading-[var(--line-height-26)] font-medium",
  "2lg-semibold": "text-[length:var(--font-size-18)] leading-[var(--line-height-26)] font-semibold",
  "2lg-bold": "text-[length:var(--font-size-18)] leading-[var(--line-height-26)] font-bold",

  "xl-regular": "text-[length:var(--font-size-20)] leading-[var(--line-height-32)] font-regular",
  "xl-medium": "text-[length:var(--font-size-20)] leading-[var(--line-height-32)] font-medium",
  "xl-semibold": "text-[length:var(--font-size-20)] leading-[var(--line-height-32)] font-semibold",
  "xl-bold": "text-[length:var(--font-size-20)] leading-[var(--line-height-32)] font-bold",

  "2xl-regular": "text-[length:var(--font-size-24)] leading-[var(--line-height-32)] font-regular",
  "2xl-medium": "text-[length:var(--font-size-24)] leading-[var(--line-height-32)] font-medium",
  "2xl-semibold": "text-[length:var(--font-size-24)] leading-[var(--line-height-32)] font-semibold",
  "2xl-bold": "text-[length:var(--font-size-24)] leading-[var(--line-height-32)] font-bold",

  "3xl-semibold": "text-[length:var(--font-size-32)] leading-[var(--line-height-46)] font-semibold",
  "3xl-bold": "text-[length:var(--font-size-32)] leading-[var(--line-height-46)] font-bold",

  "link-xs":
    "text-[length:var(--font-size-12)] leading-[var(--line-height-18)] font-semibold underline",
  "link-xl":
    "text-[length:var(--font-size-20)] leading-[var(--line-height-32)] font-semibold underline",

  "rating-score": "text-[length:var(--font-size-40)] leading-[var(--line-height-48)] font-medium",
} as const;

/** md: (태블릿) — 키는 TEXT_VARIANT_STYLES와 동일 */
const TEXT_VARIANT_STYLES_MD = {
  "xs-regular":
    "md:text-[length:var(--font-size-12)] md:leading-[var(--line-height-18)] md:font-regular",
  "xs-medium":
    "md:text-[length:var(--font-size-12)] md:leading-[var(--line-height-18)] md:font-medium",
  "xs-semibold":
    "md:text-[length:var(--font-size-12)] md:leading-[var(--line-height-18)] md:font-semibold",

  "sm-medium":
    "md:text-[length:var(--font-size-13)] md:leading-[var(--line-height-22)] md:font-medium",
  "sm-semibold":
    "md:text-[length:var(--font-size-13)] md:leading-[var(--line-height-22)] md:font-semibold",

  "md-regular":
    "md:text-[length:var(--font-size-14)] md:leading-[var(--line-height-24)] md:font-regular",
  "md-medium":
    "md:text-[length:var(--font-size-14)] md:leading-[var(--line-height-24)] md:font-medium",
  "md-semibold":
    "md:text-[length:var(--font-size-14)] md:leading-[var(--line-height-24)] md:font-semibold",
  "md-bold": "md:text-[length:var(--font-size-14)] md:leading-[var(--line-height-24)] md:font-bold",

  "lg-regular":
    "md:text-[length:var(--font-size-16)] md:leading-[var(--line-height-26)] md:font-regular",
  "lg-medium":
    "md:text-[length:var(--font-size-16)] md:leading-[var(--line-height-26)] md:font-medium",
  "lg-semibold":
    "md:text-[length:var(--font-size-16)] md:leading-[var(--line-height-26)] md:font-semibold",
  "lg-bold": "md:text-[length:var(--font-size-16)] md:leading-[var(--line-height-26)] md:font-bold",

  "2lg-regular":
    "md:text-[length:var(--font-size-18)] md:leading-[var(--line-height-26)] md:font-regular",
  "2lg-medium":
    "md:text-[length:var(--font-size-18)] md:leading-[var(--line-height-26)] md:font-medium",
  "2lg-semibold":
    "md:text-[length:var(--font-size-18)] md:leading-[var(--line-height-26)] md:font-semibold",
  "2lg-bold":
    "md:text-[length:var(--font-size-18)] md:leading-[var(--line-height-26)] md:font-bold",

  "xl-regular":
    "md:text-[length:var(--font-size-20)] md:leading-[var(--line-height-32)] md:font-regular",
  "xl-medium":
    "md:text-[length:var(--font-size-20)] md:leading-[var(--line-height-32)] md:font-medium",
  "xl-semibold":
    "md:text-[length:var(--font-size-20)] md:leading-[var(--line-height-32)] md:font-semibold",
  "xl-bold": "md:text-[length:var(--font-size-20)] md:leading-[var(--line-height-32)] md:font-bold",

  "2xl-regular":
    "md:text-[length:var(--font-size-24)] md:leading-[var(--line-height-32)] md:font-regular",
  "2xl-medium":
    "md:text-[length:var(--font-size-24)] md:leading-[var(--line-height-32)] md:font-medium",
  "2xl-semibold":
    "md:text-[length:var(--font-size-24)] md:leading-[var(--line-height-32)] md:font-semibold",
  "2xl-bold":
    "md:text-[length:var(--font-size-24)] md:leading-[var(--line-height-32)] md:font-bold",

  "3xl-semibold":
    "md:text-[length:var(--font-size-32)] md:leading-[var(--line-height-46)] md:font-semibold",
  "3xl-bold":
    "md:text-[length:var(--font-size-32)] md:leading-[var(--line-height-46)] md:font-bold",

  "link-xs":
    "md:text-[length:var(--font-size-12)] md:leading-[var(--line-height-18)] md:font-semibold md:underline",
  "link-xl":
    "md:text-[length:var(--font-size-20)] md:leading-[var(--line-height-32)] md:font-semibold md:underline",

  "rating-score":
    "md:text-[length:var(--font-size-40)] md:leading-[var(--line-height-48)] md:font-medium",
} as const;

/** lg: (데스크톱) — 키는 TEXT_VARIANT_STYLES와 동일 */
const TEXT_VARIANT_STYLES_LG = {
  "xs-regular":
    "lg:text-[length:var(--font-size-12)] lg:leading-[var(--line-height-18)] lg:font-regular",
  "xs-medium":
    "lg:text-[length:var(--font-size-12)] lg:leading-[var(--line-height-18)] lg:font-medium",
  "xs-semibold":
    "lg:text-[length:var(--font-size-12)] lg:leading-[var(--line-height-18)] lg:font-semibold",

  "sm-medium":
    "lg:text-[length:var(--font-size-13)] lg:leading-[var(--line-height-22)] lg:font-medium",
  "sm-semibold":
    "lg:text-[length:var(--font-size-13)] lg:leading-[var(--line-height-22)] lg:font-semibold",

  "md-regular":
    "lg:text-[length:var(--font-size-14)] lg:leading-[var(--line-height-24)] lg:font-regular",
  "md-medium":
    "lg:text-[length:var(--font-size-14)] lg:leading-[var(--line-height-24)] lg:font-medium",
  "md-semibold":
    "lg:text-[length:var(--font-size-14)] lg:leading-[var(--line-height-24)] lg:font-semibold",
  "md-bold": "lg:text-[length:var(--font-size-14)] lg:leading-[var(--line-height-24)] lg:font-bold",

  "lg-regular":
    "lg:text-[length:var(--font-size-16)] lg:leading-[var(--line-height-26)] lg:font-regular",
  "lg-medium":
    "lg:text-[length:var(--font-size-16)] lg:leading-[var(--line-height-26)] lg:font-medium",
  "lg-semibold":
    "lg:text-[length:var(--font-size-16)] lg:leading-[var(--line-height-26)] lg:font-semibold",
  "lg-bold": "lg:text-[length:var(--font-size-16)] lg:leading-[var(--line-height-26)] lg:font-bold",

  "2lg-regular":
    "lg:text-[length:var(--font-size-18)] lg:leading-[var(--line-height-26)] lg:font-regular",
  "2lg-medium":
    "lg:text-[length:var(--font-size-18)] lg:leading-[var(--line-height-26)] lg:font-medium",
  "2lg-semibold":
    "lg:text-[length:var(--font-size-18)] lg:leading-[var(--line-height-26)] lg:font-semibold",
  "2lg-bold":
    "lg:text-[length:var(--font-size-18)] lg:leading-[var(--line-height-26)] lg:font-bold",

  "xl-regular":
    "lg:text-[length:var(--font-size-20)] lg:leading-[var(--line-height-32)] lg:font-regular",
  "xl-medium":
    "lg:text-[length:var(--font-size-20)] lg:leading-[var(--line-height-32)] lg:font-medium",
  "xl-semibold":
    "lg:text-[length:var(--font-size-20)] lg:leading-[var(--line-height-32)] lg:font-semibold",
  "xl-bold": "lg:text-[length:var(--font-size-20)] lg:leading-[var(--line-height-32)] lg:font-bold",

  "2xl-regular":
    "lg:text-[length:var(--font-size-24)] lg:leading-[var(--line-height-32)] lg:font-regular",
  "2xl-medium":
    "lg:text-[length:var(--font-size-24)] lg:leading-[var(--line-height-32)] lg:font-medium",
  "2xl-semibold":
    "lg:text-[length:var(--font-size-24)] lg:leading-[var(--line-height-32)] lg:font-semibold",
  "2xl-bold":
    "lg:text-[length:var(--font-size-24)] lg:leading-[var(--line-height-32)] lg:font-bold",

  "3xl-semibold":
    "lg:text-[length:var(--font-size-32)] lg:leading-[var(--line-height-46)] lg:font-semibold",
  "3xl-bold":
    "lg:text-[length:var(--font-size-32)] lg:leading-[var(--line-height-46)] lg:font-bold",

  "link-xs":
    "lg:text-[length:var(--font-size-12)] lg:leading-[var(--line-height-18)] lg:font-semibold lg:underline",
  "link-xl":
    "lg:text-[length:var(--font-size-20)] lg:leading-[var(--line-height-32)] lg:font-semibold lg:underline",

  "rating-score":
    "lg:text-[length:var(--font-size-40)] lg:leading-[var(--line-height-48)] lg:font-medium",
} as const;

const textVariants = cva("tracking-[var(--letter-spacing-0)]", {
  variants: {
    variant: TEXT_VARIANT_STYLES,
  },
  defaultVariants: {
    variant: "md-regular",
  },
});

/** Figma 원자 Text Style 키 (예: Text/Lg/Semibold → `lg-semibold`) */
export type TextVariant = keyof typeof TEXT_VARIANT_STYLES;

/** breakpoint별 원자 스타일 조합 */
export interface ResponsiveTextVariant {
  base: TextVariant;
  md?: TextVariant;
  lg?: TextVariant;
}

/**
 * 같은 역할의 텍스트가 화면 크기마다 다른 Text Style을 사용할 때 쓰는 조합입니다.
 * 여러 화면에서 반복되는 조합만 semantic variant로 등록합니다.
 * 원자 Text Style과 구분하기 위해 역할 기반 camelCase 이름을 사용합니다.
 */
export const SEMANTIC_TEXT_VARIANTS = {
  pageTitle: { base: "2lg-semibold", lg: "2xl-semibold" },
  fieldLabel: { base: "lg-semibold", lg: "xl-semibold" },
  modalTitle: { base: "2lg-bold", lg: "2xl-semibold" },
} as const satisfies Record<string, ResponsiveTextVariant>;

export type SemanticTextVariant = keyof typeof SEMANTIC_TEXT_VARIANTS;

export type TextVariantProp = TextVariant | ResponsiveTextVariant | SemanticTextVariant;

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

function isSemanticTextVariant(variant: TextVariantProp): variant is SemanticTextVariant {
  return typeof variant === "string" && variant in SEMANTIC_TEXT_VARIANTS;
}

/** semantic 이름을 반응형 객체로 풀거나, 그대로 반환 */
function resolveTextVariant(variant: TextVariantProp): TextVariant | ResponsiveTextVariant {
  if (isSemanticTextVariant(variant)) {
    return SEMANTIC_TEXT_VARIANTS[variant];
  }
  return variant;
}

/** Text / Input 등에서 타이포 클래스만 필요할 때 */
export function getTextVariantClass(variant: TextVariantProp | undefined) {
  if (!variant) {
    return textVariants({ variant: "md-regular" });
  }

  const resolved = resolveTextVariant(variant);

  if (!isResponsiveTextVariant(resolved)) {
    return textVariants({ variant: resolved });
  }

  return cn(
    textVariants({ variant: resolved.base }),
    resolved.md && TEXT_VARIANT_STYLES_MD[resolved.md],
    resolved.lg && TEXT_VARIANT_STYLES_LG[resolved.lg],
  );
}

/**
 * 공통 텍스트 컴포넌트
 * `as`를 생략하면 기본적으로 span으로 렌더링합니다.
 *
 * @example
 * <Text variant="md-medium" className="text-text-muted">안내</Text>
 * <Text as="h1" variant="pageTitle">기사님 찾기</Text>
 * <Text as="label" variant="fieldLabel" htmlFor="email">이메일</Text>
 */
export function Text<T extends ElementType = "span">({
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
