import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ReservationCalendarPage from "@/components/calendar/ReservationCalendarPage";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("reservationCalendar");
  return { title: t("metadata.moverTitle"), description: t("metadata.moverDescription") };
}

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
