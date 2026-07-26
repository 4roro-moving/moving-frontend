import Image from "next/image";

import { DriverBadgeIcon, LikeIcon } from "@/icons";
import { cn } from "@/lib/utils/cn";
import type { Mover } from "@/types/mover";
import { Text } from "@/components/common/Text";
import { MoveTypeChip } from "@/components/estimate/received/MoveTypeChip";

import MoverMeta from "./MoverMeta";

interface MoverCardProps {
  mover: Mover;
  variant?: "full" | "compact";
  className?: string;
}

export default function MoverCard({ mover, variant = "full", className }: MoverCardProps) {
  if (variant === "compact") {
    return (
      <article
        className={cn(
          "border-border-subtle bg-background-surface rounded-16 flex w-full flex-col gap-20 border-[0.5px] p-20",
          "shadow-[-2px_-2px_10px_0px_rgba(220,220,220,0.2),2px_2px_10px_0px_rgba(220,220,220,0.2)]",
          className,
        )}
      >
        <div className="flex flex-col gap-12">
          <MoveTypeChip moveType={mover.serviceType} size="sm" />
          <div className="flex flex-col gap-16">
            <Text as="h3" variant="lg-semibold" className="text-text-secondary">
              {mover.title}
            </Text>
            <div className="flex items-center gap-8">
              <div className="bg-background-avatar rounded-12 relative size-48 shrink-0 overflow-hidden">
                <Image
                  src={mover.profileImageSrc}
                  alt=""
                  width={75}
                  height={75}
                  className="absolute top-[-7px] left-[-12px] size-[75px] max-w-none object-cover"
                />
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-4">
                    <DriverBadgeIcon className="h-[18.2px] w-16 shrink-0" />

                    <Text as="span" variant="md-semibold" className="text-text-secondary">
                      {mover.name} 기사님
                    </Text>
                  </div>
                  <button
                    type="button"
                    className="cursor-pointer"
                    aria-label={mover.isFavorite ? "찜 해제" : "찜하기"}
                    aria-pressed={mover.isFavorite}
                  >
                    <LikeIcon
                      isFavorite={mover.isFavorite}
                      className={cn(
                        "size-20",
                        mover.isFavorite ? "text-like-active-fill" : "text-like-default-stroke",
                      )}
                    />
                  </button>
                </div>
                <MoverMeta
                  rating={mover.rating}
                  reviewCount={mover.reviewCount}
                  careerYears={mover.careerYears}
                  confirmedCount={mover.confirmedCount}
                />
              </div>
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      className={cn(
        "border-border-subtle bg-background-surface rounded-20 flex w-full flex-col gap-20 border-[0.5px] px-20 py-20 min-[744px]:px-28 min-[744px]:py-24",
        "shadow-[-2px_-2px_10px_0px_rgba(220,220,220,0.2),2px_2px_10px_0px_rgba(220,220,220,0.2)]",
        className,
      )}
    >
      <div className="flex min-h-32 items-center">
        <MoveTypeChip moveType={mover.serviceType} size="md" />
      </div>

      <div className="flex flex-col items-start gap-16 min-[744px]:flex-row min-[744px]:gap-20">
        <div className="bg-background-avatar rounded-12 relative size-80 shrink-0 overflow-hidden min-[744px]:size-[134px]">
          <Image
            src={mover.profileImageSrc}
            alt=""
            width={192}
            height={192}
            className="absolute top-[-10px] left-[-18px] size-[120px] max-w-none object-cover min-[744px]:top-[-16px] min-[744px]:left-[-29px] min-[744px]:size-[192px]"
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-16 self-stretch py-0 min-[744px]:gap-20 min-[744px]:py-4">
          <div className="flex flex-col">
            <Text as="h3" variant="xl-semibold" className="text-text-secondary">
              {mover.title}
            </Text>
            <Text
              as="p"
              variant="md-regular"
              className="text-text-muted line-clamp-2 overflow-hidden text-ellipsis min-[744px]:line-clamp-1"
            >
              {mover.description}
            </Text>
          </div>

          <div className="flex items-end justify-between gap-12">
            <div className="flex min-w-0 flex-col gap-4">
              <div className="flex items-center gap-4">
                <DriverBadgeIcon className="h-[23px] w-20 shrink-0 -translate-y-px" />
                <Text as="span" variant="lg-semibold" className="text-text-secondary">
                  {mover.name}
                </Text>
                <Text as="span" variant="lg-semibold" className="text-text-secondary">
                  기사님
                </Text>
              </div>
              <MoverMeta
                rating={mover.rating}
                reviewCount={mover.reviewCount}
                careerYears={mover.careerYears}
                confirmedCount={mover.confirmedCount}
                className="gap-8"
              />
            </div>

            <div className="flex shrink-0 items-center justify-center gap-2">
              <button
                type="button"
                className="cursor-pointer"
                aria-label={mover.isFavorite ? "찜 해제" : "찜하기"}
                aria-pressed={mover.isFavorite}
              >
                <LikeIcon
                  isFavorite={mover.isFavorite}
                  className={cn(
                    "size-24",
                    mover.isFavorite ? "text-like-active-fill" : "text-like-default-stroke",
                  )}
                />
              </button>
              <Text as="span" variant="md-regular" className="text-text-muted">
                {mover.favoriteCount}
              </Text>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
