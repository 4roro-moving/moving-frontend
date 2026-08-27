"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";

import { GalleryIcon } from "@/icons";
import { cn } from "@/lib/utils/cn";
import { getAllowedImageSrc } from "@/lib/utils/safeImageSrc";

interface GiveawayThumbnailImageProps {
  src: string | null | undefined;
  alt?: string;
  sizes: string;
  className?: string;
  iconClassName?: string;
  preload?: boolean;
}

interface GiveawayThumbnailImageInnerProps extends Omit<GiveawayThumbnailImageProps, "src"> {
  src: string;
}

interface GiveawayThumbnailFallbackProps {
  iconClassName?: string;
  alt?: string;
}

const GiveawayThumbnailFallback = ({ iconClassName, alt = "" }: GiveawayThumbnailFallbackProps) => {
  const t = useTranslations("giveaway");

  return (
    <div className="flex size-full items-center justify-center">
      <GalleryIcon className={cn("text-icon-subtle size-40", iconClassName)} aria-hidden="true" />
      {alt ? <span className="sr-only">{t("imageLoadFailed", { alt })}</span> : null}
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
}: GiveawayThumbnailImageInnerProps) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return <GiveawayThumbnailFallback iconClassName={iconClassName} alt={alt} />;
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      preload={preload}
      className={cn("object-cover", className)}
      onError={() => setHasError(true)}
    />
  );
};

const GiveawayThumbnailImage = ({ src, ...props }: GiveawayThumbnailImageProps) => {
  const safeSrc = getAllowedImageSrc(src);

  if (!safeSrc) {
    return <GiveawayThumbnailFallback iconClassName={props.iconClassName} alt={props.alt} />;
  }

  return <GiveawayThumbnailImageInner key={safeSrc} src={safeSrc} {...props} />;
};

export default GiveawayThumbnailImage;
