export interface CalendarCell {
  date: Date;
  inCurrentMonth: boolean;
}

/** Date → "2025년 7월 1일" */
export function formatKoreanDate(date: Date): string {
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
}

/** ISO 날짜 문자열 → KST 기준 "2025. 07. 01. (화)" */
export function formatKoreanDateTime(date: string): string {
  // 2026.07.24 정슬기 - [수정] date-only는 parseDateOnly로 파싱해 타임존 밀림 방지
  const parsed = /^\d{4}-\d{2}-\d{2}$/.test(date) ? parseDateOnly(date) : new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    throw new RangeError("유효하지 않은 날짜입니다.");
  }

  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
    timeZone: "Asia/Seoul",
  }).format(parsed);
}

/**
 * 로컬 자정 기준 날짜 전용 Date를 생성합니다.
 * `new Date(year, monthIndex, day)`는 year 0~99를 1900~1999로 보정하므로 setFullYear를 사용합니다.
 */
function createLocalDateOnly(year: number, month: number, day: number): Date {
  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) {
    throw new RangeError("날짜는 YYYY-MM-DD 형식이어야 합니다.");
  }

  if (month < 1 || month > 12) {
    throw new RangeError("달은 1부터 12 사이여야 합니다.");
  }

  if (day < 1) {
    throw new RangeError("일은 1 이상이어야 합니다.");
  }

  const date = new Date(0);
  date.setFullYear(year, month - 1, day);
  date.setHours(0, 0, 0, 0);

  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    throw new RangeError("달력상 존재하지 않는 날짜입니다.");
  }

  return date;
}

/**
 * 날짜 전용 값(`YYYY-MM-DD` / ISO datetime의 날짜 prefix / Date)을 로컬 Date로 변환합니다.
 * `new Date("YYYY-MM-DD")` 및 ISO datetime 전체 파싱은 타임존에 따라 하루가 밀릴 수 있어 사용하지 않습니다.
 * // 2026.07.24 정슬기 - [추가] 날짜 전용 문자열 파서 (타임존 밀림 방지)
 * // 2026.07.24 정슬기 - [수정] YYYY-MM-DD·달력 유효성 검증, ISO datetime prefix 정규화, setFullYear 사용
 */
export function parseDateOnly(value: string | Date): Date {
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) {
      throw new RangeError("유효하지 않은 날짜입니다.");
    }

    return createLocalDateOnly(value.getFullYear(), value.getMonth() + 1, value.getDate());
  }

  // YYYY-MM-DD 또는 선행 날짜가 있는 ISO datetime(예: 2026-09-01T00:00:00.000Z)
  const match = /^(\d{4})-(\d{2})-(\d{2})(?:[Tt].*)?$/.exec(value.trim());
  if (!match) {
    throw new RangeError("날짜는 YYYY-MM-DD 형식이어야 합니다.");
  }

  const [, yearText, monthText, dayText] = match;
  if (yearText === undefined || monthText === undefined || dayText === undefined) {
    throw new RangeError("날짜는 YYYY-MM-DD 형식이어야 합니다.");
  }

  return createLocalDateOnly(Number(yearText), Number(monthText), Number(dayText));
}

/** Date → "YYYY-MM-DD" (백엔드 moveDate 형식) */
export function formatDateToISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** 두 날짜가 같은 '일'인지 (연/월/일 비교) */
export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/** 시/분/초를 제거한 해당 날짜의 자정 Date */
export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/** a가 b보다 이전 '일'인지 (시간 무시) */
export function isBeforeDay(a: Date, b: Date): boolean {
  return startOfDay(a).getTime() < startOfDay(b).getTime();
}

/** 해당 월의 1일 기준으로 n개월 이동한 Date */
export function addMonths(date: Date, n: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + n, 1);
}

/**
 * 달력 렌더링용 6주 x 7일 매트릭스 생성
 * - month는 0-indexed (0 = 1월)
 * - 이전/다음 달 날짜도 채워 항상 6행을 유지
 */
export function getMonthMatrix(year: number, month: number): CalendarCell[][] {
  const firstDay = new Date(year, month, 1);
  const startWeekday = firstDay.getDay(); // 0(일) ~ 6(토)
  const cursor = new Date(year, month, 1 - startWeekday);

  const weeks: CalendarCell[][] = [];
  for (let w = 0; w < 6; w++) {
    const week: CalendarCell[] = [];
    for (let d = 0; d < 7; d++) {
      week.push({
        date: new Date(cursor),
        inCurrentMonth: cursor.getMonth() === month,
      });
      cursor.setDate(cursor.getDate() + 1);
    }
    weeks.push(week);
  }
  return weeks;
}
