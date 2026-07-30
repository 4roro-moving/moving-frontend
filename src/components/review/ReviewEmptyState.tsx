import EmptyState from "@/components/common/EmptyState/EmptyState";

type ReviewEmptyVariant = "writable" | "my";

interface ReviewEmptyStateProps {
  variant: ReviewEmptyVariant;
}

const EMPTY_COPY: Record<ReviewEmptyVariant, { line1: string; line2: string }> = {
  writable: {
    line1: "작성 가능한 리뷰가 없습니다.",
    line2: "이사가 완료되면 기사님에 대한 리뷰를 작성할 수 있어요.",
  },
  my: {
    line1: "아직 작성한 리뷰가 없습니다.",
    line2: "이용한 기사님에 대한 경험을 남겨보세요.",
  },
};

// 2026.07.27 정슬기 - [추가] 리뷰 목록 빈 상태
export default function ReviewEmptyState({ variant }: ReviewEmptyStateProps) {
  const copy = EMPTY_COPY[variant];

  return (
    <EmptyState
      imageSrc="/images/empty/moving-car.png"
      description={
        <>
          {copy.line1}
          <br />
          {copy.line2}
        </>
      }
      imageAlt=""
    />
  );
}
