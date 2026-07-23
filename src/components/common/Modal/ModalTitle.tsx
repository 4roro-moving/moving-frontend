"use client";

import { useEffect, type ReactNode } from "react";

import { Text } from "@/components/common/Text";

import { useModalContext } from "./ModalMain";

const ModalTitle = ({ children }: { children: ReactNode }) => {
  const { titleId, setHasTitle } = useModalContext();

  useEffect(() => {
    setHasTitle(true);
    return () => setHasTitle(false);
  }, [setHasTitle]);

  return (
    <Text as="h2" id={titleId} variant="xl-bold" className="text-text-primary">
      {children}
    </Text>
  );
};

export default ModalTitle;
