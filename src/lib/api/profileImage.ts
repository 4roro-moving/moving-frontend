import fetchInstance from "@/lib/api/fetchInstance";
import { API_ROUTES } from "@/lib/constants/apiRoutes";
import { ApiError } from "@/types/api";
import type { ProfileImageUploadUrlRequest, ProfileImageUploadUrlResult } from "@/types/profile";

export const requestProfileImageUploadUrl = (body: ProfileImageUploadUrlRequest) =>
  fetchInstance.post<ProfileImageUploadUrlResult, ProfileImageUploadUrlRequest>(
    API_ROUTES.PROFILES.IMAGE_UPLOAD_URL,
    body,
  );

/**
 * Presigned URL로 S3에 파일을 업로드합니다.
 * Authorization/JSON Content-Type을 붙이면 signature가 깨지므로 fetchInstance를 쓰지 않습니다.
 */
export const uploadFileToPresignedUrl = async (uploadUrl: string, file: File): Promise<void> => {
  const response = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
    },
    body: file,
  });

  if (!response.ok) {
    throw new ApiError("이미지 업로드에 실패했습니다.");
  }
};
