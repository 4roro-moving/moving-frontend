"use client";

import { useTranslations } from "next-intl";

import { Text } from "@/components/common/Text";
import { useListboxKeyboardNav } from "@/hooks/useListboxKeyboardNav";
import { usePresence } from "@/hooks/usePresence";
import { cn } from "@/lib/utils/cn";
import { DROPDOWN_EXIT_DURATION_MS, dropdownMotionClassName } from "@/lib/utils/uiMotion";

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
  const tr = useTranslations("common");
  const hiddenPages = Array.from({ length: Math.max(0, end - start - 1) }, (_, i) => start + 1 + i);
  const { isRendered: isListboxRendered, isVisible: isListboxVisible } = usePresence(
    isOpen,
    DROPDOWN_EXIT_DURATION_MS,
  );
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
        aria-label={tr("pagination.more")}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <Text variant="md-regular" className="text-text-weak">
          ...
        </Text>
      </button>

      {isListboxRendered ? (
        <ul
          ref={listboxRef}
          role="listbox"
          aria-hidden={!isListboxVisible}
          onKeyDown={handleListboxKeyDown}
          className={cn(
            "border-border-default bg-background-surface rounded-4 absolute bottom-0 z-10 flex max-h-45 w-full flex-col items-center overflow-y-auto border shadow-md",
            dropdownMotionClassName(isListboxVisible, "bottom"),
          )}
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
                aria-label={tr("pagination.page", { page })}
              >
                <Text variant="sm-medium" className="text-text-primary">
                  {page}
                </Text>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
};

export default PaginationEllipsis;
