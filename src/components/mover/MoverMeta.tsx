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

/** 아이콘 옆에서는 line-height가 세로 정렬을 밀지 않도록 맞춤 */
const metaTextClassName = "leading-none";

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
      <div className={cn("flex items-center gap-2", dividerClassName)}>
        <dt className="sr-only">평점 및 리뷰 수</dt>
        <dd className="m-0 flex items-center gap-2">
          <StarIcon className="text-rating-fill size-20 shrink-0" aria-hidden="true" />
          <Text
            as="span"
            variant="sm-medium"
            className={cn("text-text-secondary", metaTextClassName)}
          >
            {rating.toFixed(1)}
          </Text>
          <span className="sr-only">점,</span>
          <Text
            as="span"
            variant="sm-medium"
            className={cn("text-text-muted", metaTextClassName)}
            aria-hidden="true"
          >
            ({reviewCount})
          </Text>
          <span className="sr-only">리뷰 {reviewCount}개</span>
        </dd>
      </div>

      <div className={cn("flex items-center gap-4", dividerClassName)}>
        <dt>
          <Text as="span" variant="sm-medium" className={cn("text-text-muted", metaTextClassName)}>
            경력
          </Text>
        </dt>
        <dd className="m-0 flex items-center">
          <Text
            as="span"
            variant="sm-medium"
            className={cn("text-text-secondary", metaTextClassName)}
          >
            {careerYears}년
          </Text>
        </dd>
      </div>

      <div className="flex items-center gap-4">
        <dt className="order-2 flex items-center">
          <Text
            as="span"
            variant="sm-medium"
            className={cn("text-text-muted", metaTextClassName)}
            aria-hidden="true"
          >
            확정
          </Text>
          <span className="sr-only">확정 건수</span>
        </dt>
        <dd className="order-1 m-0 flex items-center">
          <Text
            as="span"
            variant="sm-medium"
            className={cn("text-text-secondary", metaTextClassName)}
          >
            {confirmedCount}건
          </Text>
        </dd>
      </div>
    </dl>
  );
}
