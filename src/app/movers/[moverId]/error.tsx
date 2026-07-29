"use client";

import { useEffect } from "react";

import MoversErrorPanel from "@/components/mover/MoversErrorPanel";

interface MoverDetailErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function MoverDetailError({ error, reset }: MoverDetailErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="bg-background-default flex w-full flex-1 flex-col items-center justify-center">
      <MoversErrorPanel
        title="불러오지 못했어요"
        description="기사님 상세 페이지를 표시하는 중 문제가 발생했습니다."
        actionLabel="다시 시도"
        isRetrying={false}
        onRetry={reset}
      />
    </div>
  );
}
