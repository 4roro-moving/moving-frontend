import type { ReactNode } from "react";

import { Text } from "@/components/common/Text";

const ModalTitle = ({ children }: { children: ReactNode }) => {
  return (
    <Text as="p" variant="xl-bold" className="text-text-primary">
      {children}
    </Text>
  );
};

export default ModalTitle;
