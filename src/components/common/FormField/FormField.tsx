import { type ReactNode } from "react";

import { Text } from "@/components/common/Text";
import { cn } from "@/lib/utils/cn";

interface FormFieldProps {
  label: string;
  labelFor: string;
  children: ReactNode;
  className?: string;
  /** 기본: fieldLabel. auth: 로그인·회원가입 label */
  variant?: "default" | "auth";
}

const FormField = ({
  label,
  labelFor,
  children,
  className,
  variant = "default",
}: FormFieldProps) => {
  const isAuth = variant === "auth";

  return (
    <div className={cn("flex flex-col gap-10", className)}>
      <Text
        as="label"
        htmlFor={labelFor}
        variant={isAuth ? { base: "md-regular", md: "xl-regular" } : "fieldLabel"}
        className={isAuth ? "text-text-secondary" : "text-text-primary"}
      >
        {label}
      </Text>
      {children}
    </div>
  );
};

export default FormField;
