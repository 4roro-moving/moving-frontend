import type { ReactNode } from "react";

import MyPageTabs from "@/components/residence-review/MyPageTabs";

const MyPageLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <MyPageTabs />
      {children}
    </>
  );
};

export default MyPageLayout;
