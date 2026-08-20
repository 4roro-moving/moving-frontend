import { Text, type TextVariantProp } from "@/components/common/Text";
import { StarIcon } from "@/icons";
import { cn } from "@/lib/utils/cn";
import { formatResidenceReviewRating } from "@/lib/utils/residenceReviewFormat";

interface ResidenceReviewRatingTextProps {
  rating: number;
  starClassName?: string;
  textVariant?: TextVariantProp;
  textClassName?: string;
  className?: string;
}

const ResidenceReviewRatingText = ({
  rating,
  starClassName = "size-20",
  textVariant = "sm-medium",
  textClassName = "text-text-secondary",
  className,
}: ResidenceReviewRatingTextProps) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <StarIcon className={cn("text-rating-fill shrink-0", starClassName)} aria-hidden="true" />
      <Text as="span" variant={textVariant} className={textClassName}>
        {formatResidenceReviewRating(rating)}
      </Text>
    </div>
  );
};

export default ResidenceReviewRatingText;
