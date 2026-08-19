import { isAllowedImageRemoteUrl } from "@/lib/constants/allowedImageHosts";
import type { PublicResidenceReview, ResidenceReviewRegion } from "@/types/residenceReview";

const isLocalPublicPath = (src: string) =>
  src.startsWith("/") && !src.startsWith("//") && !src.includes("\\") && !src.includes("..");

export const getResidenceReviewAuthorImageSrc = (imageUrl: string | null | undefined) => {
  const trimmed = imageUrl?.trim() ?? "";
  if (!trimmed) {
    return null;
  }

  if (isLocalPublicPath(trimmed) || isAllowedImageRemoteUrl(trimmed)) {
    return trimmed;
  }

  return null;
};

export const formatResidenceReviewAuthorName = (name: string) => {
  const trimmed = name.trim();
  return trimmed || "고객";
};

export const formatResidenceReviewRegionLabel = (region: ResidenceReviewRegion) => {
  if (region.averageRating > 0) {
    return `${region.name} (평균 ${region.averageRating.toFixed(1)})`;
  }
  return `${region.name} 거주`;
};

export const formatResidenceReviewRating = (rating: number) => rating.toFixed(1);

export const formatResidenceReviewWrittenDate = (iso: string) => {
  const parsed = new Date(iso);

  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  const parts = new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "Asia/Seoul",
  }).formatToParts(parsed);

  const getPart = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";

  return `${getPart("year")}. ${getPart("month")}. ${getPart("day")}`;
};

export const isResidenceReviewOwner = (
  review: PublicResidenceReview,
  userId: string | null | undefined,
) => review.isMine || (userId !== undefined && userId !== null && review.author.id === userId);
