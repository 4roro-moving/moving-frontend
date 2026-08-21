"use client";

import { useEffect, useId, useMemo, useRef, type ChangeEvent } from "react";

import { Text } from "@/components/common/Text";
import { CloseIcon, GalleryIcon } from "@/icons";
import { GIVEAWAY_CREATE_COVER_LABEL, GIVEAWAY_IMAGE_MAX_COUNT } from "@/lib/constants/giveaway";
import { cn } from "@/lib/utils/cn";
import { GIVEAWAY_IMAGE_CONTENT_TYPES } from "@/types/giveaway";

interface GiveawayCreateImageFieldProps {
  images: File[];
  error?: string;
  disabled?: boolean;
  onAdd: (fileList: FileList | null) => void;
  onRemove: (index: number) => void;
}

const GiveawayCreateImageField = ({
  images,
  error,
  disabled = false,
  onAdd,
  onRemove,
}: GiveawayCreateImageFieldProps) => {
  const generatedId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const errorId = `${generatedId}-error`;
  const isMaxCount = images.length >= GIVEAWAY_IMAGE_MAX_COUNT;
  const previewUrls = useMemo(() => images.map((file) => URL.createObjectURL(file)), [images]);

  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => {
        URL.revokeObjectURL(url);
      });
    };
  }, [previewUrls]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onAdd(event.target.files);
    event.target.value = "";
  };

  return (
    <div className="flex w-full flex-col gap-8">
      <input
        ref={inputRef}
        id={generatedId}
        type="file"
        accept={GIVEAWAY_IMAGE_CONTENT_TYPES.join(",")}
        multiple
        className="sr-only"
        disabled={disabled || isMaxCount}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        onChange={handleChange}
      />

      <div className="flex w-full items-start gap-8">
        <div className="flex shrink-0 flex-col items-center gap-2 pt-8">
          <button
            type="button"
            aria-label="나눔 이미지 추가"
            aria-describedby={error ? errorId : undefined}
            disabled={disabled || isMaxCount}
            onClick={() => inputRef.current?.click()}
            className={cn(
              "bg-background-muted rounded-6 flex size-64 items-center justify-center overflow-hidden md:size-100",
              "focus-visible:ring-border-brand focus-visible:ring-2 focus-visible:outline-none",
              "disabled:cursor-not-allowed disabled:opacity-50",
            )}
          >
            <GalleryIcon className="text-icon-subtle size-24 md:size-32" aria-hidden="true" />
          </button>
          <Text as="p" variant="md-regular" className="text-text-primary">
            <span className="text-text-brand">{images.length}</span>
            {` / ${String(GIVEAWAY_IMAGE_MAX_COUNT)}`}
          </Text>
        </div>

        <div className="min-w-0 flex-1 overflow-x-auto pt-8 pr-8">
          <div className="flex w-max items-start gap-8">
            {previewUrls.map((previewUrl, index) => (
              <div
                key={`${images[index]?.name ?? "image"}-${String(images[index]?.lastModified ?? index)}`}
                className="relative size-64 shrink-0 md:size-100"
              >
                {/* blob URL — Next Image 도메인 제한 회피 */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt=""
                  className="bg-background-avatar rounded-12 size-full object-cover"
                />

                {index === 0 ? (
                  <div className="bg-background-avatar rounded-b-12 pointer-events-none absolute inset-x-0 bottom-0 flex h-1/4 items-center justify-center">
                    <Text as="span" variant="xs-regular" className="text-text-inverse">
                      {GIVEAWAY_CREATE_COVER_LABEL}
                    </Text>
                  </div>
                ) : null}

                <button
                  type="button"
                  aria-label={`${String(index + 1)}번째 이미지 삭제`}
                  disabled={disabled}
                  onClick={() => onRemove(index)}
                  className={cn(
                    "bg-text-tertiary absolute -top-7 -right-7 flex size-18 items-center justify-center rounded-full",
                    "focus-visible:ring-border-brand focus-visible:ring-2 focus-visible:outline-none",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                  )}
                >
                  <CloseIcon className="text-text-inverse size-8" aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {error ? (
        <Text as="p" id={errorId} role="alert" variant="xs-regular" className="text-text-error">
          {error}
        </Text>
      ) : null}
    </div>
  );
};

export default GiveawayCreateImageField;
