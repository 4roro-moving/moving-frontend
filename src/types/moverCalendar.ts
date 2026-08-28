import type { MoveType } from "@/types/move";

export type MoverCalendarDayStatus = "AVAILABLE" | "FULL" | "OFF";

export interface MoverCalendarReservation {
  estimateId: number;
  estimateRequestId: number;
  moveType: MoveType;
  customerName: string;
}

export interface MoverCalendarDay {
  date: string;
  status: MoverCalendarDayStatus;
  reservation?: MoverCalendarReservation;
}

export interface MoverMonthlyCalendar {
  moverId: string;
  year: number;
  month: number;
  days: MoverCalendarDay[];
}

export interface UpdateMoverCalendarDayInput {
  status: Extract<MoverCalendarDayStatus, "AVAILABLE" | "OFF">;
}
