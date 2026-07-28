import {
  createMockReview,
  getMockMyReviews,
  getMockReviewableEstimates,
} from "@/lib/mocks/reviews.mock";
import type {
  CreatedReview,
  CreateReviewInput,
  MyReviewListQuery,
  MyReviewListResult,
  ReviewableEstimateItem,
} from "@/types/review";

export const REVIEWABLE_PAGE_LIMIT = 5;
export const MY_REVIEW_PAGE_LIMIT = 5;

/**
 * 작성 가능한 리뷰(확정·완료·미작성) 전체 목록을 조회합니다.
 * 백엔드는 페이지네이션을 지원하지 않으므로 FE에서 limit 단위로 슬라이스합니다.
 *
 * 현재는 FE UI 검증용 mock을 반환합니다.
 * 실제 연동은 백엔드/환경 준비 후 아래 TODO의 fetchInstance 호출로 교체합니다.
 * // 2026.07.27 정슬기 - [추가] 작성 가능 리뷰 service (mock)
 * // 2026.07.27 정슬기 - [수정] 연동 예시를 axios → fetchInstance로 변경
 */
export async function fetchReviewableEstimates(): Promise<ReviewableEstimateItem[]> {
  // TODO: 실제 API 연동 시 아래 mock 블록을 제거하고 fetchInstance 호출로 교체
  // return fetchInstance.get<ReviewableEstimateItem[]>(API_ROUTES.REVIEWS.REVIEWABLE);

  await Promise.resolve();
  return getMockReviewableEstimates();
}

/**
 * 내가 작성한 리뷰 목록을 서버 페이지네이션으로 조회합니다.
 *
 * 현재는 FE UI 검증용 mock을 반환합니다. 실연동은 환경 준비 후 TODO 주석을 해제합니다.
 * // 2026.07.27 정슬기 - [추가] 내 리뷰 목록 service (mock)
 * // 2026.07.27 정슬기 - [수정] 범위 밖 page 재요청 보정 주석 추가
 * // 2026.07.27 정슬기 - [수정] 연동 예시를 axios → fetchInstance.getPaginated로 변경
 */
export async function fetchMyReviews(query: MyReviewListQuery = {}): Promise<MyReviewListResult> {
  const page = query.page ?? 1;
  const limit = query.limit ?? MY_REVIEW_PAGE_LIMIT;

  // TODO: 실제 API 연동 시 아래 mock 블록을 제거하고 fetchInstance 호출로 교체
  // const search = new URLSearchParams({ page: String(page), limit: String(limit) });
  // let result = await fetchInstance.getPaginated<MyReviewItem[]>(
  //   `${API_ROUTES.REVIEWS.ME}?${search.toString()}`,
  // );
  // // 백엔드 totalPages=0/범위 밖 page 대응: 빈 페이지면 마지막 페이지로 재요청
  // const totalPages = Math.max(1, result.pagination.totalPages);
  // if (result.pagination.totalCount > 0 && result.data.length === 0 && page > totalPages) {
  //   const retrySearch = new URLSearchParams({
  //     page: String(totalPages),
  //     limit: String(limit),
  //   });
  //   result = await fetchInstance.getPaginated<MyReviewItem[]>(
  //     `${API_ROUTES.REVIEWS.ME}?${retrySearch.toString()}`,
  //   );
  // }
  // return { reviews: result.data, pagination: result.pagination };

  await Promise.resolve();
  return getMockMyReviews({ page, limit });
}

/**
 * 확정·완료 견적에 대한 리뷰를 등록합니다.
 *
 * 현재는 FE UI 검증용 mock을 갱신합니다. 실연동은 환경 준비 후 TODO 주석을 해제합니다.
 * // 2026.07.27 정슬기 - [추가] 리뷰 작성 service (mock)
 * // 2026.07.27 정슬기 - [수정] 연동 예시를 axios → fetchInstance로 변경
 */
export async function createReview(input: CreateReviewInput): Promise<CreatedReview> {
  // TODO: 실제 API 연동 시 아래 mock 블록을 제거하고 fetchInstance 호출로 교체
  // return fetchInstance.post<CreatedReview, CreateReviewInput>(API_ROUTES.REVIEWS.ROOT, input);

  await Promise.resolve();
  return createMockReview(input);
}
