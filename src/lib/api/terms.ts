import fetchInstance from "@/lib/api/fetchInstance";
import { API_ROUTES } from "@/lib/constants/apiRoutes";
import type { PublishedTerms } from "@/types/terms";

/**
 * GET /terms — 게시된 약관 전체
 *
 * 비회원도 조회할 수 있는 공개 API입니다.
 * 응답에 `content`까지 포함되어 있어 목록 한 번으로 상세까지 렌더링합니다.
 */
export const getPublishedTerms = () =>
  fetchInstance.get<PublishedTerms[]>(API_ROUTES.TERMS.ROOT, { skipAuth: true });
