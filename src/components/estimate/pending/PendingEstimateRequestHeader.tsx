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
  titleId: string;
}

export default function PendingEstimateRequestHeader({
  request,
  titleId,
}: PendingEstimateRequestHeaderProps) {
  return (
    <header className="bg-background-default shadow-sub-header flex w-full flex-col">
      <div className="px-margin-mobile md:px-margin-tablet xl:px-sub-header-padding-left-desktop xl:pr-sub-header-padding-right-desktop py-24 md:flex md:min-h-202 md:flex-col md:justify-center md:py-0 xl:flex xl:min-h-124 xl:items-center xl:py-0">
        <div className="max-w-container-pending-mobile md:max-w-container-pending-tablet xl:max-w-container-pending-desktop mx-auto flex w-full flex-col gap-20 md:gap-28 xl:flex-row xl:items-center xl:gap-20">
          <div className="flex min-w-0 flex-1 flex-col md:gap-4 xl:min-w-55 xl:flex-none">
            <Text
              as="h2"
              id={titleId}
              variant={{ base: "xl-bold", md: "2xl-bold" }}
              className="text-text-primary"
            >
              {getMoveTypeLabel(request.moveType)}
            </Text>
            <Text
              as="p"
              variant={{ base: "xs-regular", md: "md-regular" }}
              className="text-text-muted"
            >
              견적 요청일 {formatKoreanDateLong(request.createdAt)}
            </Text>
          </div>

          <dl className="flex w-full flex-col gap-4 md:hidden">
            <div className="flex w-full items-center justify-between gap-12">
              <Text as="dt" variant="md-regular" className="text-text-muted">
                출발지
              </Text>
              <Text
                as="dd"
                variant="md-semibold"
                className="text-text-primary m-0 min-w-0 flex-1 text-right wrap-break-word"
              >
                {request.fromAddress}
              </Text>
            </div>
            <div className="flex w-full items-center justify-between gap-12">
              <Text as="dt" variant="md-regular" className="text-text-muted">
                도착지
              </Text>
              <Text
                as="dd"
                variant="md-semibold"
                className="text-text-primary m-0 min-w-0 flex-1 text-right wrap-break-word"
              >
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

          <dl className="hidden min-w-0 items-start gap-40 md:flex md:w-full xl:flex-1 xl:justify-between">
            <div className="flex min-w-0 items-end gap-12">
              <div className="flex min-w-0 flex-col items-start">
                <Text as="dt" variant="md-regular" className="text-text-muted">
                  출발지
                </Text>
                <Text
                  as="dd"
                  variant="2lg-semibold"
                  className="text-text-primary m-0 min-w-0 wrap-break-word"
                >
                  {request.fromAddress}
                </Text>
              </div>

              <span className="inline-flex h-23 items-center" aria-hidden="true">
                <ChevronRightThinIcon className="text-text-secondary size-16 shrink-0" />
              </span>

              <div className="flex min-w-0 flex-col items-start justify-center">
                <Text as="dt" variant="md-regular" className="text-text-muted">
                  도착지
                </Text>
                <Text
                  as="dd"
                  variant="2lg-semibold"
                  className="text-text-primary m-0 min-w-0 wrap-break-word"
                >
                  {request.toAddress}
                </Text>
              </div>
            </div>

            <div className="flex shrink-0 flex-col items-start justify-center xl:min-w-160">
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
