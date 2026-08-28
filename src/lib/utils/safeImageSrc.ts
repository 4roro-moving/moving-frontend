import { isAllowedImageRemoteUrl } from "@/lib/constants/allowedImageHosts";

export const DEFAULT_PROFILE_IMAGE = "/images/profile-character.png";

const isLocalPublicPath = (src: string) =>
  src.startsWith("/") && !src.startsWith("//") && !src.includes("\\") && !src.includes("..");

export const getAllowedImageSrc = (imageUrl: string | null | undefined) => {
  const trimmed = imageUrl?.trim() ?? "";
  if (!trimmed) {
    return null;
  }

  if (isLocalPublicPath(trimmed) || isAllowedImageRemoteUrl(trimmed)) {
    return trimmed;
  }

  return null;
};
