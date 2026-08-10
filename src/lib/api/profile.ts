import type { AuthUser } from "@/lib/api/auth";
import fetchInstance, { type FetchRequestOptions } from "@/lib/api/fetchInstance";
import { API_ROUTES } from "@/lib/constants/apiRoutes";
import { ApiError } from "@/types/api";
import type {
  CreateCustomerProfileInput,
  CreateMoverProfileInput,
  CustomerProfileMe,
  CustomerProfileMeResponse,
  MoverProfileMe,
  MoverProfileMeResponse,
  ProfileStatus,
  UpdateCustomerBasicInfoInput,
  UpdateCustomerProfileInput,
  UpdateMoverBasicInfoInput,
  UpdateMoverProfileInput,
} from "@/types/profile";

export type {
  CreateCustomerProfileInput,
  CreateMoverProfileInput,
  CustomerProfileMe,
  CustomerProfileMeResponse,
  MoverProfileMe,
  MoverProfileMeResponse,
  ProfileStatus,
  UpdateCustomerBasicInfoInput,
  UpdateCustomerProfileInput,
  UpdateMoverBasicInfoInput,
  UpdateMoverProfileInput,
} from "@/types/profile";

/** @deprecated ProfileStatus 사용 */
export type CustomerProfileStatus = ProfileStatus;

export const getCustomerProfileStatus = (options?: FetchRequestOptions) =>
  fetchInstance.get<ProfileStatus>(API_ROUTES.PROFILES.CUSTOMER_STATUS, options);

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
    hasPassword: profile.hasPassword,
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

export const createCustomerProfile = (input: CreateCustomerProfileInput) =>
  fetchInstance.post<CustomerProfileMeResponse, CreateCustomerProfileInput>(
    API_ROUTES.PROFILES.CUSTOMER,
    input,
  );

export const updateCustomerBasicInfo = (input: UpdateCustomerBasicInfoInput) =>
  fetchInstance.patch<CustomerProfileMeResponse, UpdateCustomerBasicInfoInput>(
    API_ROUTES.PROFILES.CUSTOMER_BASIC,
    input,
  );

export const updateCustomerProfile = (input: UpdateCustomerProfileInput) =>
  fetchInstance.patch<CustomerProfileMeResponse, UpdateCustomerProfileInput>(
    API_ROUTES.PROFILES.CUSTOMER_ME,
    input,
  );

/** Header·auth store용 — AuthUser.id = userId */
export const toAuthUserFromCustomerProfile = (profile: CustomerProfileMe): AuthUser => ({
  id: profile.userId,
  name: profile.name,
  email: profile.email,
  phone: profile.phone,
  role: "CUSTOMER",
  imageUrl: profile.imageUrl,
});

export const getMoverProfileStatus = (options?: FetchRequestOptions) =>
  fetchInstance.get<ProfileStatus>(API_ROUTES.PROFILES.MOVER_STATUS, options);

export const mapMoverProfileMeResponse = (profile: MoverProfileMeResponse): MoverProfileMe => {
  if (!profile?.nickname) {
    throw new ApiError("기사 프로필 응답 형식이 올바르지 않습니다.");
  }

  return {
    id: String(profile.id),
    userId: String(profile.userId),
    name: profile.name,
    email: profile.email,
    phone: profile.phone,
    hasPassword: profile.hasPassword,
    nickname: profile.nickname,
    imageUrl: profile.imageUrl,
    career: profile.career,
    shortIntro: profile.shortIntro,
    description: profile.description,
    confirmedCount: profile.confirmedCount,
    averageRating: profile.averageRating,
    reviewCount: profile.reviewCount,
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

export const createMoverProfile = (input: CreateMoverProfileInput) =>
  fetchInstance.post<MoverProfileMeResponse, CreateMoverProfileInput>(
    API_ROUTES.PROFILES.MOVER,
    input,
  );

export const updateMoverProfile = (input: UpdateMoverProfileInput) =>
  fetchInstance.patch<MoverProfileMeResponse, UpdateMoverProfileInput>(
    API_ROUTES.PROFILES.MOVER_ME,
    input,
  );

export const updateMoverBasicInfo = (input: UpdateMoverBasicInfoInput) =>
  fetchInstance.patch<MoverProfileMeResponse, UpdateMoverBasicInfoInput>(
    API_ROUTES.PROFILES.MOVER_BASIC,
    input,
  );

/** Header·auth store용 — AuthUser.id = userId */
export const toAuthUserFromMoverProfile = (profile: MoverProfileMe): AuthUser => ({
  id: profile.userId,
  name: profile.name,
  email: profile.email ?? "",
  phone: profile.phone,
  role: "MOVER",
  imageUrl: profile.imageUrl,
});

export const resolveAuthUserImage = async (user: AuthUser): Promise<AuthUser> => {
  if (typeof user.imageUrl === "string" && user.imageUrl.trim().length > 0) {
    return user;
  }

  try {
    if (user.role === "CUSTOMER") {
      const profile = await getCustomerProfileMe();
      return { ...user, imageUrl: profile.imageUrl ?? null };
    } else if (user.role === "MOVER") {
      const profile = await getMoverProfileMe();
      return { ...user, imageUrl: profile.imageUrl ?? null };
    }

    return { ...user, imageUrl: null };
  } catch (error) {
    // imageUrl 필드를 건들이지 않는다.
    return user;
  }
};
