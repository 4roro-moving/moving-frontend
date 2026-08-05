import { requestProfileImageUploadUrl, uploadFileToPresignedUrl } from "@/lib/api/profileImage";
import { ApiError } from "@/types/api";
import { PROFILE_IMAGE_CONTENT_TYPES, type ProfileImageContentType } from "@/types/profile";

/**
 * S3 배포 전이면 false.
 * true로 바꾸면 presigned 발급 → PUT → public imageUrl 생성을 실행합니다.
 */
export const IS_PROFILE_IMAGE_UPLOAD_ENABLED = false;

const isProfileImageContentType = (value: string): value is ProfileImageContentType => {
  return (PROFILE_IMAGE_CONTENT_TYPES as readonly string[]).includes(value);
};

export const buildProfileImagePublicUrl = (key: string): string => {
  const baseUrl = process.env.NEXT_PUBLIC_PROFILE_IMAGE_BASE_URL?.replace(/\/$/, "");

  if (!baseUrl) {
    throw new ApiError("프로필 이미지 공개 URL 설정이 없습니다.");
  }

  return `${baseUrl}/${key}`;
};

/**
 * 이미지 파일이 있으면:
 * - flag ON  → presigned 발급 → S3 PUT → public imageUrl
 * - flag OFF → undefined (이미지 없이 프로필 저장, UI 미리보기만 유지)
 */
export const uploadProfileImageIfNeeded = async (
  imageFile: File | null | undefined,
): Promise<string | undefined> => {
  if (!imageFile) {
    return undefined;
  }

  if (!IS_PROFILE_IMAGE_UPLOAD_ENABLED) {
    // 임시: S3 미배포 — 업로드 스킵
    return undefined;
  }

  // --- S3 준비 후 IS_PROFILE_IMAGE_UPLOAD_ENABLED = true 로 활성화 ---
  if (!isProfileImageContentType(imageFile.type)) {
    throw new ApiError("지원하지 않는 이미지 형식입니다.");
  }

  const uploadResult = await requestProfileImageUploadUrl({
    contentType: imageFile.type,
    size: imageFile.size,
  });

  await uploadFileToPresignedUrl(uploadResult.uploadUrl, imageFile);

  return buildProfileImagePublicUrl(uploadResult.key);
};
