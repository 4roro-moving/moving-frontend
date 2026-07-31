import type { Metadata } from "next";

import { Text } from "@/components/common/Text";

export const metadata: Metadata = {
  title: "프로필 등록 | 무빙",
  description: "무빙 고객 프로필 등록",
};

const CustomerProfilePage = () => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-24 py-80">
      <Text as="h1" variant="2lg-bold" className="text-text-primary">
        고객 프로필 등록
      </Text>
      <Text as="p" variant="md-medium" className="text-text-description mt-12">
        프로필 등록 UI는 추후 연결됩니다.
      </Text>
    </div>
  );
};

export default CustomerProfilePage;
