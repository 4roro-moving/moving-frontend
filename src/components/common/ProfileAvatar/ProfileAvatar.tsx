"use client";

import Image from "next/image";
import { useState } from "react";

import { ProfileDefaultIcon } from "@/icons";
import { cn } from "@/lib/utils/cn";
import { getAllowedImageSrc } from "@/lib/utils/safeImageSrc";

interface ProfileAvatarProps {
  imageUrl: string | null | undefined;
  className?: string;
  sizes?: string;
}

interface ProfileAvatarInnerProps {
  src: string;
  sizes: string;
}

const ProfileAvatarInner = ({ src, sizes }: ProfileAvatarInnerProps) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return <ProfileDefaultIcon className="size-full" aria-hidden="true" />;
  }

  return (
    <Image
      src={src}
      alt=""
      fill
      sizes={sizes}
      className="object-cover"
      onError={() => setHasError(true)}
    />
  );
};

const ProfileAvatar = ({ imageUrl, className, sizes = "56px" }: ProfileAvatarProps) => {
  const src = getAllowedImageSrc(imageUrl);

  return (
    <div
      className={cn("bg-background-avatar rounded-20 relative shrink-0 overflow-hidden", className)}
    >
      {src ? (
        <ProfileAvatarInner key={src} src={src} sizes={sizes} />
      ) : (
        <ProfileDefaultIcon className="size-full" aria-hidden="true" />
      )}
    </div>
  );
};

export default ProfileAvatar;
