import { type ReactNode } from "react";

import { Text } from "@/components/common/Text";
import { cn } from "@/lib/utils/cn";

interface FormFieldProps {
  label: string;
  labelFor: string;
  children: ReactNode;
  className?: string;
}

const FormField = ({ label, labelFor, children, className }: FormFieldProps) => {
  return (
    <div className={cn("flex flex-col gap-10", className)}>
      <Text as="label" htmlFor={labelFor} variant="fieldLabel" className="text-text-primary">
        {label}
      </Text>
      {children}
    </div>
  );
};

export default FormField;
