import type { Metadata } from "next";

import MoverMyPageView from "@/components/mover/mypage/MoverMyPageView";

export const metadata: Metadata = {
  title: "기사님 마이페이지 | 무빙",
  description: "무빙 기사님 마이페이지",
};

const MoverMyPagePage = () => {
  return <MoverMyPageView />;
};

export default MoverMyPagePage;
