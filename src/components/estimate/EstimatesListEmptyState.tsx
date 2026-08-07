import type { ReactNode } from "react";

import EmptyState from "@/components/common/EmptyState/EmptyState";

interface EstimatesListEmptyStateProps {
  description: ReactNode;
  buttonLabel?: string;
  href?: string;
}

/**
 * 내 견적 관리 탭(대기/받았던/보낸 요청) 목록 전체 Empty 공통 래퍼
 * — 동일 size·이미지·가로 여백·탭 아래 세로 시작 위치
 * — 버튼은 선택(보낸 견적 요청만). justify-start로 이미지·문구 시작 Y를 맞춤
 * // 2026.07.29 정슬기 - [추가]
 */
export default function EstimatesListEmptyState({
  description,
  buttonLabel,
  href,
}: EstimatesListEmptyStateProps) {
  return (
    <div className="px-margin-mobile mx-auto flex min-h-[60vh] w-full max-w-(--container-desktop) flex-col items-center justify-start md:min-h-[70vh] md:px-72 xl:px-0">
      <EmptyState
        size="sm"
        imageSrc="/images/empty/character.png"
        description={description}
        buttonLabel={buttonLabel}
        href={href}
        // wrapper가 탭 아래 세로 여백을 담당 — EmptyState 내부 py 중복 제거
        className="py-0"
      />
    </div>
  );
}
