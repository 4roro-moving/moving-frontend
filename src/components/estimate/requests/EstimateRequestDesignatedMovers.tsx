"use client";

import AutoTranslatedText from "@/components/common/AutoTranslatedText";

import { useTranslations } from "next-intl";

import { Text } from "@/components/common/Text";
import ProfileAvatar from "@/components/common/ProfileAvatar/ProfileAvatar";
import { getDesignatedMoverDisplayName } from "@/lib/utils/estimateFormat";
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
 * // 2026.08.11 정슬기 - [수정] 지정 기사 응답 상태 및 {t("requests.rejectionReason")} 표시
 */
export default function EstimateRequestDesignatedMovers({
  designatedMovers,
}: EstimateRequestDesignatedMoversProps) {
  const t = useTranslations("estimates");
  if (designatedMovers.length === 0) {
    return null;
  }

  return (
    <section
      className="flex w-full flex-col gap-20 md:gap-28"
      aria-label={t("requests.designatedAria")}
    >
      <div className="flex w-full flex-col gap-8">
        <Text as="p" variant="md-semibold" className="text-text-brand">
          {t("requests.designatedTitle")}
        </Text>

        <Text
          as="h2"
          variant={{ base: "lg-semibold", md: "xl-semibold" }}
          className="text-text-primary"
        >
          {t("requests.designatedResponseStatus")}
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
                <ProfileAvatar
                  imageUrl={imageUrl}
                  alt={t("received.profileAlt", { name: displayName })}
                  sizes="48px"
                  className="rounded-12 size-40 md:size-48"
                  imageClassName="object-contain"
                />

                <Text
                  as="span"
                  variant="lg-semibold"
                  className="text-text-primary min-w-0 flex-1 wrap-break-word"
                >
                  {displayName}
                </Text>

                {status === "ARRIVED" && (
                  <span className="border-border-brand bg-background-brand-muted rounded-8 shrink-0 border px-10 py-6">
                    <Text as="span" variant="sm-semibold" className="text-text-brand">
                      {t("requests.designatedEstimateArrived")}
                    </Text>
                  </span>
                )}

                {status === "REJECTED" && (
                  <span className="border-border-error rounded-8 shrink-0 border bg-red-100 px-10 py-6">
                    <Text as="span" variant="sm-semibold" className="text-text-error">
                      {t("requests.designatedRejected")}
                    </Text>
                  </span>
                )}

                {status === "WAITING" && (
                  <span className="border-border-default bg-background-muted rounded-8 shrink-0 border px-10 py-6">
                    <Text as="span" variant="sm-semibold" className="text-text-muted">
                      {t("requests.designatedPending")}
                    </Text>
                  </span>
                )}
              </div>

              {item.rejection && (
                <div className="bg-background-muted rounded-12 ml-52 px-16 py-12 md:ml-60">
                  <Text as="p" variant="sm-semibold" className="text-text-secondary">
                    {t("requests.rejectionReason")}
                  </Text>

                  <Text
                    as="p"
                    variant="md-regular"
                    className="text-text-primary mt-4 wrap-break-word"
                  >
                    <AutoTranslatedText text={item.rejection.reason} />
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
