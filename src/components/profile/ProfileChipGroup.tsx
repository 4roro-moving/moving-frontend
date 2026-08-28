import SelectableChip from "@/components/common/Chip/SelectableChip";
import { Text } from "@/components/common/Text";
import { cn } from "@/lib/utils/cn";

export interface ProfileChipOption<T extends string | number> {
  value: T;
  label: string;
}

interface ProfileChipGroupBaseProps<T extends string | number> {
  options: ProfileChipOption<T>[];
  className?: string;
  chipClassName?: string;
  error?: string;
  disabled?: boolean;
  "aria-labelledby"?: string;
}

interface ProfileChipGroupSingleProps<
  T extends string | number,
> extends ProfileChipGroupBaseProps<T> {
  selectionMode: "single";
  value: T | null;
  onChange: (value: T | null) => void;
}

interface ProfileChipGroupMultipleProps<
  T extends string | number,
> extends ProfileChipGroupBaseProps<T> {
  selectionMode: "multiple";
  value: T[];
  onChange: (value: T[]) => void;
}

type ProfileChipGroupProps<T extends string | number> =
  ProfileChipGroupSingleProps<T> | ProfileChipGroupMultipleProps<T>;

const isSelected = <T extends string | number>(
  props: ProfileChipGroupProps<T>,
  optionValue: T,
): boolean => {
  if (props.selectionMode === "single") {
    return props.value === optionValue;
  }
  return props.value.includes(optionValue);
};

const handleSelect = <T extends string | number>(
  props: ProfileChipGroupProps<T>,
  optionValue: T,
): void => {
  if (props.selectionMode === "single") {
    props.onChange(props.value === optionValue ? null : optionValue);
    return;
  }

  if (props.value.includes(optionValue)) {
    props.onChange(props.value.filter((item) => item !== optionValue));
    return;
  }

  props.onChange([...props.value, optionValue]);
};

/** 프로필 서비스·지역 Chip 선택 그룹 */
const ProfileChipGroup = <T extends string | number>(props: ProfileChipGroupProps<T>) => {
  const {
    options,
    className,
    chipClassName,
    error,
    disabled,
    "aria-labelledby": ariaLabelledby,
  } = props;

  return (
    <div className="flex w-full flex-col gap-4">
      <div
        className={cn("flex flex-wrap gap-8 md:gap-12", className)}
        role="group"
        aria-labelledby={ariaLabelledby}
        aria-disabled={disabled || undefined}
      >
        {options.map((option) => (
          <SelectableChip
            key={String(option.value)}
            size="responsive"
            selected={isSelected(props, option.value)}
            disabled={disabled}
            onClick={() => handleSelect(props, option.value)}
            className={chipClassName}
          >
            {option.label}
          </SelectableChip>
        ))}
      </div>
      {error ? (
        <Text as="p" role="alert" variant="xs-regular" className="text-text-error">
          {error}
        </Text>
      ) : null}
    </div>
  );
};

export default ProfileChipGroup;
