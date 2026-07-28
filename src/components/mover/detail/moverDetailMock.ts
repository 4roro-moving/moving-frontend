import type { MoverDetail, MoverDetailReview } from "@/types/moverDetail";

const DEFAULT_PROFILE = "/images/profile-character.png";

/** 리뷰 목록 페이지당 개수 (페이지네이션 UI 확인용) */
export const MOVER_DETAIL_REVIEW_PAGE_LIMIT = 5;

const MOCK_REVIEW_TOTAL = 45;

const MOCK_REVIEW_CONTENTS = [
  "듣던대로 정말 친절하시고 물건도 잘 옮겨주셨어요!\n나중에 또 짐 옮길 일 생기면 김코드 기사님께 부탁드릴 예정입니다!!",
  "비 오는데도 꼼꼼히 잘 해주셔서 감사드립니다 :)",
  "시간 약속을 잘 지켜주셔서 좋았어요.",
  "포장이 꼼꼼해서 파손 없이 이사 완료했습니다.",
  "응대가 빠르고 설명이 친절했어요.",
] as const;

const MOCK_AUTHORS = ["kim****", "lee****", "park****", "choi****", "jung****"] as const;

function buildMockReviews(): MoverDetailReview[] {
  return Array.from({ length: MOCK_REVIEW_TOTAL }, (_, index) => {
    const day = String((index % 28) + 1).padStart(2, "0");

    return {
      id: `review-${index + 1}`,
      authorMasked: MOCK_AUTHORS[index % MOCK_AUTHORS.length]!,
      createdAt: `2024-07-${day}`,
      rating: 5 - (index % 3 === 0 ? 1 : 0),
      content: `[#${index + 1}] ${MOCK_REVIEW_CONTENTS[index % MOCK_REVIEW_CONTENTS.length]!}`,
    };
  });
}

const MOCK_REVIEWS = buildMockReviews();

/** NOTE: API 연동 전 기사님 상세 MOCK */
export const MOCK_MOVER_DETAILS: Record<string, MoverDetail> = {
  "1": {
    id: "1",
    name: "김코드",
    serviceTypes: ["SMALL", "HOME"],
    serviceAreas: [1, 9],
    title: "고객님의 물품을 안전하게 운송해 드립니다.",
    description:
      "안녕하세요. 이사업계 경력 7년으로 안전한 이사를 도와드리는 김코드입니다.\n고객님의 물품을 소중하고 안전하게 운송하여 드립니다. 소형이사 및 가정이사 서비스를 제공하며 서비스 가능 지역은 서울과 경기권입니다.",
    rating: 5.0,
    reviewCount: 178,
    careerYears: 7,
    confirmedCount: 334,
    favoriteCount: 136,
    isFavorite: false,
    profileImageSrc: DEFAULT_PROFILE,
    ratingDistribution: [
      { score: 5, count: 170 },
      { score: 4, count: 8 },
      { score: 3, count: 0 },
      { score: 2, count: 0 },
      { score: 1, count: 0 },
    ],
    reviews: MOCK_REVIEWS,
    reviewPageCount: Math.ceil(MOCK_REVIEW_TOTAL / MOVER_DETAIL_REVIEW_PAGE_LIMIT),
  },
  /** 리뷰 빈 상태 확인용 — `/movers/empty` */
  empty: {
    id: "empty",
    name: "김코드",
    serviceTypes: ["SMALL", "HOME"],
    serviceAreas: [1, 9],
    title: "고객님의 물품을 안전하게 운송해 드립니다.",
    description:
      "안녕하세요. 이사업계 경력 7년으로 안전한 이사를 도와드리는 김코드입니다. 고객님의 물품을 소중하고 안전하게 운송하여 드립니다. 소형이사 및 가정이사 서비스를 제공하며 서비스 가능 지역은 서울과 경기권입니다.",
    rating: 0,
    reviewCount: 0,
    careerYears: 7,
    confirmedCount: 334,
    favoriteCount: 136,
    isFavorite: false,
    profileImageSrc: DEFAULT_PROFILE,
    ratingDistribution: [
      { score: 5, count: 0 },
      { score: 4, count: 0 },
      { score: 3, count: 0 },
      { score: 2, count: 0 },
      { score: 1, count: 0 },
    ],
    reviews: [],
    reviewPageCount: 0,
  },
};

export function getMockMoverDetail(moverId: string): MoverDetail | null {
  if (MOCK_MOVER_DETAILS[moverId]) {
    return MOCK_MOVER_DETAILS[moverId];
  }

  // 목록 MOCK id와 맞추기 위해 기본 상세를 id만 바꿔 반환
  const fallback = MOCK_MOVER_DETAILS["1"];
  if (!fallback) {
    return null;
  }

  return {
    ...fallback,
    id: moverId,
  };
}
