import { type ReactNode } from "react";

import { Text, type TextVariantProp } from "@/components/common/Text";
import { cn } from "@/lib/utils/cn";

type FormFieldVariant = "default" | "compact" | "auth";

const FORM_FIELD_LABEL_VARIANTS = {
  default: { base: "lg-semibold", xl: "xl-semibold" },
  compact: { base: "lg-semibold", xl: "2lg-semibold" },
  auth: { base: "md-regular", xl: "xl-regular" },
} as const satisfies Record<FormFieldVariant, TextVariantProp>;

interface FormFieldProps {
  label: string;
  /** 단일 input/textarea와 연결. Chip group이면 생략하고 labelId 사용 */
  labelFor?: string;
  /** Chip group 등 — 시각 라벨을 aria-labelledby로 연결할 때 */
  labelId?: string;
  children: ReactNode;
  className?: string;
  /** default: 프로필 등록·수정 폼 등 / compact: 모달 폼 / auth: 로그인·회원가입 */
  variant?: FormFieldVariant;
  /** FORM_FIELD_LABEL_VARIANTS에 해당하지 않는 라벨 타이포에 사용 */
  labelVariant?: TextVariantProp;
  required?: boolean;
  /** 라벨 아래 부가 안내 문구 */
  description?: string;
}

const FormField = ({
  label,
  labelFor,
  labelId,
  children,
  className,
  variant = "default",
  labelVariant,
  required = false,
  description,
}: FormFieldProps) => {
  const isAuth = variant === "auth";
  const resolvedLabelVariant = labelVariant ?? FORM_FIELD_LABEL_VARIANTS[variant];
  const labelClassName = isAuth ? "text-text-secondary" : "text-text-tertiary";

  const labelContent = (
    <>
      {label}
      {required ? (
        <>
          <Text
            as="span"
            variant={resolvedLabelVariant}
            className="text-text-brand"
            aria-hidden="true"
          >
            *
          </Text>
          <span className="sr-only">필수</span>
        </>
      ) : null}
    </>
  );

  return (
    <div className={cn("flex flex-col gap-10", className)}>
      <div className="flex w-full flex-col gap-4">
        {labelFor ? (
          <Text
            as="label"
            htmlFor={labelFor}
            variant={resolvedLabelVariant}
            className={cn(labelClassName, "flex items-center gap-4")}
          >
            {labelContent}
          </Text>
        ) : (
          <Text
            as="p"
            id={labelId}
            variant={resolvedLabelVariant}
            className={cn(labelClassName, "flex items-center gap-4")}
          >
            {labelContent}
          </Text>
        )}
        {description ? (
          <Text
            as="p"
            variant={{ base: "xs-regular", md: "lg-regular" }}
            className="text-text-subtle"
          >
            {description}
          </Text>
        ) : null}
      </div>
      {children}
    </div>
  );
};

export default FormField;
