import Image from "next/image";

import { Text } from "@/components/common/Text";
import type { MoveType, MoverEstimateRequest } from "@/types/moverEstimateRequest";

const MOVE_TYPE_LABEL: Record<MoveType, string> = {
  SMALL: "소형이사",
  HOME: "가정이사",
  OFFICE: "사무실이사",
};

function formatMoveDate(date: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
  }).format(new Date(date));
}

function formatElapsedTime(date: string) {
  const minutes = Math.max(1, Math.floor((Date.now() - new Date(date).getTime()) / 60000));
  if (minutes < 60) return `${minutes}분 전`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;
  return `${Math.floor(hours / 24)}일 전`;
}

export default function ReceivedRequestCard({ request }: { request: MoverEstimateRequest }) {
  return (
    <article className="flex flex-col gap-24 rounded-[20px] border border-[#f2f2f2] bg-white px-20 py-24 shadow-[0_0_10px_rgba(220,220,220,0.2)] min-[744px]:gap-32 min-[744px]:px-40 min-[744px]:py-32 lg:px-40 lg:py-32">
      <div className="flex flex-col gap-16 min-[744px]:gap-24">
        <div className="flex min-h-32 items-center justify-between gap-12">
          <div className="flex flex-wrap gap-8">
            <span className="bg-background-brand-muted text-text-brand flex items-center gap-4 rounded-md py-4 pr-8 pl-4 text-sm font-semibold">
              <Image src="/icons/box.svg" alt="" width={20} height={20} />
              {MOVE_TYPE_LABEL[request.moveType]}
            </span>
            {request.isDesignated && (
              <span className="flex items-center gap-4 rounded-md bg-[#ffeef0] py-4 pr-8 pl-4 text-sm font-semibold text-[#ff4f64]">
                <Image src="/icons/document.svg" alt="" width={20} height={20} />
                지정 견적 요청
              </span>
            )}
          </div>
          <span className="shrink-0 text-sm text-[#808080]">
            {formatElapsedTime(request.createdAt)}
          </span>
        </div>

        <div className="flex flex-col gap-12">
          <Text as="h2" variant="xl-semibold" className="text-[#302f2d]">
            {request.customer.name} 고객님
          </Text>
          <div className="h-px bg-[#f2f2f2]" />
        </div>

        <div className="flex flex-col gap-12 sm:flex-row sm:justify-between sm:gap-20">
          <div className="flex items-end gap-12">
            <div>
              <Text as="p" variant="md-regular" className="text-[#808080]">
                출발지
              </Text>
              <p className="font-semibold text-[#111]">{request.fromRegion}</p>
            </div>
            <span className="mb-[9px] flex w-[18px] items-center" aria-hidden="true">
              <span className="h-px flex-1 bg-[#262524]" />
              <span className="-ml-1 h-1.5 w-1.5 rotate-45 border-t border-r border-[#262524]" />
            </span>
            <div>
              <Text as="p" variant="md-regular" className="text-[#808080]">
                도착지
              </Text>
              <p className="font-semibold text-[#111]">{request.toRegion}</p>
            </div>
          </div>
          <div>
            <Text as="p" variant="md-regular" className="text-[#808080]">
              이사일
            </Text>
            <p className="font-semibold whitespace-nowrap text-[#111]">
              {formatMoveDate(request.moveDate)}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-[11px] sm:grid sm:grid-cols-2 sm:gap-[11px]">
        <button
          className="border-border-brand text-text-brand order-2 h-[54px] rounded-xl border font-semibold sm:order-1"
          type="button"
        >
          반려하기
        </button>
        <button
          className="bg-background-brand order-1 flex h-[54px] items-center justify-center gap-4 rounded-xl font-semibold text-white"
          type="button"
        >
          견적 보내기
          <Image src="/icons/write.svg" alt="" width={24} height={24} />
        </button>
      </div>
    </article>
  );
}
