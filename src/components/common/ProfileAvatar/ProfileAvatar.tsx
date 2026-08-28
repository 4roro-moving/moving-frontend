import { ProfileImage } from "@/components/common/ProfileImage";
import { cn } from "@/lib/utils/cn";

interface ProfileAvatarProps {
  imageUrl: string | null | undefined;
  className?: string;
  imageClassName?: string;
  sizes?: string;
  alt?: string;
  preload?: boolean;
}

const ProfileAvatar = ({
  imageUrl,
  className,
  imageClassName = "object-cover",
  sizes = "56px",
  alt = "",
  preload = false,
}: ProfileAvatarProps) => {
  return (
    <div className={cn("bg-background-avatar relative shrink-0 overflow-hidden", className)}>
      <ProfileImage
        src={imageUrl}
        alt={alt}
        fill
        sizes={sizes}
        preload={preload}
        className={imageClassName}
      />
    </div>
  );
};

export default ProfileAvatar;
