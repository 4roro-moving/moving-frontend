import { parseDateOnly } from "@/lib/utils/date";
import type { EstimateRequestStatus, EstimateStatus } from "@/types/estimate";
import type { MoveType } from "@/types/move";

type SupportedDisplayLocale = "ko" | "en" | "ja" | "zh-CN";

const normalizeDisplayLocale = (locale?: string): SupportedDisplayLocale => {
  if (locale === "en" || locale === "ja" || locale === "zh-CN") {
    return locale;
  }
  return "ko";
};

const ESTIMATE_REQUEST_STATUS_LABEL: Record<
  SupportedDisplayLocale,
  Record<EstimateRequestStatus, string>
> = {
  ko: {
    PENDING: "대기중",
    OPEN: "진행 중",
    CONFIRMED: "견적 확정",
    COMPLETED: "이사 완료",
    EXPIRED: "만료",
    CANCELED: "취소됨",
  },
  en: {
    PENDING: "Pending",
    OPEN: "In progress",
    CONFIRMED: "Estimate confirmed",
    COMPLETED: "Move completed",
    EXPIRED: "Expired",
    CANCELED: "Canceled",
  },
  ja: {
    PENDING: "待機中",
    OPEN: "進行中",
    CONFIRMED: "見積もり確定",
    COMPLETED: "引越し完了",
    EXPIRED: "期限切れ",
    CANCELED: "キャンセル済み",
  },
  "zh-CN": {
    PENDING: "等待中",
    OPEN: "进行中",
    CONFIRMED: "报价已确认",
    COMPLETED: "搬家完成",
    EXPIRED: "已过期",
    CANCELED: "已取消",
  },
};

const MOVE_TYPE_LABEL: Record<SupportedDisplayLocale, Record<MoveType, string>> = {
  ko: { SMALL: "소형이사", HOME: "가정이사", OFFICE: "사무실이사" },
  en: { SMALL: "Small move", HOME: "Home move", OFFICE: "Office move" },
  ja: { SMALL: "小規模引越し", HOME: "家庭引越し", OFFICE: "オフィス引越し" },
  "zh-CN": { SMALL: "小型搬家", HOME: "家庭搬家", OFFICE: "办公室搬家" },
};
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

export function getMoveTypeLabel(moveType: MoveType, locale?: string): string {
  return MOVE_TYPE_LABEL[normalizeDisplayLocale(locale)][moveType];
}

/** // 2026.07.29 정슬기 - [추가] 보낸 견적 요청 상태 라벨 */
/** 고객 soft cancel 가능 요청 상태 (PENDING|OPEN) */
// 2026.08.03 정슬기 - [추가]
export function isCancelableEstimateRequestStatus(status: EstimateRequestStatus): boolean {
  return status === "PENDING" || status === "OPEN";
}

export function getEstimateRequestStatusLabel(
  status: EstimateRequestStatus,
  locale?: string,
): string {
  return ESTIMATE_REQUEST_STATUS_LABEL[normalizeDisplayLocale(locale)][status];
}

/**
 * 보낸 견적 요청 상태 배지 텍스트 색상
 * 이사 완료는 status-error(빨간) 계열, 그 외는 brand
 * // 2026.07.30 정슬기 - [추가]
 */
export function getEstimateRequestStatusTextClassName(status: EstimateRequestStatus): string {
  if (status === "COMPLETED") {
    return "text-text-error";
  }
  return "text-text-brand";
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
export function formatKoreanDateLong(value: string | Date, locale = "ko"): string {
  const date = isDateOnlyValue(value)
    ? (() => {
        const parsed = parseDateOnly(value);
        return new Date(Date.UTC(parsed.getFullYear(), parsed.getMonth(), parsed.getDate(), 12));
      })()
    : toDisplayDate(value);

  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: KST,
  }).format(date);
}

export function formatMoveDateLabel(value: string | Date, locale = "ko"): string {
  const parsed = parseDateOnly(value);
  const date = new Date(Date.UTC(parsed.getFullYear(), parsed.getMonth(), parsed.getDate(), 12));

  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
    timeZone: KST,
  }).format(date);
}

/**
 * 잘못된 날짜 값에서도 렌더가 깨지지 않도록 fallback을 반환합니다.
 * // 2026.07.27 정슬기 - [추가] 리뷰 카드 등 목록 UI용 안전 포맷
 */
export function formatMoveDateLabelSafe(
  value: string | Date,
  fallback = "-",
  locale = "ko",
): string {
  try {
    return formatMoveDateLabel(value, locale);
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

export function formatPrice(price: number, locale = "ko"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "KRW",
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

/**
 * 지정 요청 대상 기사님 표시명 (nickname 우선, 없으면 name)
 * 값에 "기사님"이 이미 있으면 중복 접미사를 붙이지 않습니다.
 * // 2026.07.30 정슬기 - [추가]
 */
export function getDesignatedMoverDisplayName(
  mover: {
    name: string;
    moverProfile: { nickname: string | null } | null;
  },
  locale = "ko",
): string {
  const base = (mover.moverProfile?.nickname?.trim() || mover.name.trim()).trim();
  if (!base) {
    return normalizeDisplayLocale(locale) === "ko" ? "기사님" : "Mover";
  }

  if (normalizeDisplayLocale(locale) === "ko") {
    return base.endsWith("기사님") ? base : `${base} 기사님`;
  }

  if (normalizeDisplayLocale(locale) === "ja") {
    return `${base}さん`;
  }

  if (normalizeDisplayLocale(locale) === "zh-CN") {
    return `${base}师傅`;
  }

  return base;
}

/**
 * 리뷰 카드·모달용 기사님 표시명
 * reviewable은 nickname만, 내 리뷰는 nickname||name 을 사용합니다.
 * // 2026.07.30 정슬기 - [추가]
 */
export function getReviewMoverDisplayName(
  mover: {
    nickname?: string | null;
    name?: string | null;
  },
  locale = "ko",
): string {
  const base = (mover.nickname?.trim() || mover.name?.trim() || "").trim();
  if (!base) {
    return normalizeDisplayLocale(locale) === "ko" ? "기사님" : "Mover";
  }

  if (normalizeDisplayLocale(locale) === "ko") {
    return base.endsWith("기사님") ? base : `${base} 기사님`;
  }

  if (normalizeDisplayLocale(locale) === "ja") {
    return `${base}さん`;
  }

  if (normalizeDisplayLocale(locale) === "zh-CN") {
    return `${base}师傅`;
  }

  return base;
}

export function isPendingEstimate(status: EstimateStatus): boolean {
  return status === "SENT";
}

export function isConfirmedEstimate(status: EstimateStatus): boolean {
  return status === "CONFIRMED";
}

/**
 * ISO datetime은 KST 기준 날짜로, date-only 문자열은 그대로 날짜값으로 해석해 YYYY-MM-DD 형식으로 표시
 * 기사 상세 페이지에서 리뷰 작성일 표시에 사용됨
 */
export function formatDateOnlyLabel(value: string | Date): string {
  if (isDateOnlyValue(value)) {
    const date = parseDateOnly(value);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  const { year, month, day } = getKstYmdParts(toDisplayDate(value));
  const mm = month.padStart(2, "0");
  const dd = day.padStart(2, "0");

  return `${year}-${mm}-${dd}`;
}

/**
 * Review dates use the viewer locale while preserving the existing KST date boundary.
 */
export function formatLocalizedDateOnlyLabel(value: string | Date, locale: string): string {
  const dateParts = isDateOnlyValue(value)
    ? (() => {
        const date = parseDateOnly(value);
        return {
          year: String(date.getFullYear()),
          month: String(date.getMonth() + 1),
          day: String(date.getDate()),
        };
      })()
    : getKstYmdParts(toDisplayDate(value));
  const date = new Date(
    Date.UTC(Number(dateParts.year), Number(dateParts.month) - 1, Number(dateParts.day), 12),
  );

  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: KST,
  }).format(date);
}
