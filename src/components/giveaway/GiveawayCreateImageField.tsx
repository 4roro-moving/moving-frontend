"use client";

import { useEffect, useId, useRef, useState, type ChangeEvent } from "react";

import { Text } from "@/components/common/Text";
import { CloseIcon, GalleryIcon } from "@/icons";
import { GIVEAWAY_CREATE_COVER_LABEL, GIVEAWAY_IMAGE_MAX_COUNT } from "@/lib/constants/giveaway";
import { cn } from "@/lib/utils/cn";
import { GIVEAWAY_IMAGE_CONTENT_TYPES, type GiveawayFormImage } from "@/types/giveaway";

interface GiveawayCreateImageFieldProps {
  images: GiveawayFormImage[];
  error?: string;
  disabled?: boolean;
  onAdd: (fileList: FileList | null) => void;
  onRemove: (index: number) => void;
}

const getImageKey = (image: GiveawayFormImage, index: number) => {
  if (image.kind === "existing") {
    return `existing-${String(image.id)}`;
  }

  return `new-${image.file.name}-${String(image.file.lastModified)}-${String(index)}`;
};

const GiveawayCreatePreviewImage = ({ src }: { src: string }) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="bg-background-avatar rounded-12 flex size-full items-center justify-center">
        <GalleryIcon className="text-icon-subtle size-24 md:size-32" aria-hidden="true" />
      </div>
    );
  }

  return (
    // blob URL — Next Image 도메인 제한 회피
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      className="bg-background-avatar rounded-12 size-full object-cover"
      onError={() => setHasError(true)}
    />
  );
};

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
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  useEffect(() => {
    const nextUrls = images.map((image) => {
      if (image.kind === "existing") {
        return image.imageUrl;
      }

      return URL.createObjectURL(image.file);
    });
    const createdObjectUrls = nextUrls.filter((_, index) => images[index]?.kind === "new");
    const frameId = requestAnimationFrame(() => {
      setPreviewUrls(nextUrls);
    });

    return () => {
      cancelAnimationFrame(frameId);
      createdObjectUrls.forEach((url) => {
        URL.revokeObjectURL(url);
      });
    };
  }, [images]);

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
        tabIndex={-1}
        disabled={disabled || isMaxCount}
        aria-label="나눔 이미지 추가"
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        onChange={handleChange}
      />

      <div className="flex w-full items-start gap-8">
        <div className="flex shrink-0 flex-col items-center gap-2 pt-20">
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

        <div className="min-w-0 flex-1 overflow-x-auto pt-20 pr-20">
          <div className="flex w-max items-start gap-8">
            {previewUrls.map((previewUrl, index) => {
              const image = images[index];
              if (!image) {
                return null;
              }

              return (
                <div
                  key={getImageKey(image, index)}
                  className="relative size-64 shrink-0 md:size-100"
                >
                  <GiveawayCreatePreviewImage key={previewUrl} src={previewUrl} />

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
                      "absolute -top-20 -right-20 flex size-44 items-center justify-center",
                      "focus-visible:ring-border-brand focus-visible:ring-2 focus-visible:outline-none",
                      "disabled:cursor-not-allowed disabled:opacity-50",
                    )}
                  >
                    <span className="bg-text-tertiary flex size-18 items-center justify-center rounded-full">
                      <CloseIcon className="text-text-inverse size-8" aria-hidden="true" />
                    </span>
                  </button>
                </div>
              );
            })}
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
