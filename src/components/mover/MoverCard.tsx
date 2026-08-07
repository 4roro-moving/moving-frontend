"use client";

import Link from "next/link";
import { memo } from "react";

import Checkbox from "@/components/common/Checkbox/Checkbox";
import { Text } from "@/components/common/Text";
import { FavoriteButton } from "@/components/mover/FavoriteButton";
import { MoverMeta } from "@/components/mover/MoverMeta";
import { MoverProfileImage } from "@/components/mover/MoverProfileImage";
import { MoverServiceTypeChips } from "@/components/mover/MoverServiceTypeChips";
import { useFavoriteMover } from "@/hooks/useFavoriteMover";
import { DriverBadgeIcon } from "@/icons";
import { APP_ROUTES } from "@/lib/constants/appRoutes";
import { markInternalDetailNavigationOnClick } from "@/lib/utils/detailNavigation";
import { cn } from "@/lib/utils/cn";
import type { Mover } from "@/types/mover";

interface MoverCardSelection {
  checked: boolean;
  /** 카드가 mover.id를 넘겨 호출 — 부모는 안정적인 핸들러를 재사용 */
  onCheckedChange: (moverId: string, checked: boolean) => void;
}

interface MoverCardProps {
  mover: Mover;
  variant?: "full" | "compact";
  /** 기사님 찾기 첫 카드의 데스크톱 프로필 이미지 preload 여부 */
  priorityProfileImage?: boolean;
  className?: string;
  onFavoriteError?: (message: string) => void;
  /** 찜 목록 등에서 카드 선택용. 있으면 우상단 체크박스 표시 */
  selection?: MoverCardSelection;
}

function areSelectionPropsEqual(
  prev: MoverCardSelection | undefined,
  next: MoverCardSelection | undefined,
): boolean {
  if (prev === next) {
    return true;
  }
  if (!prev || !next) {
    return false;
  }
  return prev.checked === next.checked && prev.onCheckedChange === next.onCheckedChange;
}

function areMoverCardPropsEqual(prev: MoverCardProps, next: MoverCardProps): boolean {
  return (
    prev.mover === next.mover &&
    prev.variant === next.variant &&
    prev.priorityProfileImage === next.priorityProfileImage &&
    prev.className === next.className &&
    prev.onFavoriteError === next.onFavoriteError &&
    areSelectionPropsEqual(prev.selection, next.selection)
  );
}

function MoverCard({
  mover,
  variant = "full",
  priorityProfileImage = false,
  className,
  onFavoriteError,
  selection,
}: MoverCardProps) {
  const favoriteMutation = useFavoriteMover({ onError: onFavoriteError });

  const toggleFavorite = (nextIsFavorite: boolean) => {
    if (mover.isFavorite === nextIsFavorite) {
      return;
    }

    favoriteMutation.mutate({
      moverId: mover.id,
      nextIsFavorite,
    });
  };

  const favoriteButtonProps = {
    interactive: favoriteMutation.canToggleFavorite,
    moverName: mover.name,
    isFavorite: mover.isFavorite,
    favoriteCount: mover.favoriteCount,
    onToggle: toggleFavorite,
  };

  const detailHref = APP_ROUTES.MOVERS.DETAIL(mover.id);
  const detailLabel = `${mover.name} 기사님 상세 보기`;

  const selectionControl = selection ? (
    <div
      className="pointer-events-auto relative z-20"
      onClick={(event) => {
        event.stopPropagation();
      }}
      onPointerDown={(event) => {
        event.stopPropagation();
      }}
    >
      <Checkbox
        checked={selection.checked}
        onCheckedChange={(checked) => selection.onCheckedChange(mover.id, checked)}
        aria-label={`${mover.name} 기사님 선택`}
      />
    </div>
  ) : null;

  if (variant === "compact") {
    return (
      <article
        className={cn(
          "border-border-subtle bg-background-surface rounded-16 relative flex w-full flex-col gap-20 border-[0.5px] p-20",
          "shadow-[-2px_-2px_10px_0px_rgba(220,220,220,0.2),2px_2px_10px_0px_rgba(220,220,220,0.2)]",
          className,
        )}
      >
        <Link
          href={detailHref}
          onClick={(event) => markInternalDetailNavigationOnClick(event, detailHref)}
          aria-label={detailLabel}
          className="focus-visible:ring-border-brand rounded-16 absolute inset-0 z-0 focus-visible:ring-2 focus-visible:outline-none"
        />
        <div className="pointer-events-none relative z-10 flex flex-col gap-12">
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
                  <FavoriteButton
                    {...favoriteButtonProps}
                    className="pointer-events-auto justify-center gap-2"
                    iconClassName="size-20"
                  />
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
        "border-border-subtle bg-background-surface relative flex w-full flex-col border-[0.5px]",
        "rounded-16 gap-8 p-20",
        "md:rounded-20 md:gap-20 md:px-28 md:py-24",
        "shadow-[-2px_-2px_10px_0px_rgba(220,220,220,0.2),2px_2px_10px_0px_rgba(220,220,220,0.2)]",
        className,
      )}
    >
      <Link
        href={detailHref}
        onClick={(event) => markInternalDetailNavigationOnClick(event, detailHref)}
        aria-label={detailLabel}
        className="focus-visible:ring-border-brand rounded-16 md:rounded-20 absolute inset-0 z-0 focus-visible:ring-2 focus-visible:outline-none"
      />
      <div className="pointer-events-none relative z-10 flex flex-col gap-8 md:hidden">
        <div className="flex min-h-36 items-center justify-between gap-8">
          <MoverServiceTypeChips serviceTypes={mover.serviceTypes} size="sm" />
          {selectionControl}
        </div>

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
                <FavoriteButton
                  {...favoriteButtonProps}
                  showCount
                  className="pointer-events-auto justify-center gap-2"
                  iconClassName="size-24"
                />
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

      <div className="pointer-events-none relative z-10 hidden md:flex md:flex-col md:gap-20">
        <div className="flex min-h-36 items-center justify-between gap-8">
          <MoverServiceTypeChips serviceTypes={mover.serviceTypes} size="md" />
          {selectionControl}
        </div>

        <div className="flex flex-row items-start gap-20">
          <div className="bg-background-avatar rounded-12 relative size-[134px] shrink-0 overflow-hidden">
            <MoverProfileImage
              src={mover.profileImageSrc}
              width={192}
              height={192}
              preload={priorityProfileImage}
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

              <FavoriteButton
                {...favoriteButtonProps}
                showCount
                className="pointer-events-auto justify-center gap-2"
                iconClassName="size-24"
              />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default memo(MoverCard, areMoverCardPropsEqual);
