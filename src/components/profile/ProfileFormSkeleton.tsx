import { Skeleton } from "@/components/common/Skeleton/Skeleton";
import ProfilePageHeader from "@/components/profile/ProfilePageHeader";
import { cn } from "@/lib/utils/cn";

interface ProfileFormSkeletonProps {
  title: string;
  description?: string;
  /** customer create: single, 그 외: twoColumn */
  layout?: "single" | "twoColumn";
}

const FieldSkeleton = () => (
  <div className="flex w-full flex-col gap-12">
    <Skeleton className="h-20 w-80" />
    <Skeleton className="rounded-16 h-64 w-full" />
  </div>
);

/** 프로필 등록·수정 로딩 스켈레톤 (헤더는 실제 타이틀 유지) */
const ProfileFormSkeleton = ({
  title,
  description,
  layout = "twoColumn",
}: ProfileFormSkeletonProps) => {
  return (
    <div
      className={cn(
        "px-margin-mobile mx-auto flex w-full flex-col gap-40 py-32 md:gap-48 md:px-72 md:py-40 lg:px-0 lg:pt-56 lg:pb-70",
        layout === "single" ? "max-w-[640px]" : "max-w-[1120px]",
      )}
      aria-busy="true"
      aria-live="polite"
    >
      <ProfilePageHeader title={title} description={description} />

      <span className="sr-only">불러오는 중입니다.</span>

      {layout === "single" ? (
        <div className="flex w-full flex-col gap-32">
          <FieldSkeleton />
          <FieldSkeleton />
          <FieldSkeleton />
          <Skeleton className="rounded-16 h-64 w-full" />
        </div>
      ) : (
        <>
          <div className="flex w-full flex-col gap-32 lg:flex-row lg:items-start lg:justify-between lg:gap-[120px]">
            <div className="flex w-full flex-col gap-32 lg:w-[500px]">
              <FieldSkeleton />
              <FieldSkeleton />
              <FieldSkeleton />
            </div>
            <div className="flex w-full flex-col gap-32 lg:w-[500px]">
              <FieldSkeleton />
              <FieldSkeleton />
              <FieldSkeleton />
            </div>
          </div>
          <div className="flex w-full flex-col-reverse gap-8 md:flex-row md:justify-end md:gap-20">
            <Skeleton className="rounded-16 h-64 w-full md:w-[240px]" />
            <Skeleton className="rounded-16 h-64 w-full md:w-[240px]" />
          </div>
        </>
      )}
    </div>
  );
};

export default ProfileFormSkeleton;
