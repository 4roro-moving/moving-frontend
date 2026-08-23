"use client";

import { useEffect, useId, useMemo, useRef, type ChangeEvent } from "react";

import { PROFILE_IMAGE_CONTENT_TYPES } from "@/types/profile";
import { Text } from "@/components/common/Text";
import { ClearIcon, GalleryIcon } from "@/icons";
import { cn } from "@/lib/utils/cn";

interface ProfileImageUploaderProps {
  /** FormField labelFor 와 맞출 input id. 없으면 내부 useId */
  id?: string;
  value?: File | null;
  /** 수정 모드 등 기존 이미지 URL */
  initialPreviewUrl?: string | null;
  onChange: (file: File | null) => void;
  /** 미리보기 X. 새 파일 취소 또는 기존 이미지 제거 */
  onClear?: () => void;
  error?: string;
  disabled?: boolean;
  className?: string;
}

/** 프로필 이미지 업로드 트리거 (Figma profile/image-uploader) */
const ProfileImageUploader = ({
  id,
  value,
  initialPreviewUrl = null,
  onChange,
  onClear,
  error,
  disabled = false,
  className,
}: ProfileImageUploaderProps) => {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;
  const inputRef = useRef<HTMLInputElement>(null);

  // react-hooks/set-state-in-effect 때문에 effect + setState 패턴 대신
  // useMemo 생성 + effect cleanup revoke 로 관리한다.
  const objectUrl = useMemo(() => {
    if (!value) return null;
    return URL.createObjectURL(value);
  }, [value]);

  useEffect(() => {
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [objectUrl]);

  const PROFILE_IMAGE_ACCEPT = PROFILE_IMAGE_CONTENT_TYPES.join(",");

  const previewUrl = objectUrl ?? initialPreviewUrl;
  const canClear = Boolean(previewUrl) && Boolean(onClear) && !disabled;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    onChange(file);
  };

  const handleClear = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    onClear?.();
  };

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={PROFILE_IMAGE_ACCEPT}
        className="sr-only"
        disabled={disabled}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        onChange={handleChange}
      />
      <div className="relative size-100 md:size-160">
        <button
          type="button"
          aria-label="프로필 이미지 선택"
          aria-describedby={error ? errorId : undefined}
          disabled={disabled}
          onClick={() => {
            inputRef.current?.click();
          }}
          className={cn(
            "bg-background-muted rounded-6 relative flex size-full items-center justify-center overflow-hidden",
            "focus-visible:ring-border-brand focus-visible:ring-2 focus-visible:outline-none",
            "disabled:cursor-not-allowed disabled:opacity-50",
          )}
        >
          {previewUrl ? (
            // blob/원격 URL 모두 대응 — Next Image 도메인 제한 회피
            // eslint-disable-next-line @next/next/no-img-element
            <img src={previewUrl} alt="" className="absolute inset-0 size-full object-cover" />
          ) : (
            <GalleryIcon className="text-icon-subtle size-24 md:size-40" aria-hidden="true" />
          )}
        </button>
        {canClear ? (
          <button
            type="button"
            aria-label="프로필 이미지 초기화"
            disabled={disabled}
            onClick={handleClear}
            className={cn(
              "absolute top-0 right-0 z-10 flex min-h-44 min-w-44 items-center justify-center rounded-full",
              "focus-visible:ring-border-brand focus-visible:ring-2 focus-visible:outline-none",
              "disabled:cursor-not-allowed disabled:opacity-50",
            )}
          >
            <ClearIcon className="size-24" aria-hidden="true" />
          </button>
        ) : null}
      </div>
      {error ? (
        <Text as="p" id={errorId} role="alert" variant="xs-regular" className="text-text-error">
          {error}
        </Text>
      ) : null}
    </div>
  );
};

export default ProfileImageUploader;
