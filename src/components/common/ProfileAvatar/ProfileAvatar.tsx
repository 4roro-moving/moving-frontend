"use client";

import Image from "next/image";
import { useState } from "react";

import { cn } from "@/lib/utils/cn";
import { DEFAULT_PROFILE_IMAGE, getAllowedImageSrc } from "@/lib/utils/safeImageSrc";

interface ProfileAvatarProps {
  imageUrl: string | null | undefined;
  className?: string;
  sizes?: string;
  alt?: string;
}

interface ProfileAvatarInnerProps {
  src: string;
  sizes: string;
  alt: string;
}

const ProfileAvatarInner = ({ src, sizes, alt }: ProfileAvatarInnerProps) => {
  const [hasError, setHasError] = useState(false);
  const currentSrc = hasError ? DEFAULT_PROFILE_IMAGE : src;

  return (
    <Image
      src={currentSrc}
      alt={alt}
      fill
      sizes={sizes}
      className="object-cover"
      onError={() => {
        if (currentSrc !== DEFAULT_PROFILE_IMAGE) {
          setHasError(true);
        }
      }}
    />
  );
};

const ProfileAvatar = ({ imageUrl, className, sizes = "56px", alt = "" }: ProfileAvatarProps) => {
  const src = getAllowedImageSrc(imageUrl) ?? DEFAULT_PROFILE_IMAGE;

  return (
    <div
      className={cn("bg-background-avatar rounded-20 relative shrink-0 overflow-hidden", className)}
    >
      <ProfileAvatarInner key={src} src={src} sizes={sizes} alt={alt} />
    </div>
  );
};

export default ProfileAvatar;
