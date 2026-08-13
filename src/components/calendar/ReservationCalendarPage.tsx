"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { Text } from "@/components/common/Text";
import { APP_ROUTES } from "@/lib/constants/appRoutes";
import { cn } from "@/lib/utils/cn";

type CalendarRole = "customer" | "mover";
type Availability = "available" | "full" | "off";

interface CalendarDay {
  day: number;
  monthOffset: number;
}

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];
const AVAILABILITY_LABEL: Record<Availability, string> = {
  available: "예약 가능",
  full: "마감",
  off: "휴무",
};

const INITIAL_AVAILABILITY: Record<string, Availability> = {
  "2026-08-03": "off",
  "2026-08-05": "full",
  "2026-08-08": "full",
  "2026-08-10": "off",
  "2026-08-12": "full",
  "2026-08-14": "available",
  "2026-08-17": "off",
  "2026-08-20": "full",
  "2026-08-22": "full",
  "2026-08-24": "off",
  "2026-08-27": "available",
  "2026-08-29": "full",
  "2026-08-31": "off",
};

const dateKey = (year: number, month: number, day: number) =>
  `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

const getCalendarDays = (year: number, month: number): CalendarDay[] => {
  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();
  const previousLastDate = new Date(year, month, 0).getDate();

  return Array.from({ length: 42 }, (_, index) => {
    const value = index - firstDay + 1;
    if (value < 1) return { day: previousLastDate + value, monthOffset: -1 };
    if (value > lastDate) return { day: value - lastDate, monthOffset: 1 };
    return { day: value, monthOffset: 0 };
  });
};

const getDefaultAvailability = (key: string, day: number): Availability => {
  return INITIAL_AVAILABILITY[key] ?? (day % 7 === 0 ? "full" : "available");
};

const AvailabilityPill = ({ status }: { status: Availability }) => (
  <span
    className={cn(
      "rounded-100 inline-flex items-center gap-5 px-8 py-3 text-[11px] leading-18 font-semibold md:px-10 md:text-[13px]",
      status === "available" && "bg-background-brand-muted text-text-brand",
      status === "full" && "bg-background-hover text-text-muted",
      status === "off" && "bg-[#eef0f3] text-[#74777d]",
    )}
  >
    <span
      className={cn(
        "size-5 rounded-full",
        status === "available" && "bg-background-brand",
        status === "full" && "bg-gray-400",
        status === "off" && "bg-black-100",
      )}
    />
    {AVAILABILITY_LABEL[status]}
  </span>
);

interface ReservationCalendarPageProps {
  role: CalendarRole;
  moverId?: string;
  moverName?: string;
}

export default function ReservationCalendarPage({
  role,
  moverId = "mock-mover",
  moverName = "김무빙 기사님",
}: ReservationCalendarPageProps) {
  const isMover = role === "mover";
  const [viewDate, setViewDate] = useState(new Date(2026, 7, 1));
  const [selectedDate, setSelectedDate] = useState("2026-08-14");
  const [availability, setAvailability] =
    useState<Record<string, Availability>>(INITIAL_AVAILABILITY);
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const days = useMemo(() => getCalendarDays(year, month), [year, month]);
  const selectedDay = Number(selectedDate.slice(-2));
  const selectedStatus =
    availability[selectedDate] ?? getDefaultAvailability(selectedDate, selectedDay);

  const moveMonth = (amount: number) => {
    const next = new Date(year, month + amount, 1);
    setViewDate(next);
    setSelectedDate(dateKey(next.getFullYear(), next.getMonth(), 1));
  };

  const updateSelectedStatus = (status: Availability) => {
    setAvailability((current) => ({ ...current, [selectedDate]: status }));
  };

  const estimateRequestHref = `${APP_ROUTES.ESTIMATE_REQUEST}?moverId=${encodeURIComponent(moverId)}&date=${selectedDate}`;

  return (
    <div className="bg-background-subtle flex min-h-[calc(100vh-var(--gnb-height-desktop))] flex-col">
      <header className="bg-background-surface border-border-subtle border-b">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-12 px-24 py-20 md:px-40 xl:flex-row xl:items-end xl:justify-between xl:py-24">
          <div>
            <Text
              as="h1"
              variant={{ base: "2xl-bold", xl: "3xl-bold" }}
              className="text-text-primary"
            >
              {isMover ? "예약 일정 관리" : `${moverName} 일정`}
            </Text>
            <Text as="p" variant="lg-regular" className="text-text-muted mt-6">
              {isMover
                ? "날짜를 선택해 예약 가능 여부와 휴무일을 관리해 보세요."
                : "기사님의 일정을 확인하고 예약 가능한 날에 견적을 요청해 보세요."}
            </Text>
          </div>
          <div className="flex flex-wrap items-center gap-12" aria-label="일정 상태 안내">
            {(["available", "full", "off"] as const).map((status) => (
              <AvailabilityPill key={status} status={status} />
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col px-16 py-12 md:px-40 md:py-16 xl:px-40">
        <section className="border-border-default bg-background-surface rounded-16 flex flex-1 flex-col overflow-hidden border shadow-[0_6px_24px_rgba(17,17,17,0.05)]">
          <div className="border-border-subtle flex items-center justify-between border-b px-12 py-10 md:px-24 md:py-12">
            <button
              type="button"
              onClick={() => moveMonth(-1)}
              aria-label="이전 달"
              className="hover:bg-background-hover rounded-8 flex size-40 items-center justify-center transition-colors"
            >
              <span aria-hidden className="text-text-tertiary text-2xl">
                ‹
              </span>
            </button>
            <Text
              as="h2"
              variant={{ base: "xl-bold", md: "2xl-bold" }}
              className="text-text-primary"
            >
              {year}년 {month + 1}월
            </Text>
            <button
              type="button"
              onClick={() => moveMonth(1)}
              aria-label="다음 달"
              className="hover:bg-background-hover rounded-8 flex size-40 items-center justify-center transition-colors"
            >
              <span aria-hidden className="text-text-tertiary text-2xl">
                ›
              </span>
            </button>
          </div>

          <div className="border-border-subtle bg-background-subtle grid grid-cols-7 border-b py-10">
            {WEEKDAYS.map((weekday, index) => (
              <Text
                key={weekday}
                variant="md-semibold"
                className={cn("text-center", index === 0 ? "text-text-brand" : "text-text-muted")}
              >
                {weekday}
              </Text>
            ))}
          </div>

          <div className="grid min-h-[330px] flex-1 grid-cols-7 grid-rows-6 md:min-h-[360px]">
            {days.map(({ day, monthOffset }, index) => {
              const cellDate = new Date(year, month + monthOffset, day);
              const key = dateKey(cellDate.getFullYear(), cellDate.getMonth(), day);
              const status = availability[key] ?? getDefaultAvailability(key, day);
              const isSelected = selectedDate === key;
              const isCurrentMonth = monthOffset === 0;

              return (
                <button
                  type="button"
                  key={`${key}-${index}`}
                  onClick={() => {
                    setSelectedDate(key);
                    if (monthOffset) {
                      setViewDate(new Date(cellDate.getFullYear(), cellDate.getMonth(), 1));
                    }
                  }}
                  className={cn(
                    "border-border-subtle relative flex min-h-55 flex-col items-center gap-2 border-r border-b p-3 text-left transition-colors md:min-h-60 md:flex-row md:items-center md:justify-between md:p-6",
                    isSelected ? "bg-background-brand-muted" : "hover:bg-background-subtle",
                    !isCurrentMonth && "opacity-35",
                  )}
                >
                  <span
                    className={cn(
                      "text-text-secondary flex size-28 items-center justify-center rounded-full text-[14px]",
                      isSelected && "bg-background-brand text-text-inverse font-semibold",
                    )}
                  >
                    {day}
                  </span>
                  <AvailabilityPill status={status} />
                </button>
              );
            })}
          </div>
        </section>

        <section className="border-border-default bg-background-surface rounded-16 sticky bottom-6 mt-8 flex flex-col gap-10 border p-12 shadow-[0_8px_30px_rgba(17,17,17,0.10)] md:flex-row md:items-center md:justify-between md:p-14">
          <div className="flex items-center gap-14">
            <div className="bg-background-brand-muted text-text-brand rounded-12 flex size-52 shrink-0 flex-col items-center justify-center">
              <span className="text-[11px] font-medium">{selectedDate.slice(5, 7)}월</span>
              <span className="text-[20px] leading-22 font-bold">{selectedDay}</span>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-8">
                <Text as="h3" variant="lg-bold" className="text-text-primary">
                  선택한 날짜
                </Text>
                <AvailabilityPill status={selectedStatus} />
              </div>
              <Text as="p" variant="sm-medium" className="text-text-muted mt-3">
                {isMover
                  ? "아래 버튼으로 고객에게 표시할 상태를 변경할 수 있어요."
                  : selectedStatus === "available"
                    ? "견적 요청이 가능한 날짜예요."
                    : selectedStatus === "full"
                      ? "예약이 마감된 날짜예요. 다른 날짜를 선택해 주세요."
                      : "기사님이 휴무로 지정한 날짜예요."}
              </Text>
            </div>
          </div>

          {isMover ? (
            <div className="grid grid-cols-3 gap-8 md:flex">
              {(["available", "full", "off"] as const).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => updateSelectedStatus(status)}
                  className={cn(
                    "rounded-8 border px-14 py-10 text-[14px] font-semibold transition-colors md:min-w-100",
                    selectedStatus === status
                      ? "border-border-brand bg-background-brand text-text-inverse"
                      : "border-border-default text-text-secondary hover:bg-background-subtle",
                  )}
                >
                  {AVAILABILITY_LABEL[status]}
                </button>
              ))}
            </div>
          ) : selectedStatus === "available" ? (
            <Link
              href={estimateRequestHref}
              className="bg-background-brand hover:bg-background-brand-hover text-text-inverse rounded-8 flex h-48 w-full items-center justify-center px-24 text-[16px] font-semibold transition-colors md:w-auto"
            >
              이 날짜로 견적 요청하기
            </Link>
          ) : (
            <button
              type="button"
              disabled
              className="bg-background-disabled text-text-disabled rounded-8 h-48 w-full px-24 text-[16px] font-semibold md:w-auto"
            >
              견적 요청 불가
            </button>
          )}
        </section>
      </main>
    </div>
  );
}
