"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";

import { Text } from "@/components/common/Text";
import { useClickOutside } from "@/hooks/useClickOutside";
import { cn } from "@/lib/utils/cn";

interface ReportMoreMenuProps {
  ariaLabel: string;
  onReport: () => void;
  triggerSizeClassName?: string;
  triggerIconClassName?: string;
  menuPositionClassName?: string;
  reportLabel?: ReactNode;
}

export default function ReportMoreMenu({
  ariaLabel,
  onReport,
  triggerSizeClassName = "size-32",
  triggerIconClassName = "text-[22px] leading-none",
  menuPositionClassName = "top-[calc(100%+8px)]",
  reportLabel = (
    <Text as="span" variant="sm-medium">
      신고하기
    </Text>
  ),
}: ReportMoreMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useClickOutside<HTMLDivElement>(() => setIsOpen(false));

  const handleReport = () => {
    setIsOpen(false);
    onReport();
  };

  return (
    <div ref={containerRef} className="relative shrink-0">
      <button
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
        className={cn(
          "text-text-secondary",
          "flex items-center justify-center rounded-full",
          "transition-colors",
          "hover:bg-background-subtle hover:text-text-primary",
          triggerSizeClassName,
        )}
      >
        <span aria-hidden="true" className={triggerIconClassName}>
          ⋮
        </span>
      </button>

      {isOpen ? (
        <div
          role="menu"
          className={cn(
            "border-border-default bg-background-surface",
            "absolute right-0 z-30",
            "rounded-8 min-w-[132px] border p-4",
            "shadow-md",
            menuPositionClassName,
          )}
        >
          <button
            type="button"
            role="menuitem"
            onClick={handleReport}
            className={cn(
              "text-text-secondary",
              "rounded-6 flex w-full items-center gap-8",
              "px-12 py-10",
              "text-left transition-colors",
              "hover:bg-background-subtle hover:text-text-primary",
            )}
          >
            <Image src="/icons/report.svg" alt="" width={18} height={18} aria-hidden="true" />
            {reportLabel}
          </button>
        </div>
      ) : null}
    </div>
  );
}
