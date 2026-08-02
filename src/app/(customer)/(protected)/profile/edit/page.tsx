import type { Metadata } from "next";

import CustomerProfileForm from "@/components/profile/CustomerProfileForm";

export const metadata: Metadata = {
  title: "프로필 수정 | 무빙",
  description: "무빙 고객 프로필 수정",
};

const CustomerProfileEditPage = () => {
  return <CustomerProfileForm mode="edit" />;
};

export default CustomerProfileEditPage;
