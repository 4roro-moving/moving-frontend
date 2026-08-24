import fetchInstance from "@/lib/api/fetchInstance";
import { uploadFileToPresignedUrl } from "@/lib/api/profileImage";
import { API_ROUTES } from "@/lib/constants/apiRoutes";
import { ApiError } from "@/types/api";
import type { CursorPagination } from "@/types/pagination";
import type {
  CreateGiveawayInput,
  GiveawayDetail,
  GiveawayImageUploadUrlRequest,
  GiveawayImageUploadUrlResult,
  GiveawayListItem,
  GiveawayListQuery,
  GiveawayListResult,
  GiveawayMyListQuery,
  UpdateGiveawayInput,
} from "@/types/giveaway";
import { isGiveawayImageContentType } from "@/types/giveaway";

export const fetchGiveaways = async (query: GiveawayListQuery): Promise<GiveawayListResult> => {
  const params = new URLSearchParams();
  params.set("limit", String(query.limit));
  params.set("sort", query.sort);

  if (query.keyword) {
    params.set("keyword", query.keyword);
  }
  if (query.regionId !== undefined) {
    params.set("regionId", String(query.regionId));
  }
  if (query.status !== undefined) {
    params.set("status", query.status);
  }
  if (query.cursor) {
    params.set("cursor", query.cursor);
  }

  return fetchInstance.getPaginated<GiveawayListItem[], CursorPagination>(
    `${API_ROUTES.GIVEAWAYS.ROOT}?${params.toString()}`,
  );
};

export const fetchMyGiveaways = async (query: GiveawayMyListQuery): Promise<GiveawayListResult> => {
  const params = new URLSearchParams();
  params.set("limit", String(query.limit));
  params.set("sort", query.sort);

  if (query.status !== undefined) {
    params.set("status", query.status);
  }
  if (query.cursor) {
    params.set("cursor", query.cursor);
  }

  return fetchInstance.getPaginated<GiveawayListItem[], CursorPagination>(
    `${API_ROUTES.GIVEAWAYS.ME}?${params.toString()}`,
  );
};

export const requestGiveawayImageUploadUrl = (body: GiveawayImageUploadUrlRequest) =>
  fetchInstance.post<GiveawayImageUploadUrlResult, GiveawayImageUploadUrlRequest>(
    API_ROUTES.GIVEAWAYS.IMAGE_UPLOAD_URL,
    body,
  );

export const createGiveaway = (body: CreateGiveawayInput) =>
  fetchInstance.post<GiveawayDetail, CreateGiveawayInput>(API_ROUTES.GIVEAWAYS.ROOT, body);

export const fetchGiveawayDetail = (giveawayId: number) =>
  fetchInstance.get<GiveawayDetail>(API_ROUTES.GIVEAWAYS.DETAIL(giveawayId));

export const updateGiveaway = (giveawayId: number, body: UpdateGiveawayInput) =>
  fetchInstance.patch<GiveawayDetail, UpdateGiveawayInput>(
    API_ROUTES.GIVEAWAYS.DETAIL(giveawayId),
    body,
  );

export const deleteGiveaway = (giveawayId: number) =>
  fetchInstance.delete<null>(API_ROUTES.GIVEAWAYS.DETAIL(giveawayId));

export const completeGiveaway = (giveawayId: number) =>
  fetchInstance.post<GiveawayDetail>(API_ROUTES.GIVEAWAYS.COMPLETE(giveawayId));

export const uploadGiveawayImages = async (images: File[]): Promise<string[]> => {
  const imageKeys: string[] = [];

  for (const image of images) {
    if (!isGiveawayImageContentType(image.type)) {
      throw new ApiError("jpg, png, webp 형식의 이미지만 등록할 수 있습니다.");
    }

    const uploadResult = await requestGiveawayImageUploadUrl({
      contentType: image.type,
      size: image.size,
    });

    await uploadFileToPresignedUrl(uploadResult.uploadUrl, image);
    imageKeys.push(uploadResult.key);
  }

  return imageKeys;
};
