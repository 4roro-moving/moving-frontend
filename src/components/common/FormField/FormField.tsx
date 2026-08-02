import { type ReactNode } from "react";

import { Text } from "@/components/common/Text";
import { cn } from "@/lib/utils/cn";

interface FormFieldProps {
  label: string;
  /** 연결할 input id. Chip 그룹처럼 단일 input이 없으면 생략 */
  labelFor?: string;
  children: ReactNode;
  className?: string;
  /** 기본: fieldLabel. auth: 로그인·회원가입 label */
  variant?: "default" | "auth";
  required?: boolean;
  /** 라벨 아래 부가 안내 문구 */
  description?: string;
}

const FormField = ({
  label,
  labelFor,
  children,
  className,
  variant = "default",
  required = false,
  description,
}: FormFieldProps) => {
  const isAuth = variant === "auth";
  const labelClassName = isAuth ? "text-text-secondary" : "text-text-tertiary";
  const labelVariant = isAuth
    ? ({ base: "md-regular", md: "xl-regular" } as const)
    : ("fieldLabel" as const);

  const labelContent = (
    <>
      {label}
      {required ? (
        <Text as="span" variant={labelVariant} className="text-text-brand" aria-hidden="true">
          *
        </Text>
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
            variant={labelVariant}
            className={cn(labelClassName, "flex items-center gap-4")}
          >
            {labelContent}
          </Text>
        ) : (
          <Text
            as="p"
            variant={labelVariant}
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
