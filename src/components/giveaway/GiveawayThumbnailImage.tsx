"use client";

import Image from "next/image";
import { useState } from "react";

import { GalleryIcon } from "@/icons";
import { cn } from "@/lib/utils/cn";
import { getGiveawaySafeImageSrc } from "@/lib/utils/giveawayProfileImage";

interface GiveawayThumbnailImageProps {
  src: string | null | undefined;
  alt?: string;
  sizes: string;
  className?: string;
  iconClassName?: string;
  preload?: boolean;
  priority?: boolean;
}

interface GiveawayThumbnailImageInnerProps extends Omit<GiveawayThumbnailImageProps, "src"> {
  src: string;
}

const GiveawayThumbnailFallback = ({ iconClassName }: { iconClassName?: string }) => {
  return (
    <div className="flex size-full items-center justify-center">
      <GalleryIcon className={cn("text-icon-subtle size-40", iconClassName)} aria-hidden="true" />
    </div>
  );
};

const GiveawayThumbnailImageInner = ({
  src,
  alt = "",
  sizes,
  className,
  iconClassName,
  preload = false,
  priority = false,
}: GiveawayThumbnailImageInnerProps) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return <GiveawayThumbnailFallback iconClassName={iconClassName} />;
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      preload={preload}
      priority={priority}
      className={cn("object-cover", className)}
      onError={() => setHasError(true)}
    />
  );
};

const GiveawayThumbnailImage = ({ src, ...props }: GiveawayThumbnailImageProps) => {
  const safeSrc = getGiveawaySafeImageSrc(src);

  if (!safeSrc) {
    return <GiveawayThumbnailFallback iconClassName={props.iconClassName} />;
  }

  return <GiveawayThumbnailImageInner key={safeSrc} src={safeSrc} {...props} />;
};

export default GiveawayThumbnailImage;
