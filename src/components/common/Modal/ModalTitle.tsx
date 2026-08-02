"use client";

import { useEffect, type ReactNode } from "react";

import { Text, type TextVariantProp } from "@/components/common/Text";
import { cn } from "@/lib/utils/cn";

import { useModalContext } from "./ModalMain";

interface ModalTitleProps {
  children: ReactNode;
  className?: string;
  variant?: TextVariantProp;
}

const ModalTitle = ({ children, className, variant = "modalTitle" }: ModalTitleProps) => {
  const { titleId, setHasTitle } = useModalContext();

  useEffect(() => {
    setHasTitle(true);
    return () => setHasTitle(false);
  }, [setHasTitle]);

  return (
    <Text
      as="h2"
      id={titleId}
      variant={variant}
      className={cn("text-text-primary min-w-0", className)}
    >
      {children}
    </Text>
  );
};

export default ModalTitle;
