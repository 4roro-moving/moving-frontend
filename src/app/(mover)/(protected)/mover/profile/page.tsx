import type { Metadata } from "next";

import MoverProfileCreateView from "@/components/profile/MoverProfileCreateView";

export const metadata: Metadata = {
  title: "기사 프로필 등록 | 무빙",
  description: "무빙 기사님 프로필 등록",
};

const MoverProfilePage = () => {
  return <MoverProfileCreateView />;
};

export default MoverProfilePage;
