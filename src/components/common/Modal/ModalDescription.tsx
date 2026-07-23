"use client";

import { useEffect, type ReactNode } from "react";

import { Text } from "@/components/common/Text";
import { cn } from "@/lib/utils/cn";

import { useModalContext } from "./ModalMain";

interface ModalDescriptionProps {
  children: ReactNode;
  className?: string;
}

const ModalDescription = ({ children, className }: ModalDescriptionProps) => {
  const { descriptionId, setHasDescription } = useModalContext();

  useEffect(() => {
    setHasDescription(true);
    return () => setHasDescription(false);
  }, [setHasDescription]);

  return (
    <Text
      as="p"
      id={descriptionId}
      variant="md-regular"
      className={cn("text-text-secondary", className)}
    >
      {children}
    </Text>
  );
};

export default ModalDescription;
