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
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
    timeZone: "Asia/Seoul",
  }).format(new Date(date));
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
