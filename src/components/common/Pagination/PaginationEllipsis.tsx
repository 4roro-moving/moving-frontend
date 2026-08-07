"use client";

import { Text } from "@/components/common/Text";
import { useListboxKeyboardNav } from "@/hooks/useListboxKeyboardNav";
import { cn } from "@/lib/utils/cn";

interface PaginationEllipsisProps {
  isOpen: boolean;
  index: number;
  start: number;
  end: number;
  onOpenChange: (index: number | null) => void;
  onSelect: (page: number) => void;
  className?: string;
}

const PaginationEllipsis = ({
  isOpen,
  index,
  start,
  end,
  onOpenChange,
  onSelect,
  className,
}: PaginationEllipsisProps) => {
  const hiddenPages = Array.from({ length: Math.max(0, end - start - 1) }, (_, i) => start + 1 + i);
  const { triggerRef, listboxRef, handleTriggerKeyDown, handleListboxKeyDown, focusTrigger } =
    useListboxKeyboardNav<HTMLButtonElement, HTMLUListElement>({
      isOpen,
      onOpen: () => onOpenChange(index),
      onClose: () => onOpenChange(null),
    });

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        className={cn(className, "flex items-center justify-center")}
        onClick={() => onOpenChange(isOpen ? null : index)}
        onKeyDown={handleTriggerKeyDown}
        aria-label="숨겨진 페이지 더보기"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <Text variant="md-regular" className="text-text-weak">
          ...
        </Text>
      </button>

      {isOpen && (
        <ul
          ref={listboxRef}
          role="listbox"
          onKeyDown={handleListboxKeyDown}
          className="border-border-default bg-background-surface rounded-4 animate-dropdown-in absolute bottom-0 z-10 flex max-h-[180px] w-full origin-bottom flex-col items-center overflow-y-auto border shadow-md motion-reduce:animate-none"
        >
          {hiddenPages.map((page) => (
            <li key={page} className="w-full">
              <button
                type="button"
                role="option"
                aria-selected={false}
                className={cn(
                  "hover:bg-background-hover size-full py-8 text-center",
                  hiddenPages.length === 1 && "py-12",
                )}
                onClick={() => {
                  onSelect(page);
                  onOpenChange(null);
                  focusTrigger();
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
