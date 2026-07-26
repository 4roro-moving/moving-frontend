"use client";

import { cva, type VariantProps } from "class-variance-authority";
import {
  Children,
  createContext,
  isValidElement,
  useContext,
  useId,
  useState,
  type ReactNode,
} from "react";

import { Text, type TextVariantProp } from "@/components/common/Text";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useListboxKeyboardNav } from "@/hooks/useListboxKeyboardNav";
import { cn } from "@/lib/utils/cn";
import { ChevronDownIcon, ChevronUpIcon } from "@/icons";

type SelectVariant = "default" | "sort";

interface SelectContextValue {
  selected: string;
  handleChange: (value: string) => void;
  variant: SelectVariant;
  columns: number;
}

const SelectContext = createContext<SelectContextValue | null>(null);

/**
 * Figma dropdown size=sm → 모바일/태블릿(기본)
 * Figma dropdown size=md → 데스크톱(lg:)
 */
const selectVariants = cva("relative", {
  variants: {
    size: {
      sm: "w-[54px]",
      lg: "w-[128px]",
    },
  },
  defaultVariants: { size: "lg" },
});

const selectTriggerVariants = cva(
  [
    "flex w-full items-center justify-between transition-colors",
    "text-text-secondary",
    "disabled:cursor-not-allowed disabled:text-text-disabled",
  ],
  {
    variants: {
      variant: {
        default: [
          "rounded-8 gap-6 border py-6 pr-10 pl-14",
          "border-border-default bg-background-surface",
          "disabled:bg-background-disabled",
          "lg:rounded-12 lg:h-[50px] lg:gap-0 lg:py-16 lg:pr-12 lg:pl-20",
        ],
        /** 정렬: 테두리·그림자 없이 텍스트 + 아이콘 */
        sort: [
          "gap-2 rounded-8 border-0 bg-transparent py-6 pr-6 pl-8 shadow-none",
          "lg:gap-10 lg:px-10 lg:py-8",
        ],
      },
    },
    defaultVariants: { variant: "default" },
  },
);

function getTriggerTextVariant(variant: SelectVariant, isOpen: boolean): TextVariantProp {
  if (variant === "sort") {
    return isOpen
      ? { base: "xs-medium", lg: "md-medium" }
      : { base: "xs-semibold", lg: "md-semibold" };
  }

  return { base: "md-medium", lg: "lg-medium" };
}

export interface SelectMainProps extends VariantProps<typeof selectVariants> {
  children: ReactNode;
  desc: ReactNode;
  /** 수정 폼 등에서 이전 선택값을 미리 채워야 할 때 사용 */
  defaultValue?: string;
  /**
   * 이 값이 선택됐을 때 옵션 라벨 대신 desc를 트리거에 표시
   * (예: 전체 선택 시 "지역"/"서비스" 유지)
   */
  placeholderValue?: string;
  /** default: 카드형 / sort: 테두리·그림자 없음 */
  variant?: SelectVariant;
  /** 옵션이 많을 때 다열 드롭다운 (예: 지역 2열) */
  columns?: 1 | 2;
  onChange?: (value: string) => void;
  error?: string;
  disabled?: boolean;
  className?: string;
}

const SelectMain = ({
  children,
  desc,
  size,
  defaultValue,
  placeholderValue,
  variant = "default",
  columns = 1,
  onChange,
  error,
  disabled,
  className,
}: SelectMainProps) => {
  const [isOpen, setIsOpen] = useState(false);
  // selectedLabel 을 selected 로 합쳐둠
  const [selected, setSelected] = useState(defaultValue ?? "");
  // 수정 등 폼에 미리 있어야하는 값이 있다면 이전 값을 저장해둠
  const [prevDefaultValue, setPrevDefaultValue] = useState(defaultValue);
  const listboxId = useId();
  const containerRef = useClickOutside<HTMLDivElement>(() => setIsOpen(false));
  const { triggerRef, listboxRef, handleTriggerKeyDown, handleListboxKeyDown, focusTrigger } =
    useListboxKeyboardNav<HTMLButtonElement, HTMLDivElement>({
      isOpen,
      onOpen: () => setIsOpen(true),
      onClose: () => setIsOpen(false),
      columns,
    });

  let selectedLabel: ReactNode = "";

  Children.forEach(children, (child) => {
    if (
      isValidElement<{ value: string; children: ReactNode }>(child) &&
      child.props.value === selected
    ) {
      selectedLabel = child.props.children;
    }
  });

  if (defaultValue !== prevDefaultValue) {
    setPrevDefaultValue(defaultValue);
    setSelected(defaultValue ?? "");
  }

  const handleChange = (value: string) => {
    setSelected(value);
    setIsOpen(false);
    onChange?.(value);
    focusTrigger();
  };

  const triggerLabel =
    placeholderValue !== undefined && selected === placeholderValue ? desc : selectedLabel || desc;

  const isMultiColumn = columns > 1;
  const defaultShadowClass =
    variant === "default"
      ? isOpen
        ? "shadow-select-open lg:shadow-select-lg-open"
        : "shadow-select lg:shadow-select-lg"
      : undefined;

  const chevronClassName = variant === "sort" ? "size-20" : "size-20 lg:size-36";

  return (
    <SelectContext.Provider value={{ selected, handleChange, variant, columns }}>
      <div className="flex w-full flex-col gap-4">
        <div ref={containerRef} className={cn(selectVariants({ size }), className)}>
          <button
            ref={triggerRef}
            type="button"
            role="combobox"
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            aria-controls={listboxId}
            aria-invalid={!!error}
            disabled={disabled}
            className={cn(
              selectTriggerVariants({ variant }),
              defaultShadowClass,
              variant === "default" &&
                isOpen &&
                "border-border-brand bg-background-brand-muted text-text-brand",
              variant === "sort" && isOpen && "text-text-subtle",
              variant === "default" && error && "border-border-error",
            )}
            onClick={() => setIsOpen((prev) => !prev)}
            onKeyDown={handleTriggerKeyDown}
          >
            <Text variant={getTriggerTextVariant(variant, isOpen)}>{triggerLabel}</Text>
            {isOpen ? (
              <ChevronUpIcon className={chevronClassName} />
            ) : (
              <ChevronDownIcon className={chevronClassName} />
            )}
          </button>

          {isOpen && (
            <div
              ref={listboxRef}
              id={listboxId}
              role="listbox"
              onKeyDown={handleListboxKeyDown}
              className={cn(
                "bg-background-surface absolute z-50 my-4",
                variant === "sort" &&
                  "rounded-8 border-border-subtle flex w-[91px] min-w-[91px] flex-col items-start border lg:w-[114px] lg:min-w-[114px]",
                variant === "default" &&
                  !isMultiColumn &&
                  "rounded-8 border-border-default shadow-select lg:rounded-12 flex w-full min-w-[106px] flex-col items-start border lg:min-w-[160px]",
                variant === "default" &&
                  isMultiColumn &&
                  // sm: 75×36 × 2열 / md: 164×64 × 2열, 보이는 행 5개
                  "rounded-8 border-border-default shadow-select lg:rounded-16 grid max-h-[180px] w-[150px] grid-cols-2 overflow-y-auto border lg:max-h-[320px] lg:w-[328px]",
              )}
            >
              {children}
            </div>
          )}
        </div>
        {error && (
          <Text variant="xs-regular" className="text-text-error">
            {error}
          </Text>
        )}
      </div>
    </SelectContext.Provider>
  );
};

export const useSelectContext = () => {
  const context = useContext(SelectContext);

  if (!context) {
    throw new Error("Select 컴포넌트 내에서만 사용 가능합니다.");
  }

  return context;
};

export { SelectMain };
