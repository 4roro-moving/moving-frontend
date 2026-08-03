import { Text } from "@/components/common/Text";
import ReviewStarRating from "@/components/review/ReviewStarRating";
import { cn } from "@/lib/utils/cn";
import { formatDateOnlyLabel } from "@/lib/utils/estimateFormat";
import type { MoverReviewItem } from "@/types/review";

interface MoverReviewListProps {
  isFetching: boolean;
  reviews: MoverReviewItem[];
}

export default function MoverReviewList({ isFetching, reviews }: MoverReviewListProps) {
  return (
    <ul className="flex w-full flex-col" aria-busy={isFetching}>
      {reviews.map((review, index) => (
        <li
          key={review.id}
          className={cn(
            "border-border-subtle py-20 md:py-24",
            index < reviews.length - 1 && "border-b",
          )}
        >
          <MoverReviewListItem review={review} />
        </li>
      ))}
    </ul>
  );
}

function MoverReviewListItem({ review }: { review: MoverReviewItem }) {
  return (
    <article className="flex w-full flex-col gap-16 md:gap-24">
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-12">
          <Text
            as="p"
            variant={{ base: "md-regular", md: "2lg-regular" }}
            className="text-text-secondary"
          >
            {review.customer.displayName}
          </Text>
          <span className="bg-border-subtle h-12 w-px" aria-hidden="true" />
          <Text
            as="time"
            dateTime={review.createdAt}
            variant={{ base: "md-regular", md: "2lg-regular" }}
            className="text-text-muted"
          >
            {formatDateOnlyLabel(review.createdAt)}
          </Text>
        </div>
        <ReviewStarRating value={review.rating} size="sm" label="리뷰 별점" />
      </div>
      <Text
        as="p"
        variant={{ base: "md-regular", md: "2lg-regular" }}
        className="text-text-primary whitespace-pre-line"
      >
        {review.content}
      </Text>
    </article>
  );
}
