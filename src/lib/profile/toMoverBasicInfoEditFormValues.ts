import type { MoverBasicInfoEditFormValues } from "@/lib/schemas/moverBasicInfoEditSchema";
import type { MoverProfileMe } from "@/types/profile";

export const toMoverBasicInfoEditFormValues = (
  moverProfile: MoverProfileMe,
): Partial<MoverBasicInfoEditFormValues> => {
  return {
    name: moverProfile.name,
    phone: moverProfile.phone?.replace(/\D/g, "") ?? "",
    currentPassword: "",
    newPassword: "",
    newPasswordConfirm: "",
  };
};
