import { Text } from "@/components/common/Text";
import { cn } from "@/lib/utils/cn";

interface ProfilePageHeaderProps {
  title: string;
  description: string;
  className?: string;
}

/** 프로필 등록·수정 페이지 상단 타이틀 영역 */
const ProfilePageHeader = ({ title, description, className }: ProfilePageHeaderProps) => {
  return (
    <header className={cn("flex w-full flex-col gap-16 md:gap-28", className)}>
      <div className="flex flex-col gap-8 md:gap-16">
        <Text
          as="h1"
          variant={{ base: "2lg-semibold", md: "3xl-semibold" }}
          className="text-text-secondary"
        >
          {title}
        </Text>
        <Text
          as="p"
          variant={{ base: "xs-regular", md: "xl-regular" }}
          className="text-text-description"
        >
          {description}
        </Text>
      </div>
      <div className="border-border-subtle w-full border-b" aria-hidden="true" />
    </header>
  );
};

export default ProfilePageHeader;
