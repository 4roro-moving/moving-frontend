import type { Metadata } from "next";

import CustomerProfileCreateView from "@/components/profile/CustomerProfileCreateView";

export const metadata: Metadata = {
  title: "프로필 등록 | 무빙",
  description: "무빙 고객 프로필 등록",
};

const CustomerProfilePage = () => {
  return <CustomerProfileCreateView />;
};

export default CustomerProfilePage;
