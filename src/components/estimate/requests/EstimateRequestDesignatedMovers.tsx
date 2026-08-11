"use client";

import Image from "next/image";

import { Text } from "@/components/common/Text";
import { getDesignatedMoverDisplayName } from "@/lib/utils/estimateFormat";
import { resolveMoverProfileImageSrc } from "@/lib/utils/moverProfileImage";
import type { MyEstimateRequestDesignatedMover } from "@/types/estimate";

interface EstimateRequestDesignatedMoversProps {
  /** API designatedMovers — moverId를 list key로 사용 */
  designatedMovers: MyEstimateRequestDesignatedMover[];
}

/**
 * 보낸 견적 요청 상세 — 지정 요청 대상 기사님 응답 현황
 * 개별 지정 취소는 견적 요청 취소 허브 모달에서 처리한다.
 * // 2026.07.30 정슬기 - [추가] 지정 견적 요청 기사님 정보 표시
 * // 2026.08.07 정슬기 - [수정] 지정 취소는 취소 허브 모달로 이동
 * // 2026.08.11 정슬기 - [수정] 지정 기사 응답 상태 및 반려 사유 표시
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
      aria-label="지정 견적 요청 기사님 응답 현황"
    >
      <div className="flex w-full flex-col gap-8">
        <Text as="p" variant="md-semibold" className="text-text-brand">
          지정 견적 요청
        </Text>

        <Text
          as="h2"
          variant={{ base: "lg-semibold", md: "xl-semibold" }}
          className="text-text-primary"
        >
          기사님 응답 현황
        </Text>
      </div>

      <ul className="flex w-full flex-col gap-16">
        {designatedMovers.map((item) => {
          const displayName = getDesignatedMoverDisplayName(item.mover);
          const imageUrl = item.mover.moverProfile?.imageUrl;

          const status = item.rejection ? "REJECTED" : item.hasEstimate ? "ARRIVED" : "WAITING";

          return (
            <li key={item.moverId} className="flex w-full flex-col gap-8">
              <div className="flex w-full items-center gap-12">
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
                  className="text-text-primary min-w-0 flex-1 wrap-break-word"
                >
                  {displayName}
                </Text>

                {status === "ARRIVED" && (
                  <span className="border-border-brand bg-background-brand-subtle rounded-8 shrink-0 border px-10 py-6">
                    <Text as="span" variant="sm-semibold" className="text-text-brand">
                      견적 도착
                    </Text>
                  </span>
                )}

                {status === "REJECTED" && (
                  <span className="border-border-error rounded-8 shrink-0 border bg-red-100 px-10 py-6">
                    <Text as="span" variant="sm-semibold" className="text-status-error">
                      반려
                    </Text>
                  </span>
                )}

                {status === "WAITING" && (
                  <span className="border-border-default bg-background-secondary rounded-8 shrink-0 border px-10 py-6">
                    <Text as="span" variant="sm-semibold" className="text-text-secondary">
                      응답 대기
                    </Text>
                  </span>
                )}
              </div>

              {item.rejection && (
                <div className="bg-background-secondary rounded-12 ml-52 px-16 py-12 md:ml-60">
                  <Text as="p" variant="sm-semibold" className="text-text-secondary">
                    반려 사유
                  </Text>

                  <Text
                    as="p"
                    variant="md-regular"
                    className="text-text-primary mt-4 wrap-break-word"
                  >
                    {item.rejection.reason}
                  </Text>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
