import { isAllowedImageRemoteUrl } from "@/lib/constants/allowedImageHosts";

const isLocalPublicPath = (src: string) =>
  src.startsWith("/") && !src.startsWith("//") && !src.includes("\\") && !src.includes("..");

export const getGiveawaySafeImageSrc = (imageUrl: string | null | undefined) => {
  const trimmed = imageUrl?.trim() ?? "";
  if (!trimmed) {
    return null;
  }

  if (isLocalPublicPath(trimmed) || isAllowedImageRemoteUrl(trimmed)) {
    return trimmed;
  }

  return null;
};

export const getGiveawayProfileImageSrc = getGiveawaySafeImageSrc;
