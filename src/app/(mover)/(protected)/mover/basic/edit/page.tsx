import type { Metadata } from "next";

import MoverBasicInfoEditView from "@/components/profile/MoverBasicInfoEditView";

export const metadata: Metadata = {
  title: "기본정보 수정 | 무빙",
  description: "무빙 기사님 기본정보 수정",
};

const MoverBasicInfoEditPage = () => {
  return <MoverBasicInfoEditView />;
};

export default MoverBasicInfoEditPage;
