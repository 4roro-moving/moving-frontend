"use client";

import MyActivityTabs from "@/components/residence-review/MyActivityTabs";
import { useResolvedAuthRole } from "@/hooks/auth/useResolvedAuthRole";

const MyReportsNavigation = () => {
  const role = useResolvedAuthRole(null);

  if (role !== "CUSTOMER") {
    return null;
  }

  return <MyActivityTabs />;
};

export default MyReportsNavigation;
