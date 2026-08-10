import { requestProfileImageUploadUrl, uploadFileToPresignedUrl } from "@/lib/api/profileImage";
import { ApiError } from "@/types/api";
import {
  PROFILE_IMAGE_CONTENT_TYPES,
  PROFILE_IMAGE_MAX_SIZE,
  type ProfileImageContentType,
} from "@/types/profile";

const isProfileImageContentType = (value: string): value is ProfileImageContentType => {
  return (PROFILE_IMAGE_CONTENT_TYPES as readonly string[]).includes(value);
};

const isProfileImageSize = (size: number): boolean => {
  return size <= PROFILE_IMAGE_MAX_SIZE;
};

/**
 * Presigned URL로 S3에 업로드한 뒤, 프로필 API에 넣을 S3 key를 반환합니다.
 * Header 표시용 URL은 프로필 저장 응답의 imageUrl을 사용합니다.
 */
export const uploadProfileImage = async (
  imageFile: File | null | undefined,
): Promise<string | undefined> => {
  if (!imageFile) {
    return undefined;
  }

  if (!isProfileImageContentType(imageFile.type)) {
    throw new ApiError("지원하지 않는 이미지 형식입니다.");
  }

  if (!isProfileImageSize(imageFile.size)) {
    throw new ApiError("이미지 크기가 너무 큽니다.");
  }

  const uploadResult = await requestProfileImageUploadUrl({
    contentType: imageFile.type,
    size: imageFile.size,
  });

  await uploadFileToPresignedUrl(uploadResult.uploadUrl, imageFile);

  return uploadResult.key;
};
