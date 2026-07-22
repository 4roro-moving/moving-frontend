"use client";

import { Text } from "@/components/common/Text";
import { cn } from "@/lib/utils/cn";

interface PaginationEllipsisProps {
  isOpen: boolean;
  index: number;
  start: number;
  end: number;
  onOpenChange: (index: number | null) => void;
  onSelect: (page: number) => void;
}

const PaginationEllipsis = ({
  isOpen,
  index,
  start,
  end,
  onOpenChange,
  onSelect,
}: PaginationEllipsisProps) => {
  const hiddenPages = Array.from({ length: Math.max(0, end - start - 1) }, (_, i) => start + 1 + i);

  return (
    <div className="relative z-10 size-full">
      <button
        type="button"
        className="size-full"
        onClick={() => onOpenChange(isOpen ? null : index)}
        aria-label="숨겨진 페이지 더보기"
        aria-expanded={isOpen}
      >
        <Text variant="md-regular" className="text-text-primary">
          ...
        </Text>
      </button>

      {isOpen && (
        <ul
          role="listbox"
          className="border-border-default bg-background-surface rounded-4 absolute bottom-0 flex max-h-[180px] w-full flex-col items-center overflow-y-auto border shadow-md"
        >
          {hiddenPages.map((page) => (
            <li key={page} className="w-full">
              <button
                type="button"
                role="option"
                aria-selected={false}
                className={cn(
                  "hover:bg-background-hover w-full py-8 text-center",
                  hiddenPages.length === 1 && "py-13",
                )}
                onClick={() => {
                  onSelect(page);
                  onOpenChange(null);
                }}
                aria-label={`${page} 페이지`}
              >
                <Text variant="sm-medium" className="text-text-primary">
                  {page}
                </Text>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PaginationEllipsis;
