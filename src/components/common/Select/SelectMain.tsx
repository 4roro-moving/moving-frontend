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

import { Text } from "@/components/common/Text";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useListboxKeyboardNav } from "@/hooks/useListboxKeyboardNav";
import { cn } from "@/lib/utils/cn";
import { ChevronDownIcon, ChevronUpIcon } from "@/icons";

interface SelectContextValue {
  selected: string;
  handleChange: (value: string) => void;
}

const SelectContext = createContext<SelectContextValue | null>(null);

const selectVariants = cva("relative", {
  variants: {
    size: {
      sm: "w-[54px]",
      lg: "w-[128px]",
    },
  },
  defaultVariants: { size: "lg" },
});

export interface SelectMainProps extends VariantProps<typeof selectVariants> {
  children: ReactNode;
  desc: ReactNode;
  /** 수정 폼 등에서 이전 선택값을 미리 채워야 할 때 사용 */
  defaultValue?: string;
  onChange?: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

const SelectMain = ({
  children,
  desc,
  size,
  defaultValue,
  onChange,
  error,
  disabled,
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
    if (defaultValue) {
      setSelected(defaultValue);
    }
  }

  const handleChange = (value: string) => {
    setSelected(value);
    setIsOpen(false);
    onChange?.(value);
    focusTrigger();
  };

  return (
    <SelectContext.Provider value={{ selected, handleChange }}>
      <div className="flex w-full flex-col gap-4">
        <div ref={containerRef} className={selectVariants({ size })}>
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
              "rounded-12 shadow-card flex h-48 w-full items-center justify-between border px-12 py-16",
              "border-border-default bg-background-surface text-text-primary transition-colors",
              "disabled:bg-background-disabled disabled:text-text-disabled disabled:cursor-not-allowed",
              isOpen && "border-border-brand bg-background-brand-muted text-text-brand",
              error && "border-border-error",
            )}
            onClick={() => setIsOpen((prev) => !prev)}
            onKeyDown={handleTriggerKeyDown}
          >
            <Text variant="md-regular">{selectedLabel || desc}</Text>
            {isOpen ? (
              <ChevronUpIcon className="size-24" />
            ) : (
              <ChevronDownIcon className="size-24" />
            )}
          </button>

          {isOpen && (
            <div
              ref={listboxRef}
              id={listboxId}
              role="listbox"
              onKeyDown={handleListboxKeyDown}
              className={cn(
                "rounded-12 bg-background-surface absolute z-50 my-4 flex w-full min-w-[128px] flex-col items-start",
                "border-border-default border shadow-[4px_4px_10px_0px_rgba(224,224,224,0.25)]",
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
