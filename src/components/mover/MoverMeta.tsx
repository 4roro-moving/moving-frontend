import { StarIcon } from "@/icons";

import { Text } from "@/components/common/Text";
import { cn } from "@/lib/utils/cn";

interface MoverMetaProps {
  rating: number;
  reviewCount: number;
  careerYears: number;
  confirmedCount: number;
  className?: string;
}

function MetaDivider() {
  return <span className="bg-border-default h-14 w-px shrink-0 self-center" aria-hidden="true" />;
}

/** 기사님 평점·경력·확정 건수 요약 행 */
export default function MoverMeta({
  rating,
  reviewCount,
  careerYears,
  confirmedCount,
  className,
}: MoverMetaProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-6", className)}>
      <div className="flex items-center gap-2">
        <StarIcon className="text-rating-fill size-20 shrink-0 -translate-y-px" />
        <Text as="span" variant="sm-medium" className="text-text-secondary">
          {rating.toFixed(1)}
        </Text>
        <Text as="span" variant="sm-medium" className="text-text-muted">
          ({reviewCount})
        </Text>
      </div>
      <MetaDivider />
      <div className="flex items-center gap-4">
        <Text as="span" variant="sm-medium" className="text-text-muted">
          경력
        </Text>
        <Text as="span" variant="sm-medium" className="text-text-secondary">
          {careerYears}년
        </Text>
      </div>
      <MetaDivider />
      <div className="flex items-center gap-4">
        <Text as="span" variant="sm-medium" className="text-text-secondary">
          {confirmedCount}건
        </Text>
        <Text as="span" variant="sm-medium" className="text-text-muted">
          확정
        </Text>
      </div>
    </div>
  );
}
