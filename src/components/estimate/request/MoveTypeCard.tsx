"use client";

import Image from "next/image";

import { Text } from "@/components/common/Text";
import { cn } from "@/lib/utils/cn";

import { CheckIcon } from "../icons";

interface MoveTypeCardProps {
  title: string;
  description: string;
  imageSrc: string;
  selected: boolean;
  onSelect: () => void;
}

export default function MoveTypeCard({
  title,
  description,
  imageSrc,
  selected,
  onSelect,
}: MoveTypeCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "rounded-16 flex flex-1 items-start justify-end gap-8 border-2 px-16 py-20 text-left transition-colors md:flex-col md:items-end md:gap-16 md:pt-20 md:pb-16",
        selected
          ? "border-border-brand bg-background-brand-muted"
          : "bg-background-muted hover:bg-background-hover border-transparent",
      )}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-8 md:w-full md:flex-row md:items-start">
        <span
          className={cn(
            "flex size-24 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
            selected
              ? "border-border-brand bg-background-brand text-text-inverse"
              : "border-border-muted bg-background-surface",
          )}
        >
          {selected && <CheckIcon />}
        </span>
        <span className="flex flex-col">
          <Text as="span" variant="lg-semibold" className="text-text-primary">
            {title}
          </Text>
          <Text as="span" variant="md-regular" className="text-text-muted">
            {description}
          </Text>
        </span>
      </div>
      <div className="relative size-[120px] shrink-0 self-end">
        <Image
          src={imageSrc}
          alt={title}
          fill
          sizes="120px"
          unoptimized
          className="object-contain"
        />
      </div>
    </button>
  );
}
