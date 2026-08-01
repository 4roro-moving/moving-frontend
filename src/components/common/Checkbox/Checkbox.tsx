"use client";

import Image from "next/image";
import { type InputHTMLAttributes, type ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

export interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "onChange" | "checked" | "size"
> {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  /** 체크박스 옆 표시 라벨. 없으면 aria-label 필수 */
  label?: ReactNode;
  labelClassName?: string;
}

/**
 * Figma check-box (hit 36 · box 20 · radius 4)
 * ReceivedRequestsPage 체크 UI와 동일 패턴
 */
export default function Checkbox({
  checked,
  onCheckedChange,
  label,
  labelClassName,
  className,
  disabled,
  id,
  "aria-label": ariaLabel,
  ...rest
}: CheckboxProps) {
  return (
    <label
      className={cn(
        "inline-flex cursor-pointer items-center gap-4",
        disabled && "cursor-not-allowed opacity-50",
        className,
      )}
    >
      <input
        {...rest}
        id={id}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        aria-label={label ? undefined : ariaLabel}
        className="peer sr-only"
        onChange={(event) => onCheckedChange(event.target.checked)}
      />
      <span className="peer-focus-visible:ring-border-brand rounded-4 flex size-36 shrink-0 items-center justify-center peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2">
        <span
          className={cn(
            "rounded-4 flex size-20 items-center justify-center",
            checked ? "bg-background-brand" : "border-border-default bg-background-surface border",
          )}
          aria-hidden="true"
        >
          {checked ? <Image src="/icons/checkbox-check.svg" alt="" width={10} height={6} /> : null}
        </span>
      </span>
      {label ? <span className={labelClassName}>{label}</span> : null}
    </label>
  );
}
