import type { ReactNode } from "react";

import { Text } from "@/components/common/Text";
import { cn } from "@/lib/utils/cn";

interface ReviewPageFrameProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export default function ReviewPageFrame({ title, children, className }: ReviewPageFrameProps) {
  return (
    <div
      className={cn(
        "bg-background-default md:bg-background-subtle flex w-full flex-1 flex-col items-center",
        className,
      )}
    >
      {/* Figma에는 별도 페이지 제목이 없으므로 접근성용으로만 유지 */}
      <Text as="h1" variant="2xl-bold" className="sr-only">
        {title}
      </Text>

      <div className="px-margin-mobile md:px-margin-tablet mx-auto flex w-full max-w-220 flex-col pt-24 pb-64 md:pt-32 md:pb-80 xl:px-0">
        {children}
      </div>
    </div>
  );
}
