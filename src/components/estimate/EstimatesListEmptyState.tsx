import type { ReactNode } from "react";

import EmptyState from "@/components/common/EmptyState/EmptyState";
import { cn } from "@/lib/utils/cn";

interface EstimatesListEmptyStateProps {
  description: ReactNode;
  buttonLabel?: string;
  href?: string;
  alignWithFilter?: boolean;
}

/**
 * 내 견적 관리 탭 목록 전체 Empty 공통 래퍼
 * — 동일 size·이미지·가로 여백 유지
 * — alignWithFilter 사용 시 보낸 견적 요청의 필터 영역 높이만큼
 *   실제 여백을 확보해 빈 상태의 세로 위치를 맞춤
 */
export default function EstimatesListEmptyState({
  description,
  buttonLabel,
  href,
  alignWithFilter = false,
}: EstimatesListEmptyStateProps) {
  return (
    <div
      className={cn(
        "px-margin-mobile mx-auto flex min-h-[60vh] w-full max-w-(--container-desktop) flex-col items-center justify-start md:min-h-[70vh] md:px-72 xl:px-0",
        alignWithFilter && "pt-[96px] md:pt-[104px] xl:pt-[112px]",
      )}
    >
      <EmptyState
        size="sm"
        imageSrc="/images/empty/character.png"
        description={description}
        buttonLabel={buttonLabel}
        href={href}
        className="py-0"
      />
    </div>
  );
}
