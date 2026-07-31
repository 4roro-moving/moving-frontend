"use client";

import Checkbox from "@/components/common/Checkbox/Checkbox";
import { Text } from "@/components/common/Text";
import { cn } from "@/lib/utils/cn";

export interface FavoriteMoversToolbarProps {
  selectedCount: number;
  totalCount: number;
  isAllSelected: boolean;
  disabled?: boolean;
  isDeleting?: boolean;
  onSelectAll: (checked: boolean) => void;
  onBulkDelete: () => void;
}

export default function FavoriteMoversToolbar({
  selectedCount,
  totalCount,
  isAllSelected,
  disabled = false,
  isDeleting = false,
  onSelectAll,
  onBulkDelete,
}: FavoriteMoversToolbarProps) {
  const canDelete = selectedCount > 0 && !disabled && !isDeleting;

  return (
    <div className="flex h-36 w-full items-center justify-between gap-12">
      <Checkbox
        checked={isAllSelected}
        disabled={disabled || totalCount === 0}
        onCheckedChange={onSelectAll}
        label={
          <Text as="span" variant={{ base: "md-regular", md: "lg-regular" }}>
            {`전체선택(${selectedCount}/${totalCount})`}
          </Text>
        }
        labelClassName="text-text-tertiary"
      />

      <button
        type="button"
        disabled={!canDelete}
        className={cn(
          "rounded-8 focus-visible:ring-border-brand px-8 transition-colors focus-visible:ring-2 focus-visible:outline-none min-[744px]:px-12",
          canDelete
            ? "text-text-subtle hover:text-text-secondary"
            : "text-text-subtle cursor-not-allowed opacity-50",
        )}
        onClick={onBulkDelete}
      >
        <Text as="span" variant={{ base: "md-regular", md: "lg-regular" }} className="text-inherit">
          선택 항목 삭제
        </Text>
      </button>
    </div>
  );
}
