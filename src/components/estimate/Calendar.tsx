"use client";

import { useState } from "react";

import { Text } from "@/components/common/Text";
import { cn } from "@/lib/utils/cn";
import { addMonths, getMonthMatrix, isBeforeDay, isSameDay, startOfDay } from "@/lib/utils/date";

import { ChevronLeftIcon, ChevronRightIcon } from "./icons";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

interface CalendarProps {
  selected: Date;
  onSelect: (date: Date) => void;
  /** 이 날짜 이전은 선택 불가 (기본: 오늘) */
  minDate?: Date;
}

export default function Calendar({ selected, onSelect, minDate }: CalendarProps) {
  const [viewMonth, setViewMonth] = useState<Date>(
    () => new Date(selected.getFullYear(), selected.getMonth(), 1),
  );

  const today = new Date();
  const min = minDate ? startOfDay(minDate) : startOfDay(today);
  const cells = getMonthMatrix(viewMonth.getFullYear(), viewMonth.getMonth()).flat();

  const minMonth = new Date(min.getFullYear(), min.getMonth(), 1);
  const isPrevDisabled = viewMonth.getTime() <= minMonth.getTime();

  return (
    <div className="rounded-16 border-border-subtle bg-background-surface flex w-full flex-col gap-16 border p-16 shadow-lg">
      {/* Header: 월 이동 */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setViewMonth((m) => addMonths(m, -1))}
          disabled={isPrevDisabled}
          aria-label="이전 달"
          className="rounded-8 hover:bg-background-hover flex size-32 items-center justify-center disabled:pointer-events-none disabled:opacity-40"
        >
          <ChevronLeftIcon className="text-text-tertiary" />
        </button>
        <Text as="span" variant="lg-semibold" className="text-text-primary">
          {viewMonth.getFullYear()}년 {viewMonth.getMonth() + 1}월
        </Text>
        <button
          type="button"
          onClick={() => setViewMonth((m) => addMonths(m, 1))}
          aria-label="다음 달"
          className="rounded-8 hover:bg-background-hover flex size-32 items-center justify-center"
        >
          <ChevronRightIcon className="text-text-tertiary" />
        </button>
      </div>

      {/* 요일 */}
      <div className="grid grid-cols-7">
        {WEEKDAYS.map((weekday) => (
          <Text
            key={weekday}
            as="span"
            variant="sm-medium"
            className="text-text-subtle py-8 text-center"
          >
            {weekday}
          </Text>
        ))}
      </div>

      {/* 날짜 */}
      <div className="grid grid-cols-7 gap-2">
        {cells.map(({ date, inCurrentMonth }) => {
          const isSelected = isSameDay(date, selected);
          const isToday = isSameDay(date, today);
          const isDisabled = isBeforeDay(date, min);

          return (
            <button
              key={date.toISOString()}
              type="button"
              onClick={() => onSelect(date)}
              disabled={isDisabled}
              className={cn(
                "rounded-8 flex aspect-square items-center justify-center transition-colors",
                isDisabled
                  ? "pointer-events-none"
                  : isSelected
                    ? "bg-background-brand"
                    : "hover:bg-background-hover",
              )}
            >
              <Text
                as="span"
                variant={isSelected ? "md-semibold" : "md-regular"}
                className={cn(
                  isDisabled
                    ? "text-text-faint"
                    : isSelected
                      ? "text-text-inverse"
                      : !inCurrentMonth
                        ? "text-text-faint"
                        : isToday
                          ? "text-text-brand"
                          : "text-text-secondary",
                )}
              >
                {date.getDate()}
              </Text>
            </button>
          );
        })}
      </div>
    </div>
  );
}
