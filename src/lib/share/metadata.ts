import type { Metadata } from "next";

import { fetchReceivedEstimateDetail } from "@/lib/api/receivedEstimates";
import {
  buildEstimateShareLine,
  buildMoverShareTitle,
  ESTIMATE_SHARE_OG_TITLE,
  MOVER_SHARE_DESCRIPTION,
} from "@/lib/share/shareText";
import { buildSharePageMetadata } from "@/lib/share/openGraph";
import { ApiError } from "@/types/api";
import type { MoverDetailItem } from "@/types/mover";

export function buildMoverDetailMetadata(moverId: string, mover: MoverDetailItem): Metadata {
  return buildSharePageMetadata({
    title: buildMoverShareTitle(mover.nickname),
    description: MOVER_SHARE_DESCRIPTION,
    path: `/movers/${moverId}`,
    imageUrl: mover.profileImageUrl,
    imageAlt: `${mover.nickname} 기사님 프로필`,
  });
}

interface BuildEstimateOgMetadataInput {
  path: string;
  /** 기사 견적이면 닉네임/이름, 요청만이면 null */
  moverName?: string | null;
  profileImageUrl?: string | null;
  imageAlt?: string;
}

/** 카카오 견적 공유와 동일한 톤의 OG 메타 */
export function buildEstimateDetailMetadata({
  path,
  moverName,
  profileImageUrl,
  imageAlt = "이사 견적",
}: BuildEstimateOgMetadataInput): Metadata {
  return buildSharePageMetadata({
    title: ESTIMATE_SHARE_OG_TITLE,
    description: buildEstimateShareLine(moverName),
    path,
    imageUrl: profileImageUrl,
    imageAlt,
  });
}

export const FALLBACK_ESTIMATE_METADATA: Metadata = {
  title: "견적 상세",
  description: "이사 견적 상세 정보를 확인하세요.",
};

const NOT_FOUND_ESTIMATE_METADATA: Metadata = {
  title: "견적을 찾을 수 없습니다",
  description: "요청하신 견적 정보를 찾을 수 없습니다.",
};

/** 받은/대기 견적 상세 generateMetadata 공통 */
export async function generateReceivedEstimateMetadata(
  estimateId: number,
  path: string,
): Promise<Metadata> {
  try {
    const detail = await fetchReceivedEstimateDetail(estimateId);
    const moverName = detail.mover.nickname || detail.mover.name;

    return buildEstimateDetailMetadata({
      path,
      moverName,
      profileImageUrl: detail.mover.imageUrl,
      imageAlt: `${moverName} 기사님 프로필`,
    });
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return NOT_FOUND_ESTIMATE_METADATA;
    }

    return FALLBACK_ESTIMATE_METADATA;
  }
}
