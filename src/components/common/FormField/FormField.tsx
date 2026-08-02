import { type ReactNode } from "react";

import { Text, type TextVariantProp } from "@/components/common/Text";
import { cn } from "@/lib/utils/cn";

type FormFieldVariant = "default" | "compact" | "auth";

const FORM_FIELD_LABEL_VARIANTS = {
  default: { base: "lg-semibold", lg: "xl-semibold" },
  compact: { base: "lg-semibold", lg: "2lg-semibold" },
  auth: { base: "md-regular", lg: "xl-regular" },
} as const satisfies Record<FormFieldVariant, TextVariantProp>;

interface FormFieldProps {
  label: string;
  labelFor: string;
  children: ReactNode;
  className?: string;
  /** default: 프로필 등록·수정 폼 등 / compact: 모달 폼 / auth: 로그인·회원가입 */
  variant?: FormFieldVariant;
  /** FORM_FIELD_LABEL_VARIANTS에 해당하지 않는 라벨 타이포그래피에 사용 */
  labelVariant?: TextVariantProp;
}

const FormField = ({
  label,
  labelFor,
  children,
  className,
  variant = "default",
  labelVariant,
}: FormFieldProps) => {
  const isAuth = variant === "auth";

  return (
    <div className={cn("flex flex-col gap-10", className)}>
      <Text
        as="label"
        htmlFor={labelFor}
        variant={labelVariant ?? FORM_FIELD_LABEL_VARIANTS[variant]}
        className={isAuth ? "text-text-secondary" : "text-text-tertiary"}
      >
        {label}
      </Text>
      {children}
    </div>
  );
};

export default FormField;
