import type { RegionId } from "@/lib/constants/region";
import type { MoveType } from "@/types/move";

export interface ProfileRegion {
  id: RegionId;
  name: string;
}

export interface ProfileStatus {
  isProfileCompleted: boolean;
}

/**
 * GET /profiles/customer/me 원본(data)
 */
export interface CustomerProfileMeResponse {
  id: string | number;
  userId: string;
  name: string;
  email: string;
  phone: string | null;
  imageUrl: string | null;
  regions: ProfileRegion[];
  serviceTypes: MoveType[];
  createdAt: string;
  updatedAt: string;
}

export type CustomerProfileMe = CustomerProfileMeResponse & {
  id: string;
};

/**
 * GET /profiles/mover/me 원본(data)
 */
export interface MoverProfileMeResponse {
  id: string | number;
  userId: string;
  name: string;
  email?: string;
  phone: string | null;
  nickname: string;
  imageUrl: string | null;
  career: number;
  shortIntro: string;
  description: string;
  confirmedCount?: number;
  averageRating?: number;
  reviewCount?: number;
  regions: ProfileRegion[];
  serviceTypes: MoveType[];
  createdAt: string;
  updatedAt: string;
}

export type MoverProfileMe = Omit<MoverProfileMeResponse, "id" | "userId"> & {
  id: string;
  userId: string;
};

export interface CreateCustomerProfileInput {
  imageUrl?: string;
  regionIds: number[];
  serviceTypes: MoveType[];
}

export interface UpdateCustomerProfileInput {
  name?: string;
  phone?: string;
  currentPassword?: string;
  newPassword?: string;
  newPasswordConfirm?: string;
  imageUrl?: string | null;
  regionIds?: number[];
  serviceTypes?: MoveType[];
}

export interface CreateMoverProfileInput {
  nickname: string;
  imageUrl?: string;
  career: number;
  shortIntro: string;
  description: string;
  regionIds: number[];
  serviceTypes: MoveType[];
}

export interface UpdateMoverProfileInput {
  nickname?: string;
  imageUrl?: string | null;
  career?: number;
  shortIntro?: string;
  description?: string;
  regionIds?: number[];
  serviceTypes?: MoveType[];
}

export interface UpdateMoverBasicInfoInput {
  name?: string;
  phone?: string;
  currentPassword?: string;
  newPassword?: string;
  newPasswordConfirm?: string;
}

export const PROFILE_IMAGE_CONTENT_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

export type ProfileImageContentType = (typeof PROFILE_IMAGE_CONTENT_TYPES)[number];

export interface ProfileImageUploadUrlRequest {
  contentType: ProfileImageContentType;
  size: number;
}

export interface ProfileImageUploadUrlResult {
  uploadUrl: string;
  key: string;
  expiresIn: number;
}
