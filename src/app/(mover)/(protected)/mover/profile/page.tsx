import type { Metadata } from "next";

import MoverProfileForm from "@/components/profile/MoverProfileForm";

export const metadata: Metadata = {
  title: "기사 프로필 등록 | 무빙",
  description: "무빙 기사님 프로필 등록",
};

const MoverProfilePage = () => {
  return <MoverProfileForm mode="create" />;
};

export default MoverProfilePage;
