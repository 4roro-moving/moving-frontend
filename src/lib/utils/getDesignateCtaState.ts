import { ERROR_CODES } from "@/lib/constants/errorCodes";
import type { EstimateRequestStatus, MyEstimateRequestItem } from "@/types/estimate";

/** 백엔드 MAX_DESIGNATED_MOVERS 와 동일 */
export const MAX_DESIGNATED_MOVERS = 3;

/** 백엔드 designate 가능 상태 (PENDING | OPEN) */
const DESIGNATABLE_STATUSES: readonly EstimateRequestStatus[] = ["PENDING", "OPEN"];

const DESIGNATE_NOT_EDITABLE_MESSAGE = "지금은 지정 견적을 요청할 수 없는 상태입니다.";
const DESIGNATE_EXPIRED_MESSAGE = "만료된 견적 요청입니다.";

export type DesignateCtaStatus =
  "needEstimateRequest" | "alreadyDesignated" | "notEditable" | "limitExceeded" | "available";

export interface DesignateCtaState {
  status: DesignateCtaStatus;
  canSubmit: boolean;
  estimateRequestId: number | null;
  /** 클릭 시 Toast로 표시할 메시지. 모달이나 버튼 비활성으로 처리하는 케이스는 null */
  message: string | null;
}

/**
 * GET /estimate-requests/active 응답 데이터를 기반으로 지정 견적 CTA 상태를 결정합니다.
 *
 * 서버에 designate API를 호출하기 전에 클라이언트에서 먼저 차단합니다. 이후 서버가 최종 검증하므로 이중 방어 구조입니다.
 *
 * - needEstimateRequest: 활성 견적 요청 없음 → 호출부에서 안내 모달 표시
 * - alreadyDesignated:  해당 기사가 이미 지정됨 → 버튼 비활성
 * - notEditable:        상태(CONFIRMED 등)나 만료로 수정 불가 → Toast
 * - limitExceeded:      지정 기사 3명 도달 → Toast
 * - available:          모든 조건 통과 → designate API 호출
 *
 * 로그인 여부·로딩 상태는 호출부(MoverDetailView)에서 처리합니다.
 */
export function getDesignateCtaState(
  activeRequest: MyEstimateRequestItem | null,
  moverId: string,
): DesignateCtaState {
  // activeRequest가 null이면 진행 중인 일반 견적 요청이 없는 것
  if (!activeRequest) {
    return {
      status: "needEstimateRequest",
      canSubmit: false,
      estimateRequestId: null,
      message: null,
    };
  }

  const estimateRequestId = activeRequest.id;

  if (activeRequest.designatedMovers.some((item) => item.moverId === moverId)) {
    return {
      status: "alreadyDesignated",
      canSubmit: false,
      estimateRequestId,
      message: null,
    };
  }

  // activeRequest.status로 판단 — CONFIRMED, CANCELED 등은 수정 불가
  if (!DESIGNATABLE_STATUSES.includes(activeRequest.status)) {
    return {
      status: "notEditable",
      canSubmit: false,
      estimateRequestId,
      message: DESIGNATE_NOT_EDITABLE_MESSAGE,
    };
  }

  // activeRequest.expiresAt으로 판단 — 캐시 등으로 만료 데이터가 남아있을 수 있음
  if (new Date(activeRequest.expiresAt).getTime() <= Date.now()) {
    return {
      status: "notEditable",
      canSubmit: false,
      estimateRequestId,
      message: DESIGNATE_EXPIRED_MESSAGE,
    };
  }

  if (activeRequest.designatedMovers.length >= MAX_DESIGNATED_MOVERS) {
    return {
      status: "limitExceeded",
      canSubmit: false,
      estimateRequestId,
      message: ERROR_CODES.DESIGNATION_LIMIT_EXCEEDED.message,
    };
  }

  return {
    status: "available",
    canSubmit: true,
    estimateRequestId,
    message: null,
  };
}
