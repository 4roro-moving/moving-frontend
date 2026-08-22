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

const GiveawayDetailImageSlider = ({ images, status }: GiveawayDetailImageSliderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const overlayLabel = getGiveawayThumbnailOverlayLabel(status);
  const hasMultiple = images.length > 1;
  const safeIndex = Math.min(currentIndex, Math.max(images.length - 1, 0));
  const translateClass = SLIDE_TRANSLATE_CLASS[safeIndex] ?? "translate-x-0";

  const goToPrevious = () => {
    setCurrentIndex((current) => (current === 0 ? images.length - 1 : current - 1));
  };

  const goToNext = () => {
    setCurrentIndex((current) => (current === images.length - 1 ? 0 : current + 1));
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
            <div key={image.id} className="relative size-full shrink-0">
              <Image
                src={image.imageUrl}
                alt=""
                fill
                sizes="(min-width: 1280px) 500px, (min-width: 768px) 268px, 90vw"
                className="object-cover"
                priority={index === 0}
              />
            </div>
          ))}
        </div>
      )}

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
            className="bg-background-default/80 hover:bg-background-default focus-visible:ring-border-brand absolute top-1/2 left-12 flex size-36 -translate-y-1/2 items-center justify-center rounded-full focus-visible:ring-2 focus-visible:outline-none"
          >
            <ChevronLeftIcon className="text-icon-subtle size-20" aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="다음 이미지"
            onClick={goToNext}
            className="bg-background-default/80 hover:bg-background-default focus-visible:ring-border-brand absolute top-1/2 right-12 flex size-36 -translate-y-1/2 items-center justify-center rounded-full focus-visible:ring-2 focus-visible:outline-none"
          >
            <ChevronRightIcon className="text-icon-subtle size-20" aria-hidden="true" />
          </button>
        </>
      ) : null}
    </div>
  );
};

export default GiveawayDetailImageSlider;
