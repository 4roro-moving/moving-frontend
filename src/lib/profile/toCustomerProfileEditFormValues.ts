import type { CustomerProfileEditFormValues } from "@/lib/schemas/customerProfileEditSchema";
import type { CustomerProfileMe } from "@/types/profile";

export const toCustomerProfileEditFormValues = (
  customerProfile: CustomerProfileMe,
): Partial<CustomerProfileEditFormValues> => {
  return {
    name: customerProfile.name,
    phone: customerProfile.phone?.replace(/\D/g, "") ?? "",
    currentPassword: "",
    newPassword: "",
    newPasswordConfirm: "",
    imageFile: null,
    serviceTypes: customerProfile.serviceTypes,
    regionId: customerProfile.regions[0]?.id ?? null,
  };
};
