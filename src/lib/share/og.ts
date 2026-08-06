import type { Metadata } from "next";

import { toAbsoluteAppUrl } from "@/lib/utils/appUrl";
import {
  DEFAULT_MOVER_PROFILE_IMAGE,
  resolveMoverProfileImageSrc,
} from "@/lib/utils/moverProfileImage";
import type { MoverDetailItem } from "@/types/mover";

/** 기사님 상세 OG description */
export const MOVER_SHARE_DESCRIPTION = "무빙에서 확인해 보세요!";

export function buildMoverShareTitle(nickname: string): string {
  return `이사를 준비하시나요? ${nickname} 기사님을 추천합니다.`;
}

interface BuildSharePageMetadataInput {
  title: string;
  description: string;
  path: string;
  imageUrl: string | null | undefined;
  imageAlt: string;
}

/**
 * OG용 이미지 URL.
 * picsum seed(리다이렉트·경로의 `@`)는 스크랩 실패하는 경우가 많아 기본 이미지로 대체.
 */
export function resolveShareOgImageUrl(profileImageUrl: string | null | undefined): string {
  const src = resolveMoverProfileImageSrc(profileImageUrl);

  if (src.startsWith("/")) {
    return toAbsoluteAppUrl(src);
  }

  try {
    const url = new URL(src);
    const { hostname } = url;
    const isPicsumHost = hostname === "picsum.photos" || hostname.endsWith(".picsum.photos");
    if (isPicsumHost) {
      return toAbsoluteAppUrl(DEFAULT_MOVER_PROFILE_IMAGE);
    }
  } catch {
    return toAbsoluteAppUrl(DEFAULT_MOVER_PROFILE_IMAGE);
  }

  return src;
}

/** title / description / OG 공통 메타 골격 */
export function buildSharePageMetadata({
  title,
  description,
  path,
  imageUrl,
  imageAlt,
}: BuildSharePageMetadataInput): Metadata {
  const url = toAbsoluteAppUrl(path);
  const image = resolveShareOgImageUrl(imageUrl);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      type: "website",
      images: [
        {
          url: image,
          alt: imageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

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
