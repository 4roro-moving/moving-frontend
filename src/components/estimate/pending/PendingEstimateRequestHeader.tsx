import { Text } from "@/components/common/Text";
import { ChevronRightThinIcon } from "@/icons";
import {
  formatKoreanDateLong,
  formatMoveDateLabel,
  getMoveTypeLabel,
} from "@/lib/utils/estimateFormat";
import type { MyEstimateRequestItem } from "@/types/estimate";

interface PendingEstimateRequestHeaderProps {
  request: MyEstimateRequestItem;
  /** 바깥 section과 aria-labelledby로 연결할 제목 id */
  titleId: string;
}

// 2026.07.25 정슬기 - [추가] Figma sub-header — Desktop 8060:42353 / Tablet·Mobile 변형
// 2026.07.27 정슬기 - [수정] header/dl 시맨틱 + 단일 h2(반응형 class)로 titleId 연결
export default function PendingEstimateRequestHeader({
  request,
  titleId,
}: PendingEstimateRequestHeaderProps) {
  return (
    <header className="bg-background-default shadow-sub-header flex w-full flex-col">
      <div className="px-margin-mobile md:px-margin-tablet xl:px-sub-header-padding-left-desktop xl:pr-sub-header-padding-right-desktop py-24 md:flex md:min-h-202 md:flex-col md:justify-center md:py-0 xl:flex xl:min-h-124 xl:items-center xl:py-0">
        <div className="max-w-container-pending-mobile md:max-w-container-pending-tablet xl:max-w-container-pending-desktop mx-auto flex w-full flex-col gap-20 md:gap-28 xl:flex-row xl:items-center xl:gap-20">
          <div className="flex min-w-0 flex-1 flex-col md:gap-4">
            {/* Mobile xl/bold · Tablet/Desktop 2xl/bold — 단일 h2로 aria-labelledby 연결 */}
            <Text
              as="h2"
              id={titleId}
              variant="xl-bold"
              className="text-text-primary md:text-[length:var(--font-size-24)] md:leading-[var(--line-height-32)]"
            >
              {getMoveTypeLabel(request.moveType)}
            </Text>
            <Text
              as="p"
              variant="xs-regular"
              className="text-text-muted md:text-[length:var(--font-size-14)] md:leading-[var(--line-height-24)]"
            >
              견적 신청일: {formatKoreanDateLong(request.createdAt)}
            </Text>
          </div>

          {/* Mobile: 라벨-값 세로 스택 */}
          <dl className="flex w-full flex-col gap-4 md:hidden">
            <div className="flex w-full items-center justify-between gap-12">
              <Text as="dt" variant="md-regular" className="text-text-muted">
                출발지
              </Text>
              <Text as="dd" variant="md-semibold" className="text-text-primary m-0">
                {request.fromAddress}
              </Text>
            </div>
            <div className="flex w-full items-center justify-between gap-12">
              <Text as="dt" variant="md-regular" className="text-text-muted">
                도착지
              </Text>
              <Text as="dd" variant="md-semibold" className="text-text-primary m-0">
                {request.toAddress}
              </Text>
            </div>
            <div className="flex w-full items-center justify-between gap-12">
              <Text as="dt" variant="md-regular" className="text-text-muted">
                이사일
              </Text>
              <Text as="dd" variant="md-semibold" className="text-text-primary m-0">
                {formatMoveDateLabel(request.moveDate)}
              </Text>
            </div>
          </dl>

          {/* Tablet/Desktop: 출발-화살표-도착 · 이사일 */}
          <dl className="hidden shrink-0 items-start gap-40 md:flex md:w-full xl:w-auto">
            <div className="flex items-end gap-12">
              <div className="flex flex-col items-start">
                <Text as="dt" variant="md-regular" className="text-text-muted">
                  출발지
                </Text>
                <Text as="dd" variant="2lg-semibold" className="text-text-primary m-0">
                  {request.fromAddress}
                </Text>
              </div>

              <span className="inline-flex h-23 items-center" aria-hidden="true">
                <ChevronRightThinIcon className="text-text-secondary size-16 shrink-0" />
              </span>

              <div className="flex flex-col items-start justify-center">
                <Text as="dt" variant="md-regular" className="text-text-muted">
                  도착지
                </Text>
                <Text as="dd" variant="2lg-semibold" className="text-text-primary m-0">
                  {request.toAddress}
                </Text>
              </div>
            </div>

            <div className="flex flex-col items-start justify-center">
              <Text as="dt" variant="md-regular" className="text-text-muted">
                이사일
              </Text>
              <Text as="dd" variant="2lg-semibold" className="text-text-primary m-0">
                {formatMoveDateLabel(request.moveDate)}
              </Text>
            </div>
          </dl>
        </div>
      </div>
    </header>
  );
}
