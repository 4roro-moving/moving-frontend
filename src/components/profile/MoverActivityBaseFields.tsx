"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Controller, type Control } from "react-hook-form";

import FormField from "@/components/common/FormField/FormField";
import Input from "@/components/common/Input/Input";
import AddressSelectModal from "@/components/estimate/request/AddressSelectModal";
import type { MoverProfileFormValues } from "@/lib/schemas/moverProfileSchema";

/**기사 활동 거점 및 상세주소 입력 필드 */
interface MoverActivityBaseFieldsProps {
  control: Control<MoverProfileFormValues>;
  disabled?: boolean;
  idPrefix: string;
}

export default function MoverActivityBaseFields({
  control,
  disabled = false,
  idPrefix,
}: MoverActivityBaseFieldsProps) {
  const t = useTranslations("profile");
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  return (
    <>
      <Controller
        name="activityBaseAddress"
        control={control}
        render={({ field, fieldState }) => (
          <FormField
            label={t("activityBase")}
            labelFor={`${idPrefix}-activity-base`}
            required
            requiredLabel={t("requiredField")}
          >
            <Input
              id={`${idPrefix}-activity-base`}
              size="md"
              readOnly
              value={field.value?.roadAddress ?? ""}
              placeholder={t("activityBasePlaceholder")}
              error={fieldState.error?.message}
              disabled={disabled}
              aria-haspopup="dialog"
              onClick={() => setIsAddressModalOpen(true)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setIsAddressModalOpen(true);
                }
              }}
            />

            {isAddressModalOpen ? (
              <AddressSelectModal
                open
                kind={t("activityBase")}
                onClose={() => setIsAddressModalOpen(false)}
                onConfirm={(address) => {
                  field.onChange(address);
                  setIsAddressModalOpen(false);
                }}
              />
            ) : null}
          </FormField>
        )}
      />

      <Controller
        name="activityBaseDetailAddress"
        control={control}
        render={({ field, fieldState }) => (
          <FormField label={t("activityBaseDetail")} labelFor={`${idPrefix}-activity-base-detail`}>
            <Input
              {...field}
              value={field.value ?? ""}
              id={`${idPrefix}-activity-base-detail`}
              size="md"
              placeholder={t("activityBaseDetailPlaceholder")}
              maxLength={100}
              error={fieldState.error?.message}
              disabled={disabled}
            />
          </FormField>
        )}
      />
    </>
  );
}
