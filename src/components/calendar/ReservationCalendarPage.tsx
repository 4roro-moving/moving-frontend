"use client";

import { useFormatter, useTranslations } from "next-intl";
import Link from "next/link";
import { useMemo, useState } from "react";

import Toast from "@/components/common/Toast/Toast";
import { Text } from "@/components/common/Text";
import EstimatesQueryStatus from "@/components/estimate/EstimatesQueryStatus";
import { useMoverMonthlyCalendar, useUpdateMyCalendarDay } from "@/hooks/useMoverCalendar";
import { APP_ROUTES } from "@/lib/constants/appRoutes";
import { cn } from "@/lib/utils/cn";
import { useAuthStore } from "@/stores/useAuthStore";
import type { MoverCalendarDayStatus } from "@/types/moverCalendar";

/**고객과 기사 화면에서 공통으로 사용하는 예약 캘린더 컴포넌트 */
type CalendarRole = "customer" | "mover";
type Availability = "available" | "full" | "off";
type AvailabilityDisplay = Availability | "unknown";

interface CalendarDay {
  day: number;
  monthOffset: number;
}

const WEEKDAY_KEYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as const;

const KST_OFFSET_MS = 9 * 60 * 60 * 1000;

//API가 사용하는 YYYY-MM-DD 형식으로 변환함
const dateKey = (year: number, month: number, day: number) =>
  `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

//오늘 날짜를 YYYY-MM-DD 형식으로 반환함
//컴포넌트 진입 시 오늘 날짜를 기본으로 선택하거나, 선택한 날짜가 과거인지 판단하는 곳에서 사용됨
const getTodayKey = () => {
  const kstToday = new Date(Date.now() + KST_OFFSET_MS);
  return dateKey(kstToday.getUTCFullYear(), kstToday.getUTCMonth(), kstToday.getUTCDate());
};

const toAvailability = (status: MoverCalendarDayStatus): Availability =>
  status.toLowerCase() as Availability;

//표시할 총 42개의 날짜 데이터 생성
const getCalendarDays = (year: number, month: number): CalendarDay[] => {
  //해당 월 1일의 요일
  const firstDay = new Date(year, month, 1).getDay();
  //현재 월의 마지막 날짜
  const lastDate = new Date(year, month + 1, 0).getDate();
  //이전 달의 마지막 날짜
  const previousLastDate = new Date(year, month, 0).getDate();

  //42개 칸 생성
  return Array.from({ length: 42 }, (_, index) => {
    const value = index - firstDay + 1;
    if (value < 1) return { day: previousLastDate + value, monthOffset: -1 };
    if (value > lastDate) return { day: value - lastDate, monthOffset: 1 };
    return { day: value, monthOffset: 0 };
  });
};

//날짜 상태를 작은 배지 형태로 표시 available, full, off
const AvailabilityPill = ({ status }: { status: AvailabilityDisplay }) => {
  const t = useTranslations("reservationCalendar");

  return (
    <span
      className={cn(
        "rounded-100 inline-flex items-center gap-5 px-8 py-3 text-[11px] leading-18 font-semibold md:px-10 md:text-[13px]",
        status === "available" && "bg-background-brand-muted text-text-brand",
        status === "full" && "bg-background-hover text-text-muted",
        status === "off" && "bg-[#eef0f3] text-[#74777d]",
        status === "unknown" && "bg-background-disabled text-text-disabled",
      )}
    >
      <span
        className={cn(
          "size-5 rounded-full",
          status === "available" && "bg-background-brand",
          status === "full" && "bg-gray-400",
          status === "off" && "bg-black-100",
          status === "unknown" && "bg-gray-300",
        )}
      />
      {t(`status.${status}`)}
    </span>
  );
};

interface ReservationCalendarPageProps {
  role: CalendarRole;
  moverId?: string;
  moverName?: string;
}

export default function ReservationCalendarPage({
  role,
  moverId,
  moverName,
}: ReservationCalendarPageProps) {
  const t = useTranslations("reservationCalendar");
  const format = useFormatter();
  const isMover = role === "mover";
  const displayedMoverName = moverName ?? t("moverDefaultName");
  const authenticatedMoverId = useAuthStore((state) => state.user?.id);
  //기사 ID 결정
  const resolvedMoverId = isMover ? authenticatedMoverId : moverId;
  //현재 달력에서 보고 있는 연도와 월 관리
  const [viewDate, setViewDate] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });
  //사용자가 선택한 날짜 ( 초기값은 오늘 날짜 )
  const [selectedDate, setSelectedDate] = useState(getTodayKey);
  //휴무 등록 또는 해제 결과를 보여주는 토스트 메세지 관리
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  //현재 보고 있는 달력의 연도와 월 추출
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  //현재 연도와 월에 맞는 42개의 달력 날짜 생성
  const days = useMemo(() => getCalendarDays(year, month), [year, month]);
  //기사의 월별 캘린더 조회
  const calendarQuery = useMoverMonthlyCalendar(resolvedMoverId, year, month + 1);
  //기사 본인의 휴무를 등록하거나 해제하는 mutation
  const updateDayMutation = useUpdateMyCalendarDay(resolvedMoverId ?? "", year, month + 1);
  //API에서 받은 날짜 배열을 날짜별 상태 Map으로 변환
  const availability = useMemo(
    () =>
      new Map(
        (calendarQuery.data?.days ?? []).map((day) => [day.date, toAvailability(day.status)]),
      ),
    [calendarQuery.data?.days],
  );
  //선택한 날짜 문자열에서 일자만 추출
  const selectedDay = Number(selectedDate.slice(-2));
  //현재 선택한 날짜의 상태 "available" | "full" | "off" | undefined
  const selectedStatus = availability.get(selectedDate);
  //선택한 날짜의 확정 예약 상세 정보 찾기
  const selectedReservation = calendarQuery.data?.days.find(
    (day) => day.date === selectedDate,
  )?.reservation;
  //선택한 날짜가 과거인지 확인
  const isPastSelectedDate = selectedDate < getTodayKey();

  //이전달 또는 다음 달로 이동
  const moveMonth = (amount: number) => {
    const next = new Date(year, month + amount, 1);
    setViewDate(next);
    setSelectedDate(dateKey(next.getFullYear(), next.getMonth(), 1));
  };

  //선택한 날짜를 예약 가능 또는 휴무 상태로 변경
  const updateSelectedStatus = (status: "available" | "off") => {
    if (!resolvedMoverId || isPastSelectedDate || updateDayMutation.isPending) return;

    updateDayMutation.mutate(
      { date: selectedDate, status: status === "off" ? "OFF" : "AVAILABLE" },
      {
        onSuccess: () =>
          setToastMessage(status === "off" ? t("toast.setOff") : t("toast.unsetOff")),
        onError: (error) => setToastMessage(error.message || t("toast.updateFailed")),
      },
    );
  };

  if (!resolvedMoverId) {
    return <EstimatesQueryStatus message={t("moverUnavailable")} />;
  }

  // 아직 조회되지 않은 날짜는 예약 가능으로 추정하지 않고 조회 전 상태로 표시
  const selectedStatusForDisplay = selectedStatus ?? "unknown";
  //고객이 선택한 기사와 날짜를 가지고 견적 요청 페이지로 이동할 주소 생성
  const estimateRequestHref = `${APP_ROUTES.ESTIMATE_REQUEST}?moverId=${encodeURIComponent(resolvedMoverId)}&date=${selectedDate}`;

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
              {isMover ? t("moverTitle") : t("customerTitle", { moverName: displayedMoverName })}
            </Text>
            <Text as="p" variant="lg-regular" className="text-text-muted mt-6">
              {isMover ? t("moverDescription") : t("customerDescription")}
            </Text>
          </div>
          <div className="flex flex-wrap items-center gap-12" aria-label={t("statusGuideAria")}>
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
              aria-label={t("previousMonth")}
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
              {format.dateTime(new Date(year, month, 1), { year: "numeric", month: "long" })}
            </Text>
            <button
              type="button"
              onClick={() => moveMonth(1)}
              aria-label={t("nextMonth")}
              className="hover:bg-background-hover rounded-8 flex size-40 items-center justify-center transition-colors"
            >
              <span aria-hidden className="text-text-tertiary text-2xl">
                ›
              </span>
            </button>
          </div>

          <div className="border-border-subtle bg-background-subtle grid grid-cols-7 border-b py-10">
            {WEEKDAY_KEYS.map((weekday, index) => (
              <Text
                key={weekday}
                variant="md-semibold"
                className={cn("text-center", index === 0 ? "text-text-brand" : "text-text-muted")}
              >
                {t(`weekday.${weekday}`)}
              </Text>
            ))}
          </div>

          <div className="relative grid min-h-[330px] flex-1 grid-cols-7 grid-rows-6 md:min-h-[360px]">
            {days.map(({ day, monthOffset }, index) => {
              const cellDate = new Date(year, month + monthOffset, day);
              const key = dateKey(cellDate.getFullYear(), cellDate.getMonth(), day);
              const status = availability.get(key) ?? "unknown";
              const isSelected = selectedDate === key;
              const isCurrentMonth = monthOffset === 0;

              return (
                <button
                  type="button"
                  key={`${key}-${index}`}
                  aria-label={t("dayAria", {
                    date: format.dateTime(cellDate, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }),
                    status: t(`status.${status}`),
                  })}
                  aria-pressed={isSelected}
                  onClick={() => {
                    setSelectedDate(key);
                    if (monthOffset)
                      setViewDate(new Date(cellDate.getFullYear(), cellDate.getMonth(), 1));
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

            {calendarQuery.isPending ? (
              <div className="bg-background-surface/80 absolute inset-0 flex items-center justify-center">
                <Text as="p" variant="md-medium" className="text-text-muted">
                  {t("loading")}
                </Text>
              </div>
            ) : calendarQuery.isError ? (
              <div className="bg-background-surface/90 absolute inset-0 flex items-center justify-center">
                <EstimatesQueryStatus
                  message={t("loadFailed")}
                  actionLabel={t("retry")}
                  onAction={() => void calendarQuery.refetch()}
                />
              </div>
            ) : null}
          </div>
        </section>

        <section className="border-border-default bg-background-surface rounded-16 sticky bottom-6 mt-8 flex flex-col gap-10 border p-12 shadow-[0_8px_30px_rgba(17,17,17,0.10)] md:flex-row md:items-center md:justify-between md:p-14">
          <div className="flex items-center gap-14">
            <div className="bg-background-brand-muted text-text-brand rounded-12 flex size-52 shrink-0 flex-col items-center justify-center">
              <span className="text-[11px] font-medium">
                {format.dateTime(new Date(`${selectedDate}T00:00:00`), { month: "short" })}
              </span>
              <span className="text-[20px] leading-22 font-bold">{selectedDay}</span>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-8">
                <Text as="h3" variant="lg-bold" className="text-text-primary">
                  {t("selectedDate")}
                </Text>
                <AvailabilityPill status={selectedStatusForDisplay} />
              </div>
              <Text as="p" variant="sm-medium" className="text-text-muted mt-3">
                {selectedReservation
                  ? t("confirmedReservation", { customerName: selectedReservation.customerName })
                  : isMover
                    ? isPastSelectedDate
                      ? t("pastDate")
                      : t("moverDateEditable")
                    : selectedStatusForDisplay === "available"
                      ? t("availableForEstimate")
                      : selectedStatusForDisplay === "full"
                        ? t("fullDate")
                        : selectedStatusForDisplay === "off"
                          ? t("offDate")
                          : t("checkingStatus")}
              </Text>
            </div>
          </div>

          {isMover ? (
            <div className="grid grid-cols-2 gap-8 md:flex">
              {(["available", "off"] as const).map((status) => (
                <button
                  key={status}
                  type="button"
                  aria-pressed={selectedStatusForDisplay === status}
                  disabled={
                    !calendarQuery.isSuccess ||
                    selectedStatus === undefined ||
                    selectedStatusForDisplay === "full" ||
                    isPastSelectedDate ||
                    updateDayMutation.isPending
                  }
                  onClick={() => updateSelectedStatus(status)}
                  className={cn(
                    "rounded-8 border px-14 py-10 text-[14px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 md:min-w-100",
                    selectedStatusForDisplay === status
                      ? "border-border-brand bg-background-brand text-text-inverse"
                      : "border-border-default text-text-secondary hover:bg-background-subtle",
                  )}
                >
                  {t(`status.${status}`)}
                </button>
              ))}
            </div>
          ) : calendarQuery.isSuccess &&
            selectedStatus === "available" &&
            !isPastSelectedDate &&
            !calendarQuery.isFetching ? (
            <Link
              href={estimateRequestHref}
              className="bg-background-brand hover:bg-background-brand-hover text-text-inverse rounded-8 flex h-48 w-full items-center justify-center px-24 text-[16px] font-semibold transition-colors md:w-auto"
            >
              {t("requestEstimateForDate")}
            </Link>
          ) : (
            <button
              type="button"
              disabled
              className="bg-background-disabled text-text-disabled rounded-8 h-48 w-full px-24 text-[16px] font-semibold md:w-auto"
            >
              {t("estimateUnavailable")}
            </button>
          )}
        </section>
      </main>

      {toastMessage ? <Toast onClose={() => setToastMessage(null)}>{toastMessage}</Toast> : null}
    </div>
  );
}
