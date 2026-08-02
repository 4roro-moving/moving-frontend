import type { Metadata } from "next";

import CustomerProfileForm from "@/components/profile/CustomerProfileForm";

export const metadata: Metadata = {
  title: "프로필 등록 | 무빙",
  description: "무빙 고객 프로필 등록",
};

const CustomerProfilePage = () => {
  return <CustomerProfileForm mode="create" />;
};

export default CustomerProfilePage;
