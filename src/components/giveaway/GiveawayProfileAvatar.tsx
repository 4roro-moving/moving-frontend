import Image from "next/image";

import { ProfileDefaultIcon } from "@/icons";
import { cn } from "@/lib/utils/cn";
import { getGiveawayProfileImageSrc } from "@/lib/utils/giveawayProfileImage";

interface GiveawayProfileAvatarProps {
  imageUrl: string | null | undefined;
  className?: string;
  sizes?: string;
}

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
        <Image src={src} alt="" fill sizes={sizes} className="object-cover" />
      ) : (
        <ProfileDefaultIcon className="size-full" aria-hidden="true" />
      )}
    </div>
  );
};

export default GiveawayProfileAvatar;
