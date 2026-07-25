import { parseDateOnly } from "@/lib/utils/date";
import type { EstimateStatus, MoveType } from "@/types/estimate";

const MOVE_TYPE_LABEL: Record<MoveType, string> = {
  SMALL: "소형이사",
  HOME: "가정이사",
  OFFICE: "사무실이사",
};

const WEEKDAY_LABEL = ["일", "월", "화", "수", "목", "금", "토"] as const;
const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function assertValidDate(date: Date): Date {
  if (Number.isNaN(date.getTime())) {
    throw new RangeError("유효하지 않은 날짜입니다.");
  }
  return date;
}

/**
 * createdAt 등 datetime은 `new Date`로, date-only 문자열만 parseDateOnly를 사용합니다.
 * // 2026.07.24 정슬기 - [수정] 날짜 전용 문자열 타임존 밀림 방지
 */
function toDisplayDate(value: string | Date): Date {
  if (value instanceof Date) {
    return assertValidDate(value);
  }

  if (DATE_ONLY_PATTERN.test(value)) {
    return parseDateOnly(value);
  }

  return assertValidDate(new Date(value));
}

export function getMoveTypeLabel(moveType: MoveType): string {
  return MOVE_TYPE_LABEL[moveType];
}

export function formatRequestDateLabel(value: string | Date): string {
  // createdAt(ISO datetime) 기준. 날짜 전용 문자열이 들어오면 parseDateOnly 사용
  const date = toDisplayDate(value);
  const yy = String(date.getFullYear()).slice(2);
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yy}. ${mm}. ${dd}.`;
}

/**
 * 대기 중 견적 sub-header용 신청일 표기 (예: 2024년 6월 24일)
 * // 2026.07.25 정슬기 - [추가] Figma 대기 목록 요청일 포맷
 */
export function formatKoreanDateLong(value: string | Date): string {
  const date = toDisplayDate(value);
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
}

export function formatMoveDateLabel(value: string | Date): string {
  // moveDate: YYYY-MM-DD 또는 API/mock ISO datetime → parseDateOnly가 날짜 prefix로 정규화
  const date = parseDateOnly(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const weekday = WEEKDAY_LABEL[date.getDay()];
  if (weekday === undefined) {
    throw new RangeError("유효하지 않은 날짜입니다.");
  }
  return `${year}년 ${month}월 ${day}일 (${weekday})`;
}

export function formatDetailDateLabel(value: string | Date): string {
  // createdAt(ISO datetime) 기준. 날짜 전용 문자열이 들어오면 parseDateOnly 사용
  const date = toDisplayDate(value);
  const yy = String(date.getFullYear()).slice(2);
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yy}.${mm}.${dd}`;
}

export function formatPrice(price: number): string {
  return `${price.toLocaleString("ko-KR")}원`;
}

export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

export function isPendingEstimate(status: EstimateStatus): boolean {
  return status === "SENT";
}

export function isConfirmedEstimate(status: EstimateStatus): boolean {
  return status === "CONFIRMED";
}
