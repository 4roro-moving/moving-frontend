import type { Metadata } from "next";

import { buildMoverShareTitle, MOVER_SHARE_DESCRIPTION } from "@/lib/share/shareText";
import { buildSharePageMetadata } from "@/lib/share/openGraph";
import type { MoverDetailItem } from "@/types/mover";

const MOVER_DETAIL_FALLBACK_TITLE = "기사님 상세";
const MOVER_DETAIL_FALLBACK_DESCRIPTION = "이사 기사님 상세 정보를 확인하세요.";
const MOVER_NOT_FOUND_TITLE = "기사님을 찾을 수 없습니다";
const MOVER_NOT_FOUND_DESCRIPTION = "요청하신 기사님 정보를 찾을 수 없습니다.";

export function buildMoverDetailMetadata(moverId: string, mover: MoverDetailItem): Metadata {
  return buildSharePageMetadata({
    title: buildMoverShareTitle(mover.nickname),
    description: MOVER_SHARE_DESCRIPTION,
    path: `/movers/${moverId}`,
    imageUrl: mover.profileImageUrl,
    imageAlt: `${mover.nickname} 기사님 프로필`,
  });
}

/** API 실패·잘못된 ID 등 — title/description만 두지 않고 og:image 포함 */
export function buildMoverDetailFallbackMetadata(moverId?: string): Metadata {
  return buildSharePageMetadata({
    title: MOVER_DETAIL_FALLBACK_TITLE,
    description: MOVER_DETAIL_FALLBACK_DESCRIPTION,
    path: moverId ? `/movers/${moverId}` : "/movers",
    imageUrl: null,
    imageAlt: "무빙 기사님",
  });
}

export function buildMoverNotFoundMetadata(): Metadata {
  return buildSharePageMetadata({
    title: MOVER_NOT_FOUND_TITLE,
    description: MOVER_NOT_FOUND_DESCRIPTION,
    path: "/movers",
    imageUrl: null,
    imageAlt: "무빙",
  });
}
