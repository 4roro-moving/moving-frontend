import type { MoverReviewItem, MoverReviewListQuery, MoverReviewListResult } from "@/types/review";

/** 페이지네이션 UI 확인용 — 시드 수정 후 제거 */
const MOCK_REVIEW_TOTAL = 45;
const MOCK_PAGE_LIMIT = 5;

const MOCK_CONTENTS = [
  "듣던대로 정말 친절하시고 물건도 잘 옮겨주셨어요!\n나중에 또 짐 옮길 일 생기면 부탁드릴 예정입니다!!",
  "비 오는데도 꼼꼼히 잘 해주셔서 감사드립니다 :)",
  "시간 약속을 잘 지켜주셔서 좋았어요.",
  "포장이 꼼꼼해서 파손 없이 이사 완료했습니다.",
  "응대가 빠르고 설명이 친절했어요.",
] as const;

function buildMockReviews(): MoverReviewItem[] {
  return Array.from({ length: MOCK_REVIEW_TOTAL }, (_, index) => {
    const day = String((index % 28) + 1).padStart(2, "0");

    return {
      id: index + 1,
      rating: 5 - (index % 3 === 0 ? 1 : 0),
      content: MOCK_CONTENTS[index % MOCK_CONTENTS.length]!,
      createdAt: `2024-07-${day}T10:00:00.000Z`,
      customer: {
        id: `mock-customer-${index + 1}`,
        displayName: `kim${"*".repeat(4)}`,
        imageUrl: null,
      },
      estimateRequest: {
        id: 1000 + index,
        moveType: index % 2 === 0 ? "HOME" : "SMALL",
        moveDate: `2024-06-${day}`,
      },
    };
  });
}

/** GET /movers/:id/reviews 임시 mock (페이지네이션 테스트용) */
export function getMockMoverReviews(
  _moverId: string,
  query: MoverReviewListQuery = {},
): MoverReviewListResult {
  const page = query.page ?? 1;
  const limit = query.limit ?? MOCK_PAGE_LIMIT;
  const all = buildMockReviews();
  const totalCount = all.length;
  const totalPages = Math.ceil(totalCount / limit);
  const start = (page - 1) * limit;

  return {
    reviews: all.slice(start, start + limit),
    pagination: {
      page,
      limit,
      totalCount,
      totalPages,
      hasNext: page < totalPages,
    },
  };
}
