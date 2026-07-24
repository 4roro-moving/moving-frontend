"use client";

import { useState } from "react";

import { Text } from "@/components/common/Text";
import Toast from "@/components/common/Toast/Toast";
import { ClipIcon } from "@/icons";
import { cn } from "@/lib/utils/cn";

function KakaoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path
        d="M14 4C8.477 4 4 7.582 4 12.001c0 2.85 1.86 5.35 4.66 6.79-.15.55-.54 1.99-.62 2.3-.09.36.13.35.28.26.12-.08 1.97-1.34 2.77-1.88.94.14 1.92.21 2.91.21 5.523 0 10-3.582 10-8.001C24 7.582 19.523 4 14 4Z"
        fill="currentColor"
      />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path
        d="M16.5 25V15.5h3.2l.5-3.7H16.5V9.4c0-1.07.3-1.8 1.84-1.8H20.3V4.3C19.8 4.2 18.5 4 16.9 4c-3.3 0-5.55 2.01-5.55 5.7v3.1H8.2v3.7h3.15V25h5.15Z"
        fill="currentColor"
      />
    </svg>
  );
}

// 2026.07.24 정슬기 - [수정] 비동작 공유 버튼 CodeRabbit 이슈 대응 (링크 복사 동작, SNS는 준비 중 표시)
export default function EstimateDetailShare() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setToastMessage("견적 링크가 복사되었습니다.");
    } catch {
      setToastMessage("링크 복사에 실패했습니다.");
    }
  };

  return (
    <section className="flex w-full flex-col gap-12 md:gap-22" aria-label="견적서 공유하기">
      <Text
        as="h2"
        variant="lg-semibold"
        className="text-text-secondary md:text-[length:var(--font-size-20)] md:leading-[var(--line-height-32)]"
      >
        견적서 공유하기
      </Text>

      <div className="flex items-start gap-10 md:gap-16">
        <button
          type="button"
          aria-label="링크 복사"
          onClick={() => {
            void handleCopyLink();
          }}
          className="bg-background-surface border-border-default focus-visible:ring-border-brand rounded-8 md:rounded-16 flex size-40 shrink-0 items-center justify-center border p-10 focus-visible:ring-2 focus-visible:outline-none md:size-64"
        >
          <ClipIcon className="size-24 md:size-36" aria-hidden="true" />
        </button>

        <button
          type="button"
          aria-label="카카오톡 공유 (준비 중)"
          aria-disabled="true"
          disabled
          title="준비 중"
          className={cn(
            "bg-social-kakao-background text-social-kakao-icon rounded-8 md:rounded-16 flex size-40 shrink-0 items-center justify-center p-8 md:size-64 md:p-14",
            "cursor-not-allowed opacity-60",
          )}
        >
          <KakaoIcon className="size-24 md:size-28" />
        </button>

        <button
          type="button"
          aria-label="페이스북 공유 (준비 중)"
          aria-disabled="true"
          disabled
          title="준비 중"
          className={cn(
            "bg-social-facebook-background text-social-facebook-icon rounded-8 md:rounded-16 flex size-40 shrink-0 items-center justify-center p-8 md:size-64 md:p-14",
            "cursor-not-allowed opacity-60",
          )}
        >
          <FacebookIcon className="size-24 md:size-28" />
        </button>
      </div>

      {toastMessage ? <Toast onClose={() => setToastMessage(null)}>{toastMessage}</Toast> : null}
    </section>
  );
}
