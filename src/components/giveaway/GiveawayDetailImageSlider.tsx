"use client";

import Image from "next/image";
import { useState } from "react";

import { Text } from "@/components/common/Text";
import { ChevronLeftIcon, ChevronRightIcon, GalleryIcon } from "@/icons";
import { getGiveawayThumbnailOverlayLabel } from "@/lib/constants/giveaway";
import { cn } from "@/lib/utils/cn";
import type { GiveawayImage, GiveawayStatus } from "@/types/giveaway";

const SLIDE_TRANSLATE_CLASS = [
  "translate-x-0",
  "-translate-x-full",
  "-translate-x-[200%]",
  "-translate-x-[300%]",
  "-translate-x-[400%]",
] as const;

interface GiveawayDetailImageSliderProps {
  images: GiveawayImage[];
  status: GiveawayStatus;
}

const getGiveawaySlideLabel = (index: number, total: number) => {
  return `나눔 이미지 ${String(index + 1)}/${String(total)}`;
};

const GiveawayDetailImageSlider = ({ images, status }: GiveawayDetailImageSliderProps) => {
  const imageIdsKey = images.map((image) => String(image.id)).join(",");
  const [slide, setSlide] = useState({ imageIdsKey, currentIndex: 0 });

  if (slide.imageIdsKey !== imageIdsKey) {
    setSlide({ imageIdsKey, currentIndex: 0 });
  }

  const currentIndex = slide.imageIdsKey === imageIdsKey ? slide.currentIndex : 0;
  const overlayLabel = getGiveawayThumbnailOverlayLabel(status);
  const hasMultiple = images.length > 1;
  const safeIndex = Math.min(currentIndex, Math.max(images.length - 1, 0));
  const translateClass = SLIDE_TRANSLATE_CLASS[safeIndex] ?? "translate-x-0";
  const slideStatus = images.length > 0 ? getGiveawaySlideLabel(safeIndex, images.length) : "";

  const goToPrevious = () => {
    setSlide((current) => {
      const index = current.imageIdsKey === imageIdsKey ? current.currentIndex : 0;
      return {
        imageIdsKey,
        currentIndex: index === 0 ? images.length - 1 : index - 1,
      };
    });
  };

  const goToNext = () => {
    setSlide((current) => {
      const index = current.imageIdsKey === imageIdsKey ? current.currentIndex : 0;
      return {
        imageIdsKey,
        currentIndex: index === images.length - 1 ? 0 : index + 1,
      };
    });
  };

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="나눔 이미지"
      className="bg-background-muted rounded-6 relative aspect-square w-full overflow-hidden"
    >
      {images.length === 0 ? (
        <div className="flex size-full items-center justify-center">
          <GalleryIcon className="text-icon-subtle size-40" aria-hidden="true" />
        </div>
      ) : (
        <div className={cn("flex size-full transition-transform duration-300", translateClass)}>
          {images.map((image, index) => (
            <div
              key={image.id}
              className="relative size-full shrink-0"
              aria-hidden={index !== safeIndex}
            >
              <Image
                src={image.imageUrl}
                alt={getGiveawaySlideLabel(index, images.length)}
                fill
                sizes="(min-width: 1280px) 500px, (min-width: 768px) 268px, 90vw"
                className="object-cover"
                priority={index === 0}
              />
            </div>
          ))}
        </div>
      )}

      {slideStatus ? (
        <p className="sr-only" aria-live="polite" aria-atomic="true">
          {slideStatus}
        </p>
      ) : null}

      {overlayLabel ? (
        <div className="bg-overlay-card-disabled pointer-events-none absolute inset-0 flex items-center justify-center">
          <Text as="span" variant="2lg-semibold" className="text-text-inverse">
            {overlayLabel}
          </Text>
        </div>
      ) : null}

      {hasMultiple ? (
        <>
          <button
            type="button"
            aria-label="이전 이미지"
            onClick={goToPrevious}
            className="bg-background-default/80 hover:bg-background-muted focus-visible:ring-border-brand absolute top-1/2 left-12 flex size-36 -translate-y-1/2 items-center justify-center rounded-full focus-visible:ring-2 focus-visible:outline-none"
          >
            <ChevronLeftIcon className="text-icon-tartiary size-20" aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="다음 이미지"
            onClick={goToNext}
            className="bg-background-default/80 hover:bg-background-muted focus-visible:ring-border-brand absolute top-1/2 right-12 flex size-36 -translate-y-1/2 items-center justify-center rounded-full focus-visible:ring-2 focus-visible:outline-none"
          >
            <ChevronRightIcon className="text-icon-tartiary size-20" aria-hidden="true" />
          </button>
        </>
      ) : null}
    </div>
  );
};

export default GiveawayDetailImageSlider;
