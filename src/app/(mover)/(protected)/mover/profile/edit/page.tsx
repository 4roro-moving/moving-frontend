import type { Metadata } from "next";

import MoverProfileForm from "@/components/profile/MoverProfileForm";

export const metadata: Metadata = {
  title: "기사 프로필 수정 | 무빙",
  description: "무빙 기사님 프로필 수정",
};

const MoverProfileEditPage = () => {
  return <MoverProfileForm mode="edit" />;
};

export default MoverProfileEditPage;
