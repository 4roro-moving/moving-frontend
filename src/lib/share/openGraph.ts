import type { Metadata } from "next";

import { toAbsoluteAppUrl } from "@/lib/utils/appUrl";
import {
  DEFAULT_MOVER_PROFILE_IMAGE,
  resolveMoverProfileImageSrc,
} from "@/lib/utils/moverProfileImage";

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
