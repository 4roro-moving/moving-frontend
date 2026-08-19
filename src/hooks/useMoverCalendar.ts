"use client";

import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/queries/useApiMutation";
import { useApiQuery } from "@/hooks/queries/useApiQuery";
import { getMoverMonthlyCalendar, updateMyCalendarDay } from "@/lib/api/moverCalendar";
import type { MoverMonthlyCalendar, UpdateMoverCalendarDayInput } from "@/types/moverCalendar";

const calendarQueryKey = (moverId: string, year: number, month: number) =>
  ["movers", moverId, "calendar", year, month] as const;

export function useMoverMonthlyCalendar(moverId: string | undefined, year: number, month: number) {
  return useApiQuery({
    queryKey: calendarQueryKey(moverId ?? "missing", year, month),
    queryFn: () => getMoverMonthlyCalendar(moverId!, year, month),
    enabled: Boolean(moverId),
  });
}

export function useUpdateMyCalendarDay(moverId: string, year: number, month: number) {
  const queryClient = useQueryClient();

  return useApiMutation<
    { date: string; status: UpdateMoverCalendarDayInput["status"] },
    { date: string; status: UpdateMoverCalendarDayInput["status"] }
  >({
    mutationFn: ({ date, status }) => updateMyCalendarDay(date, { status }),
    onSuccess: async ({ date, status }) => {
      const queryKey = calendarQueryKey(moverId, year, month);

      queryClient.setQueryData<MoverMonthlyCalendar>(queryKey, (current) =>
        current
          ? {
              ...current,
              days: current.days.map((day) => (day.date === date ? { ...day, status } : day)),
            }
          : current,
      );

      await queryClient.invalidateQueries({ queryKey, exact: true });
    },
  });
}
