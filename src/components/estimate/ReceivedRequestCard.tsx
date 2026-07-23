import Image from "next/image";

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
    <article className="flex flex-col gap-8 rounded-[20px] border border-[#f2f2f2] bg-white px-6 py-6 shadow-[0_0_10px_rgba(220,220,220,0.2)] lg:px-10 lg:py-8">
      <div className="flex flex-col gap-6">
        <div className="flex min-h-8 items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <span className="bg-brand-100 text-brand-400 flex items-center gap-1 rounded-md py-1 pr-2 pl-1 text-sm font-semibold">
              <Image src="/icons/box.svg" alt="" width={20} height={20} />
              {MOVE_TYPE_LABEL[request.moveType]}
            </span>
            {request.isDesignated && (
              <span className="flex items-center gap-1 rounded-md bg-[#ffeef0] py-1 pr-2 pl-1 text-sm font-semibold text-[#ff4f64]">
                <Image src="/icons/document.svg" alt="" width={20} height={20} />
                지정 견적 요청
              </span>
            )}
          </div>
          <span className="shrink-0 text-sm text-[#808080]">
            {formatElapsedTime(request.createdAt)}
          </span>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="text-xl font-semibold text-[#302f2d]">{request.customer.name} 고객님</h2>
          <div className="h-px bg-[#f2f2f2]" />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:gap-5">
          <div className="flex items-end gap-3">
            <div>
              <p className="text-sm text-[#808080]">출발지</p>
              <p className="font-semibold text-[#111]">{request.fromRegion}</p>
            </div>
            <span className="mb-[9px] flex w-[18px] items-center" aria-hidden="true">
              <span className="h-px flex-1 bg-[#262524]" />
              <span className="-ml-1 h-1.5 w-1.5 rotate-45 border-t border-r border-[#262524]" />
            </span>
            <div>
              <p className="text-sm text-[#808080]">도착지</p>
              <p className="font-semibold text-[#111]">{request.toRegion}</p>
            </div>
          </div>
          <div>
            <p className="text-sm text-[#808080]">이사일</p>
            <p className="font-semibold whitespace-nowrap text-[#111]">
              {formatMoveDate(request.moveDate)}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:grid sm:grid-cols-2 sm:gap-3">
        <button
          className="border-brand-400 text-brand-400 order-2 h-[54px] rounded-xl border font-semibold sm:order-1"
          type="button"
        >
          반려하기
        </button>
        <button
          className="bg-brand-400 order-1 flex h-[54px] items-center justify-center gap-1 rounded-xl font-semibold text-white"
          type="button"
        >
          견적 보내기
          <Image src="/icons/write.svg" alt="" width={24} height={24} />
        </button>
      </div>
    </article>
  );
}
