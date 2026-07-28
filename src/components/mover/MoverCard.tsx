"use client";

import { Text } from "@/components/common/Text";
import { MoveTypeChip } from "@/components/estimate/received/MoveTypeChip";
import { useFavoriteMover } from "@/hooks/useFavoriteMover";
import { DriverBadgeIcon, LikeIcon } from "@/icons";
import { cn } from "@/lib/utils/cn";
import type { Mover } from "@/types/mover";
import type { MoveType } from "@/types/move";

import MoverMeta from "./MoverMeta";
import { MoverProfileImage } from "./MoverProfileImage";

interface MoverCardProps {
  mover: Mover;
  variant?: "full" | "compact";
  className?: string;
  onFavoriteError?: (message: string) => void;
}

interface MoverServiceTypeChipsProps {
  serviceTypes: MoveType[];
  size: "sm" | "md";
  className?: string;
}

/** Figma desktop: gap 12. compact·좁은 카드(sm 칩)는 더 촘촘하게 */
function MoverServiceTypeChips({ serviceTypes, size, className }: MoverServiceTypeChipsProps) {
  return (
    <ul
      className={cn("flex flex-wrap items-start", size === "sm" ? "gap-8" : "gap-12", className)}
      aria-label="제공 이사 유형"
    >
      {serviceTypes.map((moveType) => (
        <li key={moveType}>
          <MoveTypeChip moveType={moveType} size={size} />
        </li>
      ))}
    </ul>
  );
}

interface FavoriteButtonProps {
  moverName: string;
  isFavorite: boolean;
  favoriteCount?: number;
  showCount?: boolean;
  iconClassName: string;
  onToggle: (nextIsFavorite: boolean) => void;
}

function FavoriteButton({
  moverName,
  isFavorite,
  favoriteCount,
  showCount,
  iconClassName,
  onToggle,
}: FavoriteButtonProps) {
  return (
    <div className="flex shrink-0 items-center justify-center gap-2">
      <button
        type="button"
        className="focus-visible:ring-border-brand rounded-8 cursor-pointer focus-visible:ring-2 focus-visible:outline-none"
        aria-label={`${moverName} 기사님 찜하기`}
        aria-pressed={isFavorite}
        onClick={() => onToggle(!isFavorite)}
      >
        <LikeIcon
          isFavorite={isFavorite}
          className={cn(
            iconClassName,
            isFavorite ? "text-like-active-fill" : "text-like-default-stroke",
          )}
        />
      </button>
      {showCount && favoriteCount !== undefined ? (
        <Text as="span" variant="md-regular" className="text-text-muted">
          <span aria-hidden="true">{favoriteCount}</span>
          <span className="sr-only">현재 찜 {favoriteCount}개</span>
        </Text>
      ) : null}
    </div>
  );
}

export default function MoverCard({
  mover,
  variant = "full",
  className,
  onFavoriteError,
}: MoverCardProps) {
  const favoriteMutation = useFavoriteMover({ onError: onFavoriteError });

  const toggleFavorite = (nextIsFavorite: boolean) => {
    if (favoriteMutation.isPending || mover.isFavorite === nextIsFavorite) {
      return;
    }

    favoriteMutation.mutate({
      moverId: mover.id,
      nextIsFavorite,
    });
  };

  const favoriteButtonProps = {
    moverName: mover.name,
    isFavorite: mover.isFavorite,
    favoriteCount: mover.favoriteCount,
    onToggle: toggleFavorite,
  };

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
          <MoverServiceTypeChips serviceTypes={mover.serviceTypes} size="sm" />
          <div className="flex flex-col gap-16">
            <Text as="h3" variant="lg-semibold" className="text-text-secondary">
              {mover.title}
            </Text>
            <div className="flex items-center gap-8">
              <div className="bg-background-avatar rounded-12 relative size-48 shrink-0 overflow-hidden">
                <MoverProfileImage
                  src={mover.profileImageSrc}
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
                  <FavoriteButton {...favoriteButtonProps} iconClassName="size-20" />
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
        "border-border-subtle bg-background-surface flex w-full flex-col border-[0.5px]",
        "rounded-16 gap-8 p-20",
        "min-[744px]:rounded-20 min-[744px]:gap-20 min-[744px]:px-28 min-[744px]:py-24",
        "shadow-[-2px_-2px_10px_0px_rgba(220,220,220,0.2),2px_2px_10px_0px_rgba(220,220,220,0.2)]",
        className,
      )}
    >
      <div className="flex flex-col gap-8 min-[744px]:hidden">
        <MoverServiceTypeChips serviceTypes={mover.serviceTypes} size="sm" />

        <div className="flex w-full flex-col gap-16">
          <div className="flex flex-col">
            <Text as="h3" variant="lg-semibold" className="text-text-secondary">
              {mover.title}
            </Text>
            <Text
              as="p"
              variant="sm-medium"
              className="text-text-muted line-clamp-2 overflow-hidden text-ellipsis"
            >
              {mover.description}
            </Text>
          </div>

          <div className="bg-border-subtle h-px w-full" aria-hidden="true" />

          <div className="flex items-center gap-8">
            <div className="bg-background-avatar rounded-12 relative size-50 shrink-0 overflow-hidden">
              <MoverProfileImage
                src={mover.profileImageSrc}
                width={75}
                height={75}
                className="absolute top-[-7px] left-[-12.5px] size-[75px] max-w-none object-cover"
              />
            </div>

            <div className="flex min-w-0 flex-1 flex-col gap-4">
              <div className="flex w-full items-center justify-between gap-8">
                <div className="flex min-w-0 items-center gap-4">
                  <DriverBadgeIcon className="h-[23px] w-20 shrink-0 -translate-y-px" />
                  <Text as="span" variant="md-semibold" className="text-text-secondary">
                    {mover.name}
                  </Text>
                  <Text as="span" variant="md-semibold" className="text-text-secondary">
                    기사님
                  </Text>
                </div>
                <FavoriteButton {...favoriteButtonProps} showCount iconClassName="size-24" />
              </div>

              <MoverMeta
                rating={mover.rating}
                reviewCount={mover.reviewCount}
                careerYears={mover.careerYears}
                confirmedCount={mover.confirmedCount}
                className="gap-8"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="hidden min-[744px]:contents">
        <div className="flex min-h-32 items-center">
          <MoverServiceTypeChips serviceTypes={mover.serviceTypes} size="md" />
        </div>

        <div className="flex flex-row items-start gap-20">
          <div className="bg-background-avatar rounded-12 relative size-[134px] shrink-0 overflow-hidden">
            <MoverProfileImage
              src={mover.profileImageSrc}
              width={192}
              height={192}
              className="absolute top-[-16px] left-[-29px] size-[192px] max-w-none object-cover"
            />
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-20 self-stretch py-4">
            <div className="flex flex-col">
              <Text as="h3" variant="xl-semibold" className="text-text-secondary">
                {mover.title}
              </Text>
              <Text
                as="p"
                variant="md-regular"
                className="text-text-muted line-clamp-1 overflow-hidden text-ellipsis"
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

              <FavoriteButton {...favoriteButtonProps} showCount iconClassName="size-24" />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
