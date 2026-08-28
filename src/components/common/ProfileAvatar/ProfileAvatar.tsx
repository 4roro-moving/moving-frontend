import { ProfileImage } from "@/components/common/ProfileImage";
import { cn } from "@/lib/utils/cn";

interface ProfileAvatarProps {
  imageUrl: string | null | undefined;
  className?: string;
  imageClassName?: string;
  sizes?: string;
  alt?: string;
}

const ProfileAvatar = ({
  imageUrl,
  className,
  imageClassName = "object-cover",
  sizes = "56px",
  alt = "",
}: ProfileAvatarProps) => {
  return (
    <div
      className={cn("bg-background-avatar rounded-20 relative shrink-0 overflow-hidden", className)}
    >
      <ProfileImage src={imageUrl} alt={alt} fill sizes={sizes} className={imageClassName} />
    </div>
  );
};

export default ProfileAvatar;
