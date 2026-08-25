import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ReservationCalendarPage from "@/components/calendar/ReservationCalendarPage";

export const metadata: Metadata = {
  title: "기사님 일정 확인",
  description: "기사님의 예약 가능 일정을 확인하고 견적을 요청합니다.",
};

interface CustomerReservationCalendarPageProps {
  searchParams: Promise<{ moverId?: string; moverName?: string }>;
}

export default async function CustomerReservationCalendarPage({
  searchParams,
}: CustomerReservationCalendarPageProps) {
  const { moverId, moverName } = await searchParams;

  if (!moverId?.trim()) {
    notFound();
  }

  return <ReservationCalendarPage role="customer" moverId={moverId} moverName={moverName} />;
}
