import type { RegionId } from "@/lib/constants/region";
import type { MoveType } from "@/types/move";

export interface ProfileRegion {
  id: RegionId;
  name: string;
}

export interface ProfileStatus {
  isProfileCompleted: boolean;
  hasPhone: boolean;
}

/**기사 활동 거점 */
export interface MoverActivityBase {
  address: string;
  detailAddress?: string;
  zipCode: string;
  latitude: number;
  longitude: number;
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
  hasPassword: boolean;
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
  hasPassword: boolean;
  nickname: string;
  imageUrl: string | null;
  career: number;
  shortIntro: string;
  description: string;
  activityBase: MoverActivityBase | null;
  confirmedCount?: number;
  completedCount: number;
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
  phone?: string;
  imageUrl?: string;
  regionIds: number[];
  serviceTypes: MoveType[];
}

/** PATCH /profiles/customer/me/basic */
export interface UpdateCustomerBasicInfoInput {
  name?: string;
  phone?: string;
  currentPassword?: string;
  newPassword?: string;
  newPasswordConfirm?: string;
}

/** PATCH /profiles/customer/me */
export interface UpdateCustomerProfileInput {
  imageUrl?: string | null;
  regionIds?: number[];
  serviceTypes?: MoveType[];
}

export interface CreateMoverProfileInput {
  phone?: string;
  nickname: string;
  imageUrl?: string;
  career: number;
  shortIntro: string;
  description: string;
  activityBase: MoverActivityBase;
  regionIds: number[];
  serviceTypes: MoveType[];
}

export interface UpdateMoverProfileInput {
  nickname?: string;
  imageUrl?: string | null;
  career?: number;
  shortIntro?: string;
  description?: string;
  activityBase?: MoverActivityBase;
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
export const PROFILE_IMAGE_MAX_SIZE = 2 * 1024 * 1024; // 2MB

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
