import type { ReactNode } from "react";

import { Text } from "@/components/common/Text";
import { cn } from "@/lib/utils/cn";

interface ModalDescriptionProps {
  children: ReactNode;
  className?: string;
}

const ModalDescription = ({ children, className }: ModalDescriptionProps) => {
  return (
    <Text as="p" variant="md-regular" className={cn("text-text-secondary", className)}>
      {children}
    </Text>
  );
};

export default ModalDescription;
