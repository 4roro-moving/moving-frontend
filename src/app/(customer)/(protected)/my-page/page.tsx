import type { Metadata } from "next";

import MyResidenceReviewPageView from "@/components/residence-review/MyResidenceReviewPageView";

export const metadata: Metadata = {
  title: "마이페이지",
  description: "내가 작성한 글들을 확인하고 수정할 수 있습니다.",
};

const MyPage = () => {
  return <MyResidenceReviewPageView />;
};

export default MyPage;
