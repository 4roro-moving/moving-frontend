"use client";

import { useRouter } from "next/navigation";

import Button from "@/components/common/Button/Button";
import { cn } from "@/lib/utils/cn";

interface ProfileFormActionsProps {
  submitLabel?: string;
  cancelLabel?: string;
  isSubmitDisabled?: boolean;
  className?: string;
}

/** 프로필·기본정보 수정 폼 공통 취소/제출 액션 */
const ProfileFormActions = ({
  submitLabel = "수정하기",
  cancelLabel = "취소",
  isSubmitDisabled = false,
  className,
}: ProfileFormActionsProps) => {
  const router = useRouter();

  return (
    <div
      className={cn(
        "flex w-full flex-col-reverse gap-8 md:flex-row md:justify-end md:gap-20",
        className,
      )}
    >
      <Button
        type="button"
        variant="outline"
        size="auth"
        fullWidth
        className="md:w-[240px]"
        onClick={() => router.back()}
      >
        {cancelLabel}
      </Button>
      <Button
        type="submit"
        variant="solid"
        size="auth"
        fullWidth
        className="md:w-[240px]"
        disabled={isSubmitDisabled}
      >
        {submitLabel}
      </Button>
    </div>
  );
};

export default ProfileFormActions;
