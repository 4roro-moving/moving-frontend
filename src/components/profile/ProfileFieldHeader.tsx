import { Text } from "@/components/common/Text";
import { cn } from "@/lib/utils/cn";

interface ProfileFieldHeaderProps {
  label: string;
  htmlFor?: string;
  required?: boolean;
  hint?: string;
  className?: string;
}

/** 프로필 필드 라벨 + 필수 표시 + 안내 문구 */
const ProfileFieldHeader = ({
  label,
  htmlFor,
  required = false,
  hint,
  className,
}: ProfileFieldHeaderProps) => {
  return (
    <div className={cn("flex w-full flex-col gap-4", className)}>
      {htmlFor ? (
        <Text
          as="label"
          htmlFor={htmlFor}
          variant="fieldLabel"
          className="text-text-tertiary flex items-center gap-4"
        >
          {label}
          {required ? (
            <Text as="span" variant="fieldLabel" className="text-text-brand" aria-hidden="true">
              *
            </Text>
          ) : null}
        </Text>
      ) : (
        <Text as="p" variant="fieldLabel" className="text-text-tertiary flex items-center gap-4">
          {label}
          {required ? (
            <Text as="span" variant="fieldLabel" className="text-text-brand" aria-hidden="true">
              *
            </Text>
          ) : null}
        </Text>
      )}
      {hint ? (
        <Text
          as="p"
          variant={{ base: "xs-regular", md: "lg-regular" }}
          className="text-text-subtle"
        >
          {hint}
        </Text>
      ) : null}
    </div>
  );
};

export default ProfileFieldHeader;
