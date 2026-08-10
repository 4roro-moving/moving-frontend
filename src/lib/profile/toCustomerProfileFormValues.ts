import type { CustomerProfileFormValues } from "@/lib/schemas/customerProfileSchema";
import type { CustomerProfileMe } from "@/types/profile";

export const toCustomerProfileFormValues = (
  customerProfile: CustomerProfileMe,
): Partial<CustomerProfileFormValues> => {
  return {
    imageFile: null,
    serviceTypes: customerProfile.serviceTypes,
    regionId: customerProfile.regions[0]?.id ?? null,
  };
};
