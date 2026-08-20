import type { Metadata } from "next";

import MyResidenceReviewPageView from "@/components/residence-review/MyResidenceReviewPageView";

export const metadata: Metadata = {
  title: "내 활동 내역",
  description: "내가 작성한 글들을 확인하고 수정할 수 있습니다.",
};

const MyActivityPage = () => {
  return <MyResidenceReviewPageView />;
};

export default MyActivityPage;
