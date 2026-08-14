import type { Metadata } from "next";

import ReservationCalendarPage from "@/components/calendar/ReservationCalendarPage";

export const metadata: Metadata = {
  title: "예약 캘린더",
  description: "기사님의 이사 예약과 확정 대기 일정을 확인합니다.",
};

export default function MoverReservationCalendarPage() {
  return <ReservationCalendarPage role="mover" />;
}
