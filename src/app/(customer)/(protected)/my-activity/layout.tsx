import type { ReactNode } from "react";

import MyActivityTabs from "@/components/residence-review/MyActivityTabs";

const MyActivityLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <MyActivityTabs />
      {children}
    </>
  );
};

export default MyActivityLayout;
