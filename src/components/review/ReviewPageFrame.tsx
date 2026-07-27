import type { ReactNode } from "react";

import { Text } from "@/components/common/Text";
import { cn } from "@/lib/utils/cn";

interface ReviewPageFrameProps {
  title: string;
  children: ReactNode;
  className?: string;
}

/**
 * 리뷰 목록 페이지 공통 프레임 (제목 + 콘텐츠 폭/여백)
 * // 2026.07.27 정슬기 - [추가] Mobile/Tablet/Desktop 여백·타이포 통일
 */
export default function ReviewPageFrame({ title, children, className }: ReviewPageFrameProps) {
  return (
    <div
      className={cn(
        "bg-background-default md:bg-background-subtle flex w-full flex-col items-center",
        className,
      )}
    >
      <div className="px-margin-mobile md:px-margin-tablet max-w-container-desktop mx-auto flex w-full flex-col pt-24 pb-16 md:pt-40 md:pb-24 lg:px-0 lg:pt-48">
        <Text as="h1" variant={{ base: "2xl-bold", md: "3xl-bold" }} className="text-text-primary">
          {title}
        </Text>
      </div>

      <div className="px-margin-mobile md:px-margin-tablet max-w-container-desktop mx-auto flex w-full flex-col pb-64 md:pb-80 lg:px-0">
        {children}
      </div>
    </div>
  );
}
