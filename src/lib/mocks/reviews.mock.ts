import { buildMockPagination } from "@/lib/mocks/pagination";
import type {
  CreatedReview,
  CreateReviewInput,
  MyReviewItem,
  MyReviewListQuery,
  MyReviewListResult,
  ReviewableEstimateItem,
} from "@/types/review";

/**
 * 리뷰 mock 데이터
 * UI/훅에서는 직접 import하지 말고 `src/lib/api/reviews.ts` service만 사용합니다.
 * // 2026.07.27 정슬기 - [추가] 리뷰 mock (API 교체 전 확인용)
 */

let nextReviewId = 9001;

let mockReviewableEstimates: ReviewableEstimateItem[] = [
  {
    estimateId: 501,
    price: 180000,
    confirmedAt: "2026-06-20T03:00:00.000Z",
    estimateRequest: {
      id: 201,
      moveType: "SMALL",
      moveDate: "2026-06-18",
      fromAddress: "서울 중구 을지로 100",
      toAddress: "경기 성남시 분당구 정자일로 95",
      status: "COMPLETED",
    },
    mover: {
      id: "mover-kim",
      nickname: "김코드",
      imageUrl: null,
      career: 7,
      averageRating: 4.8,
      reviewCount: 128,
    },
  },
  {
    estimateId: 502,
    price: 320000,
    confirmedAt: "2026-06-12T05:30:00.000Z",
    estimateRequest: {
      id: 202,
      moveType: "HOME",
      moveDate: "2026-06-10",
      fromAddress: "서울 마포구 월드컵북로 396",
      toAddress: "인천 연수구 센트럴로 123",
      status: "COMPLETED",
    },
    mover: {
      id: "mover-lee",
      nickname: "이이사",
      imageUrl: null,
      career: 5,
      averageRating: 4.5,
      reviewCount: 86,
    },
  },
  {
    estimateId: 503,
    price: 450000,
    confirmedAt: "2026-05-28T02:10:00.000Z",
    estimateRequest: {
      id: 203,
      moveType: "OFFICE",
      moveDate: "2026-05-25",
      fromAddress: "서울 강남구 테헤란로 152",
      toAddress: "서울 송파구 올림픽로 300",
      status: "COMPLETED",
    },
    mover: {
      id: "mover-park",
      nickname: "박안전",
      imageUrl: null,
      career: 10,
      averageRating: 4.9,
      reviewCount: 210,
    },
  },
  {
    estimateId: 504,
    price: 210000,
    confirmedAt: "2026-05-15T08:00:00.000Z",
    estimateRequest: {
      id: 204,
      moveType: "SMALL",
      moveDate: "2026-05-12",
      fromAddress: "경기 고양시 일산동구 중앙로 1275",
      toAddress: "서울 은평구 통일로 480",
      status: "COMPLETED",
    },
    mover: {
      id: "mover-choi",
      nickname: "최친절",
      imageUrl: null,
      career: 3,
      averageRating: 4.2,
      reviewCount: 42,
    },
  },
  {
    estimateId: 505,
    price: 380000,
    confirmedAt: "2026-05-02T01:20:00.000Z",
    estimateRequest: {
      id: 205,
      moveType: "HOME",
      moveDate: "2026-04-30",
      fromAddress: "부산 해운대구 센텀중앙로 90",
      toAddress: "부산 수영구 광안해변로 219",
      status: "COMPLETED",
    },
    mover: {
      id: "mover-jung",
      nickname: "정든손",
      imageUrl: null,
      career: 8,
      averageRating: 4.7,
      reviewCount: 155,
    },
  },
  {
    estimateId: 506,
    price: 290000,
    confirmedAt: "2026-04-18T06:40:00.000Z",
    estimateRequest: {
      id: 206,
      moveType: "HOME",
      moveDate: "2026-04-15",
      fromAddress: "대전 유성구 대학로 99",
      toAddress: "세종특별자치시 한누리대로 2130",
      status: "COMPLETED",
    },
    mover: {
      id: "mover-han",
      nickname: "한믿음",
      imageUrl: null,
      career: 6,
      averageRating: 4.4,
      reviewCount: 73,
    },
  },
];

let mockMyReviews: MyReviewItem[] = [
  {
    id: 8001,
    estimateId: 401,
    rating: 5,
    content:
      "기사님이 시간 약속도 잘 지켜주시고, 짐도 조심히 옮겨주셨어요. 다음에도 부탁드리고 싶습니다.",
    createdAt: "2026-06-01T10:20:00.000Z",
    price: 250000,
    estimateRequest: {
      id: 111,
      moveType: "HOME",
      moveDate: "2026-05-28",
      fromAddress: "서울 서초구 서초대로 396",
      toAddress: "경기 용인시 수지구 광교중앙로 295",
    },
    mover: {
      id: "mover-kim",
      name: "김코드",
      nickname: "김코드",
      imageUrl: null,
      shortIntro: "안전하고 빠른 이사",
    },
  },
  {
    id: 8002,
    estimateId: 402,
    rating: 4,
    content: "전반적으로 만족스러웠습니다. 다만 도착 후 정리까지는 조금 더 꼼꼼했으면 좋겠어요.",
    createdAt: "2026-05-10T08:15:00.000Z",
    price: 170000,
    estimateRequest: {
      id: 112,
      moveType: "SMALL",
      moveDate: "2026-05-08",
      fromAddress: "서울 영등포구 여의대로 108",
      toAddress: "서울 동작구 흑석로 47",
    },
    mover: {
      id: "mover-lee",
      name: "이이사",
      nickname: "이이사",
      imageUrl: null,
      shortIntro: null,
    },
  },
  {
    id: 8003,
    estimateId: 403,
    rating: 5,
    content: "사무실 이사였는데 동선 파악이 빠르고 포장도 깔끔했습니다. 추천합니다!",
    createdAt: "2026-04-22T12:00:00.000Z",
    price: 520000,
    estimateRequest: {
      id: 113,
      moveType: "OFFICE",
      moveDate: "2026-04-20",
      fromAddress: "서울 종로구 종로 1",
      toAddress: "서울 성동구 왕십리로 222",
    },
    mover: {
      id: "mover-park",
      name: "박안전",
      nickname: "박안전",
      imageUrl: null,
      shortIntro: "사무실 이사 전문",
    },
  },
];

/** 테스트용: 내가 작성한 리뷰를 비울 때 사용 */
export function resetMockMyReviews(reviews: MyReviewItem[] = []) {
  mockMyReviews = reviews;
}

export function resetMockReviewableEstimates(items: ReviewableEstimateItem[]) {
  mockReviewableEstimates = items;
}

export function getMockReviewableEstimates(): ReviewableEstimateItem[] {
  return mockReviewableEstimates;
}

export function getMockMyReviews(query: MyReviewListQuery = {}): MyReviewListResult {
  const limit = query.limit ?? 5;
  const sorted = [...mockMyReviews].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
  const totalCount = sorted.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / limit) || 1);
  // 요청 page가 범위를 벗어나면 마지막 페이지로 보정 (빈 화면 방지)
  const page = totalCount === 0 ? 1 : Math.min(Math.max(1, query.page ?? 1), totalPages);
  const start = (page - 1) * limit;

  return {
    reviews: sorted.slice(start, start + limit),
    pagination: buildMockPagination(totalCount, page, limit),
  };
}

export function createMockReview(input: CreateReviewInput): CreatedReview {
  const target = mockReviewableEstimates.find((item) => item.estimateId === input.estimateId);

  if (!target) {
    throw new Error("작성 가능한 견적을 찾을 수 없습니다.");
  }

  const createdAt = new Date().toISOString();
  const review: MyReviewItem = {
    id: nextReviewId,
    estimateId: input.estimateId,
    rating: input.rating,
    content: input.content,
    createdAt,
    price: target.price,
    estimateRequest: {
      id: target.estimateRequest.id,
      moveType: target.estimateRequest.moveType,
      moveDate: target.estimateRequest.moveDate,
      fromAddress: target.estimateRequest.fromAddress,
      toAddress: target.estimateRequest.toAddress,
    },
    mover: {
      id: target.mover.id,
      name: target.mover.nickname ?? "기사님",
      nickname: target.mover.nickname,
      imageUrl: target.mover.imageUrl,
      shortIntro: null,
    },
  };

  nextReviewId += 1;
  mockMyReviews = [review, ...mockMyReviews];
  mockReviewableEstimates = mockReviewableEstimates.filter(
    (item) => item.estimateId !== input.estimateId,
  );

  return {
    id: review.id,
    estimateId: review.estimateId,
    rating: review.rating,
    content: review.content,
    createdAt: review.createdAt,
  };
}
