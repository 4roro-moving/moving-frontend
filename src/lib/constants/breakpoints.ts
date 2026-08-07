/**
 * Tailwind breakpoint와 동일한 기준입니다.
 * - Mobile: 기본 (0px~)
 * - Tablet: md, 768px~
 * - Desktop: xl, 1280px~
 */
export const BREAKPOINTS = {
  md: 768,
  xl: 1280,
} as const;

export const MEDIA_QUERY = {
  md: `(min-width: ${BREAKPOINTS.md}px)`,
  xl: `(min-width: ${BREAKPOINTS.xl}px)`,
} as const;
