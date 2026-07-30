"use client";

import { useEffect, useRef, useState } from "react";

import { Text } from "@/components/common/Text";
import { cn } from "@/lib/utils/cn";
import { formatKoreanDate } from "@/lib/utils/date";

import Calendar from "./Calendar";
import { CalendarIcon, ChevronDownIcon } from "../icons";

interface DatePickerFieldProps {
  value: Date;
  onChange: (date: Date) => void;
  className?: string;
}

export default function DatePickerField({ value, onChange, className }: DatePickerFieldProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-controls="estimate-date-picker-popup"
        className={cn(
          "rounded-12 bg-background-surface flex h-[50px] w-full items-center gap-8 border pr-12 pl-20",
          isOpen ? "border-border-brand" : "border-border-subtle",
        )}
      >
        <CalendarIcon className="text-icon-brand shrink-0" />
        <Text
          as="span"
          variant="lg-medium"
          suppressHydrationWarning
          className="text-text-secondary flex-1 text-left"
        >
          {formatKoreanDate(value)}
        </Text>
        <ChevronDownIcon
          className={cn("text-text-tertiary shrink-0 transition-transform", isOpen && "rotate-180")}
        />
      </button>

      {isOpen && (
        <div
          id="estimate-date-picker-popup"
          role="region"
          aria-label="날짜 선택"
          className="absolute top-full left-0 z-20 mt-8 w-full"
        >
          <Calendar
            selected={value}
            onSelect={(date) => {
              onChange(date);
              setIsOpen(false);
            }}
          />
        </div>
      )}
    </div>
  );
}
