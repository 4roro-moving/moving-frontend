import type { AuthUser } from "@/lib/api/auth";
import fetchInstance, { type FetchRequestOptions } from "@/lib/api/fetchInstance";
import { API_ROUTES } from "@/lib/constants/apiRoutes";
import type { RegionId } from "@/lib/constants/region";
import { ApiError } from "@/types/api";
import type { MoveType } from "@/types/move";

export interface CustomerProfileStatus {
  isProfileCompleted: boolean;
}

interface CustomerProfileRegion {
  id: RegionId;
  name: string;
}

/**
 * GET /profiles/customer/me 원본(data)
 * name/email/phone·regions·serviceTypes가 이미 펼쳐진 형태
 */
export interface CustomerProfileMeResponse {
  id: string | number;
  userId: string;
  name: string;
  email: string;
  phone: string | null;
  imageUrl: string | null;
  regions: CustomerProfileRegion[];
  serviceTypes: MoveType[];
  createdAt: string;
  updatedAt: string;
}

export type CustomerProfileMe = CustomerProfileMeResponse & {
  id: string;
};

export interface MoverProfileMeResponse {
  id: string | number;
  userId: string;
  name: string;
  email: string;
  phone: string | null;
  imageUrl: string | null;
  regions: CustomerProfileRegion[];
  serviceTypes: MoveType[];
  createdAt: string;
  updatedAt: string;
}

export type MoverProfileMe = MoverProfileMeResponse & {
  id: string;
};

/**
 * customer 프로필 status 조회
 *
 */
export const getCustomerProfileStatus = (options?: FetchRequestOptions) =>
  fetchInstance.get<CustomerProfileStatus>(API_ROUTES.PROFILES.CUSTOMER_STATUS, options);

export const mapCustomerProfileMeResponse = (
  profile: CustomerProfileMeResponse,
): CustomerProfileMe => {
  if (!profile?.name) {
    throw new ApiError("고객 프로필 응답 형식이 올바르지 않습니다.");
  }

  return {
    id: String(profile.id),
    userId: String(profile.userId),
    name: profile.name,
    email: profile.email,
    phone: profile.phone,
    imageUrl: profile.imageUrl,
    regions: profile.regions ?? [],
    serviceTypes: profile.serviceTypes ?? [],
    createdAt: profile.createdAt,
    updatedAt: profile.updatedAt,
  };
};

export const getCustomerProfileMe = async (): Promise<CustomerProfileMe> => {
  const profile = await fetchInstance.get<CustomerProfileMeResponse>(
    API_ROUTES.PROFILES.CUSTOMER_ME,
  );

  return mapCustomerProfileMeResponse(profile);
};

/** Header·auth store용 — AuthUser.id = userId */
export const toAuthUserFromCustomerProfile = (profile: CustomerProfileMe): AuthUser => ({
  id: profile.userId,
  name: profile.name,
  email: profile.email,
  phone: profile.phone,
  role: "CUSTOMER",
});

/**
 * mover 프로필 status 조회
 *
 */
export const getMoverProfileStatus = (options?: FetchRequestOptions) =>
  fetchInstance.get<CustomerProfileStatus>(API_ROUTES.PROFILES.MOVER_STATUS, options);

export const mapMoverProfileMeResponse = (profile: MoverProfileMeResponse): MoverProfileMe => {
  if (!profile?.name) {
    throw new ApiError("고객 프로필 응답 형식이 올바르지 않습니다.");
  }

  return {
    id: String(profile.id),
    userId: String(profile.userId),
    name: profile.name,
    email: profile.email,
    phone: profile.phone,
    imageUrl: profile.imageUrl,
    regions: profile.regions ?? [],
    serviceTypes: profile.serviceTypes ?? [],
    createdAt: profile.createdAt,
    updatedAt: profile.updatedAt,
  };
};

export const getMoverProfileMe = async (): Promise<MoverProfileMe> => {
  const profile = await fetchInstance.get<MoverProfileMeResponse>(API_ROUTES.PROFILES.MOVER_ME);

  return mapMoverProfileMeResponse(profile);
};

/** Header·auth store용 — AuthUser.id = userId */
export const toAuthUserFromMoverProfile = (profile: MoverProfileMe): AuthUser => ({
  id: profile.userId,
  name: profile.name,
  email: profile.email,
  phone: profile.phone,
  role: "MOVER",
});
