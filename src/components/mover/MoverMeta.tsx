import { Text } from "@/components/common/Text";
import { StarIcon } from "@/icons";
import { cn } from "@/lib/utils/cn";

interface MoverMetaProps {
  rating: number;
  reviewCount: number;
  careerYears: number;
  confirmedCount: number;
  className?: string;
}

const dividerClassName = cn(
  "after:bg-border-default",
  "after:h-14 after:w-px after:shrink-0 after:self-center",
  "after:ml-4 after:content-['']",
);

/** 기사님 평점·경력·확정 건수 요약 행 */
export default function MoverMeta({
  rating,
  reviewCount,
  careerYears,
  confirmedCount,
  className,
}: MoverMetaProps) {
  return (
    <dl className={cn("flex flex-wrap items-center gap-6", className)}>
      {/* 평점·리뷰 수 */}
      <div className={cn("flex items-center gap-2", dividerClassName)}>
        <dt className="sr-only">평점</dt>
        <dd className="m-0 flex items-center gap-2">
          <StarIcon
            className="text-rating-fill size-20 shrink-0 -translate-y-px"
            aria-hidden="true"
          />

          <Text as="span" variant="sm-medium" className="text-text-secondary">
            {rating.toFixed(1)}
          </Text>
          <span className="sr-only">점</span>
        </dd>

        <dt className="sr-only">리뷰 수</dt>
        <dd className="m-0">
          <Text as="span" variant="sm-medium" className="text-text-muted" aria-hidden="true">
            ({reviewCount})
          </Text>
          <span className="sr-only">{reviewCount}개</span>
        </dd>
      </div>

      {/* 경력 */}
      <div className={cn("flex items-center gap-4", dividerClassName)}>
        <dt>
          <Text as="span" variant="sm-medium" className="text-text-muted">
            경력
          </Text>
        </dt>

        <dd className="m-0">
          <Text as="span" variant="sm-medium" className="text-text-secondary">
            {careerYears}년
          </Text>
        </dd>
      </div>

      {/* 확정 견적 수 */}
      <div className="flex items-center gap-4">
        <dt className="order-2">
          <Text as="span" variant="sm-medium" className="text-text-muted" aria-hidden="true">
            확정
          </Text>
          <span className="sr-only">확정 건수</span>
        </dt>

        <dd className="order-1 m-0">
          <Text as="span" variant="sm-medium" className="text-text-secondary">
            {confirmedCount}건
          </Text>
        </dd>
      </div>
    </dl>
  );
}
