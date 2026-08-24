"use client";

import { useState } from "react";
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
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  return (
    <>
      <Controller
        name="activityBaseAddress"
        control={control}
        render={({ field, fieldState }) => (
          <FormField label="활동 거점" labelFor={`${idPrefix}-activity-base`} required>
            <Input
              id={`${idPrefix}-activity-base`}
              size="md"
              readOnly
              value={field.value?.roadAddress ?? ""}
              placeholder="기사님의 활동 거점을 선택해 주세요"
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
                kind="활동 거점"
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
          <FormField label="활동 거점 상세 주소" labelFor={`${idPrefix}-activity-base-detail`}>
            <Input
              {...field}
              value={field.value ?? ""}
              id={`${idPrefix}-activity-base-detail`}
              size="md"
              placeholder="건물명, 층 등 상세 주소를 입력해 주세요"
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
