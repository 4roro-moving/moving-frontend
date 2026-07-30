import Image from "next/image";

import { Text } from "@/components/common/Text";
import { getDesignatedMoverDisplayName } from "@/lib/utils/estimateFormat";
import { resolveMoverProfileImageSrc } from "@/lib/utils/moverProfileImage";
import type { MyEstimateRequestDesignatedMover } from "@/types/estimate";

interface EstimateRequestDesignatedMoversProps {
  /** API designatedMovers — moverId를 key·향후 수정 플로우용으로 유지 */
  designatedMovers: MyEstimateRequestDesignatedMover[];
}

/**
 * 보낸 견적 요청 상세 — 지정 요청 대상 기사님 목록
 * // 2026.07.30 정슬기 - [추가] 지정 견적 요청 기사님 정보 표시
 */
export default function EstimateRequestDesignatedMovers({
  designatedMovers,
}: EstimateRequestDesignatedMoversProps) {
  if (designatedMovers.length === 0) {
    return null;
  }

  return (
    <section
      className="flex w-full flex-col gap-20 md:gap-28"
      aria-label="지정 견적 요청 대상 기사님"
    >
      <div className="flex w-full flex-col gap-8">
        <Text as="p" variant="md-semibold" className="text-text-brand">
          지정 견적 요청
        </Text>
        <h2 className="text-text-primary">
          <Text as="span" variant="lg-semibold" className="md:hidden">
            요청한 기사님
          </Text>
          <Text as="span" variant="xl-semibold" className="hidden md:inline">
            요청한 기사님
          </Text>
        </h2>
      </div>

      <ul className="flex w-full flex-col gap-16">
        {designatedMovers.map((item) => {
          const displayName = getDesignatedMoverDisplayName(item.mover);
          const imageUrl = item.mover.moverProfile?.imageUrl;

          return (
            <li key={item.moverId} className="flex w-full items-center gap-12">
              <div className="bg-background-avatar rounded-12 relative size-40 shrink-0 overflow-hidden md:size-48">
                <Image
                  src={resolveMoverProfileImageSrc(imageUrl)}
                  alt={`${displayName} 프로필`}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>
              <Text
                as="span"
                variant="lg-semibold"
                className="text-text-primary min-w-0 wrap-break-word"
              >
                {displayName}
              </Text>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
