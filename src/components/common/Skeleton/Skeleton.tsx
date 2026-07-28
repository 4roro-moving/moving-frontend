import { cn } from "@/lib/utils/cn";

interface SkeletonProps {
  className?: string;
}

/** 로딩 placeholder. 색상은 디자인 토큰 `background-muted` 사용 */
export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("bg-background-muted rounded-8 animate-pulse", className)}
    />
  );
}
