import { requestReportImageUploadUrl, uploadReportImageToPresignedUrl } from "@/lib/api/reports";
import {
  REPORT_IMAGE_CONTENT_TYPES,
  REPORT_IMAGE_MAX_COUNT,
  REPORT_IMAGE_MAX_SIZE,
  type ReportImageContentType,
} from "@/types/report";

const isReportImageContentType = (value: string): value is ReportImageContentType =>
  (REPORT_IMAGE_CONTENT_TYPES as readonly string[]).includes(value);

const validateReportImage = (file: File): ReportImageContentType => {
  if (!isReportImageContentType(file.type)) {
    throw new Error("JPG, PNG, WEBP 이미지만 첨부할 수 있습니다.");
  }

  if (file.size > REPORT_IMAGE_MAX_SIZE) {
    throw new Error("이미지는 한 장당 최대 5MB까지 첨부할 수 있습니다.");
  }

  return file.type;
};

export const uploadReportImages = async (files: File[]): Promise<string[]> => {
  if (files.length > REPORT_IMAGE_MAX_COUNT) {
    throw new Error("이미지는 최대 5장까지 첨부할 수 있습니다.");
  }

  return Promise.all(
    files.map(async (file) => {
      const contentType = validateReportImage(file);

      const { uploadUrl, key } = await requestReportImageUploadUrl({
        contentType,
      });

      await uploadReportImageToPresignedUrl(uploadUrl, file);

      return key;
    }),
  );
};
