import fetchInstance from "@/lib/api/fetchInstance";
import { API_ROUTES } from "@/lib/constants/apiRoutes";
import type { MoverMonthlyCalendar, UpdateMoverCalendarDayInput } from "@/types/moverCalendar";

export function getMoverMonthlyCalendar(moverId: string, year: number, month: number) {
  const params = new URLSearchParams({ year: String(year), month: String(month) });
  return fetchInstance.get<MoverMonthlyCalendar>(
    `${API_ROUTES.MOVERS.CALENDAR(moverId)}?${params.toString()}`,
  );
}

export function updateMyCalendarDay(date: string, input: UpdateMoverCalendarDayInput) {
  return fetchInstance.put<{ date: string; status: UpdateMoverCalendarDayInput["status"] }>(
    API_ROUTES.MOVERS.MY_CALENDAR_DAY(date),
    input,
  );
}
