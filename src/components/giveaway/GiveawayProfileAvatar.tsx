"use client";

import Image from "next/image";
import { useState } from "react";

import { ProfileDefaultIcon } from "@/icons";
import { cn } from "@/lib/utils/cn";
import { getGiveawayProfileImageSrc } from "@/lib/utils/giveawayProfileImage";

interface GiveawayProfileAvatarProps {
  imageUrl: string | null | undefined;
  className?: string;
  sizes?: string;
}

interface GiveawayProfileAvatarInnerProps {
  src: string;
  sizes: string;
}

const GiveawayProfileAvatarInner = ({ src, sizes }: GiveawayProfileAvatarInnerProps) => {
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

const GiveawayProfileAvatar = ({
  imageUrl,
  className,
  sizes = "56px",
}: GiveawayProfileAvatarProps) => {
  const src = getGiveawayProfileImageSrc(imageUrl);

  return (
    <div
      className={cn("bg-background-avatar rounded-20 relative shrink-0 overflow-hidden", className)}
    >
      {src ? (
        <GiveawayProfileAvatarInner key={src} src={src} sizes={sizes} />
      ) : (
        <ProfileDefaultIcon className="size-full" aria-hidden="true" />
      )}
    </div>
  );
};

export default GiveawayProfileAvatar;
