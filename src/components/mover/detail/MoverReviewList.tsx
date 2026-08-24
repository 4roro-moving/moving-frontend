import { Text } from "@/components/common/Text";
import ReviewStarRating from "@/components/review/ReviewStarRating";
import { cn } from "@/lib/utils/cn";
import { PREVIOUS_DATA_LOADING_CLASS_NAME } from "@/lib/constants/loading";
import { formatDateOnlyLabel } from "@/lib/utils/estimateFormat";
import type { MoverReviewItem } from "@/types/review";

interface MoverReviewListProps {
  isFetching: boolean;
  isPreviousDataLoading: boolean;
  reviews: MoverReviewItem[];
}

export default function MoverReviewList({
  isFetching,
  isPreviousDataLoading,
  reviews,
}: MoverReviewListProps) {
  return (
    <ul
      className={cn(
        "flex w-full flex-col",
        isPreviousDataLoading && PREVIOUS_DATA_LOADING_CLASS_NAME,
      )}
      aria-busy={isFetching}
    >
      {isPreviousDataLoading ? (
        <li className="sr-only" role="status">
          리뷰 목록을 불러오는 중이에요
        </li>
      ) : null}
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
