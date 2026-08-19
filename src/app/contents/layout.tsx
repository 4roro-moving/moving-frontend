import type { ReactNode } from "react";

import ContentsShell from "@/components/contents/ContentsShell";

const ContentsLayout = ({ children }: { children: ReactNode }) => {
  return <ContentsShell>{children}</ContentsShell>;
};

export default ContentsLayout;
