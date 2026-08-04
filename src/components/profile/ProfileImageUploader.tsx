"use client";

import { useEffect, useId, useMemo, useRef, type ChangeEvent } from "react";

import { Text } from "@/components/common/Text";
import { GalleryIcon } from "@/icons";
import { IS_PROFILE_IMAGE_UPLOAD_ENABLED } from "@/lib/profile/uploadProfileImage";
import { cn } from "@/lib/utils/cn";

interface ProfileImageUploaderProps {
  value?: File | null;
  /** 수정 모드 등 기존 이미지 URL */
  initialPreviewUrl?: string | null;
  onChange: (file: File | null) => void;
  error?: string;
  className?: string;
}

const PROFILE_IMAGE_UPLOAD_DISABLED_MESSAGE = "이미지 업로드 기능은 아직 지원하지 않습니다.";

/** 프로필 이미지 업로드 트리거 (Figma profile/image-uploader) */
const ProfileImageUploader = ({
  value,
  initialPreviewUrl = null,
  onChange,
  error,
  className,
}: ProfileImageUploaderProps) => {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

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

  const previewUrl = objectUrl ?? initialPreviewUrl;
  const isUploadEnabled = IS_PROFILE_IMAGE_UPLOAD_ENABLED;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    onChange(file);
  };

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept="image/*"
        className="sr-only"
        disabled={!isUploadEnabled}
        aria-invalid={Boolean(error)}
        onChange={handleChange}
      />
      <button
        type="button"
        aria-label={isUploadEnabled ? "프로필 이미지 선택" : PROFILE_IMAGE_UPLOAD_DISABLED_MESSAGE}
        disabled={!isUploadEnabled}
        onClick={() => {
          if (!isUploadEnabled) return;
          inputRef.current?.click();
        }}
        className={cn(
          "bg-background-muted rounded-6 relative flex items-center justify-center overflow-hidden",
          "size-100 md:size-160",
          "focus-visible:ring-border-brand focus-visible:ring-2 focus-visible:outline-none",
          !isUploadEnabled && "cursor-not-allowed opacity-60",
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
      {!isUploadEnabled ? (
        <Text as="p" variant="xs-regular" className="text-text-subtle">
          {PROFILE_IMAGE_UPLOAD_DISABLED_MESSAGE}
        </Text>
      ) : null}
      {error ? (
        <Text as="p" role="alert" variant="xs-regular" className="text-text-error">
          {error}
        </Text>
      ) : null}
    </div>
  );
};

export default ProfileImageUploader;
