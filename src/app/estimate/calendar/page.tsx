import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

import MoverAuthGate from "@/components/auth/MoverAuthGate";
import ReservationCalendarPage from "@/components/calendar/ReservationCalendarPage";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("reservationCalendar");
  return { title: t("metadata.title"), description: t("metadata.description") };
}

export default async function MoverReservationCalendarPage() {
  const t = await getTranslations("reservationCalendar");
  return (
    <MoverAuthGate loadingMessage={t("loading")}>
      <ReservationCalendarPage role="mover" />
    </MoverAuthGate>
  );
}
