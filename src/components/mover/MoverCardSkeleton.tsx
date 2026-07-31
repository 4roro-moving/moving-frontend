import { Skeleton } from "@/components/common/Skeleton/Skeleton";
import { cn } from "@/lib/utils/cn";

interface MoverCardSkeletonProps {
  variant?: "full" | "compact";
  className?: string;
  /** 찜 목록처럼 우상단 체크박스 자리를 스켈레톤으로 표시 */
  showSelection?: boolean;
}

const CARD_SHADOW =
  "shadow-[-2px_-2px_10px_0px_rgba(220,220,220,0.2),2px_2px_10px_0px_rgba(220,220,220,0.2)]";

function CompactMoverCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "border-border-subtle bg-background-surface rounded-16 flex w-full flex-col gap-20 border-[0.5px] p-20",
        CARD_SHADOW,
        className,
      )}
    >
      <div className="flex flex-col gap-12">
        <Skeleton className="h-28 w-72 rounded-full" />
        <div className="flex flex-col gap-16">
          <Skeleton className="h-24 w-4/5" />
          <div className="flex items-center gap-8">
            <Skeleton className="rounded-12 size-48 shrink-0" />
            <div className="flex min-w-0 flex-1 flex-col gap-8">
              <div className="flex items-center justify-between gap-8">
                <Skeleton className="h-20 w-120" />
                <Skeleton className="size-20 shrink-0 rounded-full" />
              </div>
              <Skeleton className="h-16 w-full max-w-[200px]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FullMoverCardSkeleton({
  className,
  showSelection = false,
}: {
  className?: string;
  showSelection?: boolean;
}) {
  return (
    <div
      className={cn(
        "border-border-subtle bg-background-surface flex w-full flex-col border-[0.5px]",
        "rounded-16 gap-8 p-20",
        "min-[744px]:rounded-20 min-[744px]:gap-20 min-[744px]:px-28 min-[744px]:py-24",
        CARD_SHADOW,
        className,
      )}
    >
      {/* Mobile */}
      <div className="flex flex-col gap-8 min-[744px]:hidden">
        <div className="flex min-h-36 items-center justify-between gap-8">
          <Skeleton className="h-28 w-72 rounded-full" />
          {showSelection ? <Skeleton className="rounded-4 size-36 shrink-0" /> : null}
        </div>
        <div className="flex w-full flex-col gap-16">
          <div className="flex flex-col gap-8">
            <Skeleton className="h-24 w-3/4" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-2/3" />
          </div>
          <div className="bg-border-subtle h-px w-full" aria-hidden="true" />
          <div className="flex items-center gap-8">
            <Skeleton className="rounded-12 size-50 shrink-0" />
            <div className="flex min-w-0 flex-1 flex-col gap-8">
              <div className="flex items-center justify-between gap-8">
                <Skeleton className="h-20 w-120" />
                <Skeleton className="size-24 shrink-0 rounded-full" />
              </div>
              <Skeleton className="h-16 w-full max-w-[220px]" />
            </div>
          </div>
        </div>
      </div>

      {/* Tablet / Desktop */}
      <div className="hidden min-[744px]:contents">
        <div className="flex min-h-36 items-center justify-between gap-8">
          <Skeleton className="h-32 w-120 rounded-full" />
          {showSelection ? <Skeleton className="rounded-4 size-36 shrink-0" /> : null}
        </div>
        <div className="flex flex-row items-start gap-20">
          <Skeleton className="rounded-12 size-[134px] shrink-0" />
          <div className="flex min-w-0 flex-1 flex-col gap-20 self-stretch py-4">
            <div className="flex flex-col gap-8">
              <Skeleton className="h-28 w-3/5" />
              <Skeleton className="h-20 w-4/5" />
            </div>
            <div className="flex items-end justify-between gap-12">
              <div className="flex min-w-0 flex-1 flex-col gap-8">
                <Skeleton className="h-24 w-160" />
                <Skeleton className="h-16 w-full max-w-[280px]" />
              </div>
              <Skeleton className="size-24 shrink-0 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** MoverCard full/compact 레이아웃에 맞춘 로딩 스켈레톤 */
export function MoverCardSkeleton({
  variant = "full",
  className,
  showSelection = false,
}: MoverCardSkeletonProps) {
  if (variant === "compact") {
    return <CompactMoverCardSkeleton className={className} />;
  }

  return <FullMoverCardSkeleton className={className} showSelection={showSelection} />;
}

interface MoverCardSkeletonListProps {
  variant?: "full" | "compact";
  count: number;
  className?: string;
  itemClassName?: string;
  showSelection?: boolean;
  /** 접근성용 로딩 안내 */
  label?: string;
}

export function MoverCardSkeletonList({
  variant = "full",
  count,
  className,
  itemClassName,
  showSelection = false,
  label = "기사님 목록을 불러오는 중",
}: MoverCardSkeletonListProps) {
  return (
    <ul
      className={cn("flex flex-col", variant === "compact" ? "gap-16" : "gap-20", className)}
      aria-busy="true"
      aria-label={label}
    >
      {Array.from({ length: count }, (_, index) => (
        <li key={index}>
          <MoverCardSkeleton
            variant={variant}
            className={itemClassName}
            showSelection={showSelection}
          />
        </li>
      ))}
    </ul>
  );
}
