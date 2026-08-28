"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { useState } from "react";

import Button from "@/components/common/Button/Button";
import Input from "@/components/common/Input/Input";
import { ProfileImage } from "@/components/common/ProfileImage";
import Select from "@/components/common/Select/Select";
import { Skeleton } from "@/components/common/Skeleton/Skeleton";
import { Text } from "@/components/common/Text";
import AddressSelectModal from "@/components/estimate/request/AddressSelectModal";
import { MoverServiceTypeChips } from "@/components/mover/MoverServiceTypeChips";
import KakaoMap from "@/components/mover/map/KakaoMap";
import { type MoverRecommendation, useMoverRecommendations } from "@/hooks/useMoverRecommendations";
import { useRecommendationRegionIds } from "@/hooks/useRecommendationRegionIds";
import { DriverBadgeIcon, StarIcon } from "@/icons";
import { ADDRESS_DIRECTION, type AddressDirection } from "@/lib/constants/address";
import { APP_ROUTES } from "@/lib/constants/appRoutes";
import type { AddressSearchItem } from "@/lib/kakao/addressSearch";
import type { MoveType } from "@/types/move";

type MoveTypeFilter = "ALL" | MoveType; //이사 유형 필터

//기사 표시 카드
function RecommendationCard({ mover }: { mover: MoverRecommendation }) {
  const t = useTranslations("moverRecommendation");

  return (
    <article className="rounded-16 bg-background-surface border-border-subtle border p-16 shadow-[-2px_-2px_10px_0_rgba(220,220,220,0.2),2px_2px_10px_0_rgba(220,220,220,0.2)]">
      <div>
        <div className="mb-12 flex items-center justify-between gap-8">
          {/* 실제 서비스 유형 */}
          <MoverServiceTypeChips serviceTypes={mover.serviceTypes} size="sm" />
          <span className="text-text-brand text-[12px] font-semibold">
            {t(`match.${mover.matchType}`)}
          </span>
        </div>

        <Text as="h3" variant="lg-semibold" className="text-text-secondary mb-12 line-clamp-1">
          {mover.title}
        </Text>

        <div className="flex items-center gap-12">
          <div className="bg-background-avatar rounded-12 relative size-56 shrink-0 overflow-hidden">
            {/* 실제 프로필 이미지 */}
            <ProfileImage
              src={mover.profileImageSrc}
              width={88}
              height={88}
              className="size-full object-contain"
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="mb-4 flex items-center gap-4">
              <DriverBadgeIcon className="h-20 w-18 shrink-0" />
              <Text as="span" variant="md-semibold" className="text-text-secondary">
                {t("moverName", { name: mover.name })}
              </Text>
            </div>
            <div className="text-text-muted flex flex-wrap items-center gap-6 text-[13px]">
              <span className="text-text-secondary flex items-center gap-2 font-medium">
                <StarIcon className="size-16" /> {mover.rating.toFixed(1)}
              </span>
              <span>({mover.reviewCount})</span>
              <span aria-hidden="true">·</span>
              <span>{t("careerYears", { count: mover.careerYears })}</span>
              <span aria-hidden="true">·</span>
              <span>{t("confirmedCount", { count: mover.confirmedCount })}</span>
            </div>
          </div>
        </div>
      </div>

      <Link
        href={APP_ROUTES.MOVERS.DETAIL(mover.id)}
        className="border-border-default text-text-secondary rounded-12 hover:bg-background-hover mt-14 flex h-40 w-full items-center justify-center border text-[14px] font-semibold"
      >
        {t("viewProfile")}
      </Link>
    </article>
  );
}

export function MoverRecommendationMapPage() {
  const t = useTranslations("moverRecommendation");
  const tMoverSearch = useTranslations("moverSearch");

  const [departure, setDeparture] = useState<AddressSearchItem | null>(null);
  const [destination, setDestination] = useState<AddressSearchItem | null>(null);
  const [moveType, setMoveType] = useState<MoveTypeFilter>("ALL");

  const [searchedDeparture, setSearchedDeparture] = useState<AddressSearchItem | null>(null);
  const [searchedDestination, setSearchedDestination] = useState<AddressSearchItem | null>(null);
  const [searchedMoveType, setSearchedMoveType] = useState<MoveTypeFilter>("ALL");

  const [addressModalKind, setAddressModalKind] = useState<AddressDirection | null>(null);
  //검색 여부
  const hasSearched = searchedDeparture !== null && searchedDestination !== null;

  const {
    departureRegionId,
    destinationRegionId,
    isLoading: isRegionLoading,
    isError: isRegionError,
    refetch: refetchRegions,
  } = useRecommendationRegionIds(searchedDeparture, searchedDestination);

  //실제 기사 조회
  const {
    movers,
    isLoading: isMoverLoading,
    isError: isMoverError,
    refetch,
  } = useMoverRecommendations({
    departureRegionId,
    destinationRegionId,
    ...(searchedMoveType !== "ALL" ? { moveType: searchedMoveType } : {}),
  });
  const isLoading = isRegionLoading || isMoverLoading;
  const isError = isRegionError || isMoverError;

  //검색 버튼 클릭 시 현재 입력값을 검색 조건으로 확정
  function handleSearch() {
    if (!departure || !destination) return;

    setSearchedDeparture(departure);
    setSearchedDestination(destination);
    setSearchedMoveType(moveType);
  }

  //주소 선택 시 현재 모달 종류에 따라 출발지 또는 도착지에 저장
  function handleAddressConfirm(address: AddressSearchItem) {
    if (addressModalKind === ADDRESS_DIRECTION.FROM) {
      setDeparture(address);
    } else if (addressModalKind === ADDRESS_DIRECTION.TO) {
      setDestination(address);
    }

    setAddressModalKind(null);
  }

  return (
    <main className="bg-background-surface flex min-h-[calc(100dvh-var(--gnb-height-mobile)-var(--tab-height-mobile))] flex-col lg:h-[calc(100dvh-var(--gnb-height-tablet)-var(--tab-height-tablet))] lg:min-h-0 lg:overflow-hidden xl:h-[calc(100dvh-var(--gnb-height-desktop)-var(--tab-height-desktop))]">
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row lg:overflow-hidden">
        <aside className="border-border-subtle z-10 flex w-full shrink-0 flex-col border-b bg-white lg:h-full lg:w-[430px] lg:overflow-hidden lg:border-r lg:border-b-0">
          <div className="border-border-subtle shrink-0 border-b p-24 lg:p-28">
            <Text as="h1" variant="2xl-semibold" className="text-text-secondary mb-8">
              {t("title")}
            </Text>
            <Text as="p" variant="sm-medium" className="text-text-muted mb-24">
              {t("description")}
            </Text>

            <div className="flex flex-col gap-12">
              <Input
                readOnly
                value={departure?.roadAddress ?? ""}
                onClick={() => setAddressModalKind(ADDRESS_DIRECTION.FROM)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setAddressModalKind(ADDRESS_DIRECTION.FROM);
                  }
                }}
                placeholder={t("departurePlaceholder")}
                aria-label={t("departure")}
                aria-haspopup="dialog"
                leftSlot={
                  <span className="bg-text-secondary flex size-24 shrink-0 items-center justify-center rounded-full text-[12px] font-bold text-white">
                    {t("departureShort")}
                  </span>
                }
              />
              <Input
                readOnly
                value={destination?.roadAddress ?? ""}
                onClick={() => setAddressModalKind(ADDRESS_DIRECTION.TO)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setAddressModalKind(ADDRESS_DIRECTION.TO);
                  }
                }}
                placeholder={t("destinationPlaceholder")}
                aria-label={t("destination")}
                aria-haspopup="dialog"
                leftSlot={
                  <span className="bg-background-brand flex size-24 shrink-0 items-center justify-center rounded-full text-[12px] font-bold text-white">
                    {t("destinationShort")}
                  </span>
                }
              />
              <Select
                desc={t("allMoveTypes")}
                label={t("moveType")}
                defaultValue={moveType}
                placeholderValue="ALL"
                onChange={(value) => setMoveType(value as MoveTypeFilter)}
                className="w-full [&>button]:w-full"
              >
                <Select.Option value="ALL">{t("allMoveTypes")}</Select.Option>
                <Select.Option value="SMALL">{tMoverSearch("moveTypes.SMALL")}</Select.Option>
                <Select.Option value="HOME">{tMoverSearch("moveTypes.HOME")}</Select.Option>
                <Select.Option value="OFFICE">{tMoverSearch("moveTypes.OFFICE")}</Select.Option>
              </Select>
              <Button
                size="cta"
                fullWidth
                disabled={!departure || !destination}
                onClick={handleSearch}
              >
                {t("search")}
              </Button>
            </div>
          </div>

          <div className="flex min-h-0 flex-1 flex-col p-24 lg:overflow-y-auto lg:overscroll-contain lg:p-20">
            <div className="mb-16 flex items-end justify-between gap-12">
              <div>
                <Text as="h2" variant="xl-semibold" className="text-text-secondary">
                  {t("recommendedCount", { count: movers.length })}
                </Text>
                <Text as="p" variant="sm-medium" className="text-text-muted mt-2">
                  {t("sortDescription")}
                </Text>
              </div>
            </div>

            <div className="rounded-12 mb-16 flex min-h-60 flex-col justify-center gap-2 bg-[#fff6f3] px-14 py-10 text-[12px] leading-[18px] text-[#8a4a3d]">
              <span className="block">{t("serviceRegionNotice")}</span>
              <span className="block">{t("availabilityNotice")}</span>
            </div>

            {!hasSearched ? (
              <div className="text-text-muted rounded-16 border-border-subtle flex min-h-160 items-center justify-center border px-20 text-center text-[14px]">
                {t("searchPrompt")}
              </div>
            ) : isLoading ? (
              <div role="status" className="flex flex-col gap-12" aria-label={t("loading")}>
                {Array.from({ length: 3 }, (_, index) => (
                  <Skeleton key={index} className="rounded-16 h-176 w-full" />
                ))}
              </div>
            ) : isError ? (
              <div
                role="alert"
                className="rounded-16 border-border-subtle flex min-h-160 flex-col items-center justify-center gap-12 border px-20 text-center"
              >
                <Text as="p" variant="sm-medium" className="text-text-error">
                  {isRegionError ? t("regionLoadFailed") : t("moversLoadFailed")}
                </Text>
                <button
                  type="button"
                  className="text-text-brand text-[14px] font-semibold"
                  onClick={() => void (isRegionError ? refetchRegions() : refetch())}
                >
                  {t("retry")}
                </button>
              </div>
            ) : departureRegionId === null || destinationRegionId === null ? (
              <div className="text-text-error rounded-16 border-border-subtle flex min-h-160 items-center justify-center border px-20 text-center text-[14px]">
                {t("regionUnavailable")}
              </div>
            ) : movers.length > 0 ? (
              <div className="flex flex-col gap-12">
                {movers.map((mover) => (
                  <RecommendationCard key={mover.id} mover={mover} />
                ))}
              </div>
            ) : (
              <div className="text-text-muted rounded-16 border-border-subtle flex min-h-160 items-center justify-center border text-center text-[14px]">
                {t("empty")}
              </div>
            )}
          </div>
        </aside>

        {/* 실제 지도 표시 - key에 두 주소 ID를 넣어서 주소 변경시 카카오 맵 새로 생성 */}
        {searchedDeparture && searchedDestination ? (
          <KakaoMap
            key={`${searchedDeparture.id}-${searchedDestination.id}`}
            departure={searchedDeparture} //출발지
            destination={searchedDestination} //도착지
            movers={movers} //기사 마커
          />
        ) : (
          <KakaoMap />
        )}
      </div>

      {addressModalKind && (
        <AddressSelectModal
          open
          kind={addressModalKind === ADDRESS_DIRECTION.FROM ? t("departure") : t("destination")}
          onClose={() => setAddressModalKind(null)}
          onConfirm={handleAddressConfirm}
        />
      )}
    </main>
  );
}
