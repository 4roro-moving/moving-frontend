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
}

// 2026.07.25 정슬기 - [추가] Figma sub-header — Desktop 8060:42353 / Tablet·Mobile 변형
export default function PendingEstimateRequestHeader({
  request,
}: PendingEstimateRequestHeaderProps) {
  return (
    <section
      className="bg-background-default shadow-sub-header flex w-full flex-col"
      aria-label="견적 요청 요약"
    >
      <div className="px-margin-mobile md:px-margin-tablet lg:px-sub-header-padding-left-desktop lg:pr-sub-header-padding-right-desktop py-24 md:flex md:min-h-202 md:flex-col md:justify-center md:py-0 lg:flex lg:min-h-124 lg:items-center lg:py-0">
        <div className="max-w-container-pending-mobile md:max-w-container-pending-tablet lg:max-w-container-pending-desktop mx-auto flex w-full flex-col gap-20 md:gap-28 lg:flex-row lg:items-center lg:gap-20">
          <div className="flex min-w-0 flex-1 flex-col md:gap-4">
            {/* Mobile: xl/bold 20 · Tablet/Desktop: 2xl/bold 24 */}
            <Text as="h2" variant="xl-bold" className="text-text-primary md:hidden">
              {getMoveTypeLabel(request.moveType)}
            </Text>
            <Text as="h2" variant="2xl-bold" className="text-text-primary hidden md:block">
              {getMoveTypeLabel(request.moveType)}
            </Text>
            {/* Mobile: xs/regular · Tablet/Desktop: md/regular */}
            <Text as="p" variant="xs-regular" className="text-text-muted md:hidden">
              견적 신청일: {formatKoreanDateLong(request.createdAt)}
            </Text>
            <Text as="p" variant="md-regular" className="text-text-muted hidden md:block">
              견적 신청일: {formatKoreanDateLong(request.createdAt)}
            </Text>
          </div>

          {/* Mobile: 라벨-값 세로 스택 (Figma Mobile sub-header) */}
          <div className="flex w-full flex-col gap-4 md:hidden">
            <div className="flex w-full items-center justify-between gap-12">
              <Text as="p" variant="md-regular" className="text-text-muted">
                출발지
              </Text>
              <Text as="p" variant="md-semibold" className="text-text-primary">
                {request.fromAddress}
              </Text>
            </div>
            <div className="flex w-full items-center justify-between gap-12">
              <Text as="p" variant="md-regular" className="text-text-muted">
                도착지
              </Text>
              <Text as="p" variant="md-semibold" className="text-text-primary">
                {request.toAddress}
              </Text>
            </div>
            <div className="flex w-full items-center justify-between gap-12">
              <Text as="p" variant="md-regular" className="text-text-muted">
                이사일
              </Text>
              <Text as="p" variant="md-semibold" className="text-text-primary">
                {formatMoveDateLabel(request.moveDate)}
              </Text>
            </div>
          </div>

          {/* Tablet/Desktop: 출발-화살표-도착 · 이사일 (Figma gap-40 / gap-12) */}
          <div className="hidden shrink-0 items-start gap-40 md:flex md:w-full lg:w-auto">
            <div className="flex items-end gap-12">
              <div className="flex flex-col items-start">
                <Text as="p" variant="md-regular" className="text-text-muted">
                  출발지
                </Text>
                <Text as="p" variant="2lg-semibold" className="text-text-primary">
                  {request.fromAddress}
                </Text>
              </div>

              <span className="inline-flex h-23 items-center" aria-hidden="true">
                <ChevronRightThinIcon className="text-text-secondary size-16 shrink-0" />
              </span>

              <div className="flex flex-col items-start justify-center">
                <Text as="p" variant="md-regular" className="text-text-muted">
                  도착지
                </Text>
                <Text as="p" variant="2lg-semibold" className="text-text-primary">
                  {request.toAddress}
                </Text>
              </div>
            </div>

            <div className="flex flex-col items-start justify-center">
              <Text as="p" variant="md-regular" className="text-text-muted">
                이사일
              </Text>
              <Text as="p" variant="2lg-semibold" className="text-text-primary">
                {formatMoveDateLabel(request.moveDate)}
              </Text>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
