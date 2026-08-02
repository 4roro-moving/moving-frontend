import { Text } from "@/components/common/Text";
import { cn } from "@/lib/utils/cn";

interface ProfileSelectableChipProps {
  label: string;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

/** 프로필 폼용 선택 Chip (Figma chip/basic) */
const ProfileSelectableChip = ({
  label,
  selected = false,
  onClick,
  className,
}: ProfileSelectableChipProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "inline-flex items-center justify-center rounded-full border px-12 py-6 transition-colors md:px-20 md:py-10",
        selected
          ? "border-border-brand bg-background-brand-muted text-text-brand"
          : "border-border-muted bg-background-subtle text-text-secondary hover:border-border-brand",
        className,
      )}
    >
      <Text as="span" variant={{ base: "md-regular", md: "2lg-regular" }} className="text-center">
        {label}
      </Text>
    </button>
  );
};

export default ProfileSelectableChip;
