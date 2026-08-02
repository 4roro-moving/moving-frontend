import type { Metadata } from "next";

import CustomerProfileEditView from "@/components/profile/CustomerProfileEditView";

export const metadata: Metadata = {
  title: "프로필 수정 | 무빙",
  description: "무빙 고객 프로필 수정",
};

const CustomerProfileEditPage = () => {
  return <CustomerProfileEditView />;
};

export default CustomerProfileEditPage;
