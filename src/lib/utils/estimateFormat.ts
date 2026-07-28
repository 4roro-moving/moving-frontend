import { parseDateOnly } from "@/lib/utils/date";
import type { EstimateStatus } from "@/types/estimate";
import type { MoveType } from "@/types/move";
import { MOVE_TYPE_LABEL } from "@/lib/constants/moveType";

const WEEKDAY_LABEL = ["일", "월", "화", "수", "목", "금", "토"] as const;
const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const KST = "Asia/Seoul";

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

/** ISO datetime 등 절대 시각을 KST 연·월·일로 분해합니다. */
function getKstYmdParts(date: Date): { year: string; month: string; day: string } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: KST,
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).formatToParts(date);

  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;

  if (!year || !month || !day) {
    throw new RangeError("유효하지 않은 날짜입니다.");
  }

  return { year, month, day };
}

function isDateOnlyValue(value: string | Date): boolean {
  return typeof value === "string" && DATE_ONLY_PATTERN.test(value);
}

export function getMoveTypeLabel(moveType: MoveType): string {
  return MOVE_TYPE_LABEL[moveType];
}

export function formatRequestDateLabel(value: string | Date): string {
  // 2026.07.26 정슬기 - [수정] ISO datetime은 KST 기준으로 표기 (로컬 TZ 일자 밀림 방지)
  if (isDateOnlyValue(value)) {
    const date = parseDateOnly(value);
    const yy = String(date.getFullYear()).slice(2);
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yy}. ${mm}. ${dd}.`;
  }

  const { year, month, day } = getKstYmdParts(toDisplayDate(value));
  const yy = year.slice(2);
  const mm = month.padStart(2, "0");
  const dd = day.padStart(2, "0");
  return `${yy}. ${mm}. ${dd}.`;
}

/**
 * 대기 중 견적 sub-header용 신청일 표기 (예: 2024년 6월 24일)
 * // 2026.07.25 정슬기 - [추가] Figma 대기 목록 요청일 포맷
 * // 2026.07.26 정슬기 - [수정] createdAt(ISO Z)은 Asia/Seoul 기준으로 포맷
 */
export function formatKoreanDateLong(value: string | Date): string {
  if (isDateOnlyValue(value)) {
    const date = parseDateOnly(value);
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
  }

  const { year, month, day } = getKstYmdParts(toDisplayDate(value));
  return `${year}년 ${month}월 ${day}일`;
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

/**
 * 잘못된 날짜 값에서도 렌더가 깨지지 않도록 fallback을 반환합니다.
 * // 2026.07.27 정슬기 - [추가] 리뷰 카드 등 목록 UI용 안전 포맷
 */
export function formatMoveDateLabelSafe(value: string | Date, fallback = "-"): string {
  try {
    return formatMoveDateLabel(value);
  } catch {
    return fallback;
  }
}

export function formatDetailDateLabel(value: string | Date): string {
  // 2026.07.26 정슬기 - [수정] ISO datetime은 KST 기준으로 표기
  if (isDateOnlyValue(value)) {
    const date = parseDateOnly(value);
    const yy = String(date.getFullYear()).slice(2);
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yy}.${mm}.${dd}`;
  }

  const { year, month, day } = getKstYmdParts(toDisplayDate(value));
  const yy = year.slice(2);
  const mm = month.padStart(2, "0");
  const dd = day.padStart(2, "0");
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
