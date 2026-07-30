import fetchInstance from "@/lib/api/fetchInstance";
import { API_ROUTES } from "@/lib/constants/apiRoutes";
import type {
  CreateReviewRequest,
  MyReviewItem,
  MyReviewListQuery,
  MyReviewListResult,
  ReviewableEstimateItem,
  ReviewResponse,
} from "@/types/review";

export const REVIEWABLE_PAGE_LIMIT = 5;
export const MY_REVIEW_PAGE_LIMIT = 5;

/**
 * 작성 가능한 리뷰(확정·완료·미작성) 전체 목록
 * 백엔드는 페이지네이션을 지원하지 않으므로 FE에서 limit 단위로 슬라이스합니다.
 * // 2026.07.27 정슬기 - [추가] 작성 가능 리뷰 service
 * // 2026.07.30 정슬기 - [수정] mock → fetchInstance 실연동
 */
export async function fetchReviewableEstimates(): Promise<ReviewableEstimateItem[]> {
  return fetchInstance.get<ReviewableEstimateItem[]>(API_ROUTES.REVIEWS.REVIEWABLE);
}

/**
 * 내가 작성한 리뷰 목록 (서버 페이지네이션)
 * 범위 밖 page 보정은 호출부에서 page 상태를 totalPages로 맞춘 뒤 해당 키로 재조회합니다.
 * // 2026.07.27 정슬기 - [추가]
 * // 2026.07.30 정슬기 - [수정] mock → fetchInstance.getPaginated 실연동
 * // 2026.07.30 정슬기 - [수정] 서비스 내부 재요청 제거 (쿼리 키·응답 page 불일치 방지)
 */
export async function fetchMyReviews(query: MyReviewListQuery = {}): Promise<MyReviewListResult> {
  const page = query.page ?? 1;
  const limit = query.limit ?? MY_REVIEW_PAGE_LIMIT;
  const search = new URLSearchParams({ page: String(page), limit: String(limit) });

  const result = await fetchInstance.getPaginated<MyReviewItem[]>(
    `${API_ROUTES.REVIEWS.ME}?${search.toString()}`,
  );

  return { reviews: result.data, pagination: result.pagination };
}

/**
 * 확정·완료 견적에 대한 리뷰 등록
 * // 2026.07.27 정슬기 - [추가]
 * // 2026.07.30 정슬기 - [수정] mock → fetchInstance 실연동
 */
export async function createReview(input: CreateReviewRequest): Promise<ReviewResponse> {
  return fetchInstance.post<ReviewResponse, CreateReviewRequest>(API_ROUTES.REVIEWS.ROOT, input);
}
