import type { EstimateRequestStatus, MyEstimateRequestItem } from "@/types/estimate";
import type { MoveType } from "@/types/move";

/** 백엔드 MAX_DESIGNATED_MOVERS 와 동일 */
export const MAX_DESIGNATED_MOVERS = 3;

/** 백엔드 designate 가능 상태 (PENDING | OPEN) */
const DESIGNATABLE_STATUSES: readonly EstimateRequestStatus[] = ["PENDING", "OPEN"];

export type DesignateCtaStatus =
  | "needEstimateRequest"
  | "confirmed"
  | "alreadyDesignated"
  | "notEditable"
  | "expired"
  | "limitExceeded"
  | "serviceTypeMismatch"
  | "available";

/** 클릭해도 지정 요청으로 이어지지 않아 버튼을 비활성하는 상태 */
export const DESIGNATE_CTA_DISABLED_STATUSES: readonly DesignateCtaStatus[] = [
  "alreadyDesignated",
  "notEditable",
  "expired",
  "limitExceeded",
  "serviceTypeMismatch",
];

const DESIGNATE_CTA_BUTTON_LABEL = {
  confirmed: "진행 중인 견적 보기",
  alreadyDesignated: "지정 견적 요청 완료",
  notEditable: "지정 견적 요청 불가",
  expired: "만료된 견적 요청",
  limitExceeded: "지정 한도 초과",
  serviceTypeMismatch: "서비스 유형 불일치",
} as const satisfies Record<
  Exclude<DesignateCtaStatus, "needEstimateRequest" | "available">,
  string
>;

export interface DesignateCtaState {
  status: DesignateCtaStatus;
  canSubmit: boolean;
  estimateRequestId: number | null;
  /** 클릭 시 Toast로 표시할 메시지. 모달·버튼 비활성으로 처리하는 케이스는 null */
  message: string | null;
  /** 비활성 CTA 등에서 기본 라벨 대신 쓸 문구. null이면 기본 "지정 견적 요청하기" */
  buttonLabel: string | null;
}

/**
 * GET /estimate-requests/active 응답 데이터를 기반으로 지정 견적 CTA 상태를 결정합니다.
 *
 * 서버에 designate API를 호출하기 전에 클라이언트에서 먼저 차단합니다. 이후 서버가 최종 검증하므로 이중 방어 구조입니다.
 *
 * 판정 순서: 요청 없음 → 상태/만료(현재 지정 가능 여부) → 이미 지정 → 한도 → 서비스 유형 → 가능
 *
 * - needEstimateRequest: 활성 견적 요청 없음 → 호출부에서 안내 모달 표시
 * - confirmed:          확정 견적 요청 존재 → 진행 중인 견적 상세로 이동
 * - notEditable:        지정할 수 없는 상태 → 버튼 비활성
 * - expired:            만료 → 버튼 비활성
 * - alreadyDesignated:  해당 기사가 이미 지정됨 → 버튼 비활성
 * - limitExceeded:      지정 기사 3명 도달 → 버튼 비활성
 * - serviceTypeMismatch: 현재 견적 요청과 기사 제공 서비스가 불일치 → 버튼 비활성
 * - available:          모든 조건 통과 → designate API 호출
 *
 * 로그인 여부·로딩 상태는 호출부(MoverDetailView)에서 처리합니다.
 */
export function getDesignateCtaState(
  activeRequest: MyEstimateRequestItem | null,
  moverId: string,
  moverServiceTypes: MoveType[],
): DesignateCtaState {
  // null = 활성 요청 없음. 미요청과 확정/만료 후(active 종료)를 구분하지 못함 → 안내 모달
  if (!activeRequest) {
    return {
      status: "needEstimateRequest",
      canSubmit: false,
      estimateRequestId: null,
      message: null,
      buttonLabel: null,
    };
  }

  const estimateRequestId = activeRequest.id;

  if (activeRequest.status === "CONFIRMED") {
    return {
      status: "confirmed",
      canSubmit: false,
      estimateRequestId,
      message: null,
      buttonLabel: DESIGNATE_CTA_BUTTON_LABEL.confirmed,
    };
  }

  // 방어: active에 지정할 수 없는 상태가 남은 경우
  if (!DESIGNATABLE_STATUSES.includes(activeRequest.status)) {
    return {
      status: "notEditable",
      canSubmit: false,
      estimateRequestId,
      message: null,
      buttonLabel: DESIGNATE_CTA_BUTTON_LABEL.notEditable,
    };
  }

  // 방어: status는 PENDING/OPEN인데 expiresAt만 지난 캐시/레이스
  if (new Date(activeRequest.expiresAt).getTime() <= Date.now()) {
    return {
      status: "expired",
      canSubmit: false,
      estimateRequestId,
      message: null,
      buttonLabel: DESIGNATE_CTA_BUTTON_LABEL.expired,
    };
  }

  if (activeRequest.designatedMovers.some((item) => item.moverId === moverId)) {
    return {
      status: "alreadyDesignated",
      canSubmit: false,
      estimateRequestId,
      message: null,
      buttonLabel: DESIGNATE_CTA_BUTTON_LABEL.alreadyDesignated,
    };
  }

  if (activeRequest.designatedMovers.length >= MAX_DESIGNATED_MOVERS) {
    return {
      status: "limitExceeded",
      canSubmit: false,
      estimateRequestId,
      message: null,
      buttonLabel: DESIGNATE_CTA_BUTTON_LABEL.limitExceeded,
    };
  }

  if (!moverServiceTypes.includes(activeRequest.moveType)) {
    return {
      status: "serviceTypeMismatch",
      canSubmit: false,
      estimateRequestId,
      message: null,
      buttonLabel: DESIGNATE_CTA_BUTTON_LABEL.serviceTypeMismatch,
    };
  }

  return {
    status: "available",
    canSubmit: true,
    estimateRequestId,
    message: null,
    buttonLabel: null,
  };
}

export function isDesignateCtaDisabled(status: DesignateCtaStatus): boolean {
  return DESIGNATE_CTA_DISABLED_STATUSES.includes(status);
}
