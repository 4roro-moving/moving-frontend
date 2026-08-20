"use client";

import Link from "next/link";
import { useState } from "react";

import Button from "@/components/common/Button/Button";
import Input from "@/components/common/Input/Input";
import Select from "@/components/common/Select/Select";
import { Skeleton } from "@/components/common/Skeleton/Skeleton";
import { Text } from "@/components/common/Text";
import AddressSelectModal from "@/components/estimate/request/AddressSelectModal";
import { MoverProfileImage } from "@/components/mover/MoverProfileImage";
import { MoverServiceTypeChips } from "@/components/mover/MoverServiceTypeChips";
import KakaoMap from "@/components/mover/map/KakaoMap";
import {
  type MoverRecommendation,
  type MoverRecommendationMatchType,
  useMoverRecommendations,
} from "@/hooks/useMoverRecommendations";
import { DriverBadgeIcon, StarIcon } from "@/icons";
import { APP_ROUTES } from "@/lib/constants/appRoutes";
import { getRegionIdBySido } from "@/lib/constants/region";
import type { AddressSearchItem } from "@/lib/kakao/addressSearch";
import type { MoveType } from "@/types/move";

type AddressModalKind = "출발지" | "도착지"; // 모달 종류
type MoveTypeFilter = "ALL" | MoveType; //이사 유형 필터

const MATCH_LABEL: Record<MoverRecommendationMatchType, string> = {
  BOTH: "출발지·도착지 모두 가능",
  DEPARTURE: "출발지 지역 서비스",
  DESTINATION: "도착지 지역 서비스",
}; // 서버에서 받아오는 값 아니고 useMoverRecommendations에서 API 비교 후 생성

//기사 표시 카드
function RecommendationCard({ mover }: { mover: MoverRecommendation }) {
  return (
    <article className="rounded-16 bg-background-surface border-border-subtle border p-16 shadow-[-2px_-2px_10px_0_rgba(220,220,220,0.2),2px_2px_10px_0_rgba(220,220,220,0.2)]">
      <div>
        <div className="mb-12 flex items-center justify-between gap-8">
          {/* 실제 서비스 유형 */}
          <MoverServiceTypeChips serviceTypes={mover.serviceTypes} size="sm" />
          <span className="text-text-brand text-[12px] font-semibold">
            {MATCH_LABEL[mover.matchType]}
          </span>
        </div>

        <Text as="h3" variant="lg-semibold" className="text-text-secondary mb-12 line-clamp-1">
          {mover.title}
        </Text>

        <div className="flex items-center gap-12">
          <div className="bg-background-avatar rounded-12 relative size-56 shrink-0 overflow-hidden">
            {/* 실제 프로필 이미지 */}
            <MoverProfileImage
              src={mover.profileImageSrc}
              width={88}
              height={88}
              className="absolute -top-8 -left-14 size-84 max-w-none object-cover"
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="mb-4 flex items-center gap-4">
              <DriverBadgeIcon className="h-20 w-18 shrink-0" />
              <Text as="span" variant="md-semibold" className="text-text-secondary">
                {mover.name} 기사님
              </Text>
            </div>
            <div className="text-text-muted flex flex-wrap items-center gap-6 text-[13px]">
              <span className="text-text-secondary flex items-center gap-2 font-medium">
                <StarIcon className="size-16" /> {mover.rating.toFixed(1)}
              </span>
              <span>({mover.reviewCount})</span>
              <span aria-hidden="true">·</span>
              <span>경력 {mover.careerYears}년</span>
              <span aria-hidden="true">·</span>
              <span>{mover.confirmedCount}건 확정</span>
            </div>
          </div>
        </div>
      </div>

      <Link
        href={APP_ROUTES.MOVERS.DETAIL(mover.id)}
        className="border-border-default text-text-secondary rounded-12 hover:bg-background-hover mt-14 flex h-40 w-full items-center justify-center border text-[14px] font-semibold"
      >
        프로필 보기
      </Link>
    </article>
  );
}

// 검색 전 안내 화면
function MapSearchPrompt() {
  return (
    <section
      aria-label="지도 검색 안내"
      className="bg-background-subtle flex min-h-[520px] flex-1 items-center justify-center px-24 text-center lg:min-h-0"
    >
      <Text as="p" variant="lg-medium" className="text-text-muted">
        출발지와 도착지를 선택하고 기사님을 검색하면 지도가 표시됩니다.
      </Text>
    </section>
  );
}

export function MoverRecommendationMapPage() {
  const [departure, setDeparture] = useState<AddressSearchItem | null>(null);
  const [destination, setDestination] = useState<AddressSearchItem | null>(null);
  const [moveType, setMoveType] = useState<MoveTypeFilter>("ALL");

  const [searchedDeparture, setSearchedDeparture] = useState<AddressSearchItem | null>(null);
  const [searchedDestination, setSearchedDestination] = useState<AddressSearchItem | null>(null);
  const [searchedMoveType, setSearchedMoveType] = useState<MoveTypeFilter>("ALL");

  const [addressModalKind, setAddressModalKind] = useState<AddressModalKind | null>(null);
  //선택된 기사 처리
  const departureRegionId = searchedDeparture ? getRegionIdBySido(searchedDeparture.sido) : null;

  //주소 지역 ID로 변환 (시/도 데이터가 문자열로 들어오기 때문)
  const destinationRegionId = searchedDestination
    ? getRegionIdBySido(searchedDestination.sido)
    : null;

  //검색 여부
  const hasSearched = searchedDeparture !== null && searchedDestination !== null;

  //실제 기사 조회
  const { movers, isLoading, isError, refetch } = useMoverRecommendations({
    departureRegionId,
    destinationRegionId,
    ...(searchedMoveType !== "ALL" ? { moveType: searchedMoveType } : {}),
  });

  //검색 버튼 클릭 시 현재 입력값을 검색 조건으로 확정
  function handleSearch() {
    if (!departure || !destination) return;

    setSearchedDeparture(departure);
    setSearchedDestination(destination);
    setSearchedMoveType(moveType);
  }

  //주소 선택 시 현재 모달 종류에 따라 출발지 또는 도착지에 저장
  function handleAddressConfirm(address: AddressSearchItem) {
    if (addressModalKind === "출발지") {
      setDeparture(address);
    } else if (addressModalKind === "도착지") {
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
              지역 맞춤 기사님 추천
            </Text>
            <Text as="p" variant="sm-medium" className="text-text-muted mb-24">
              출발지와 도착지를 입력하면 서비스 지역이 일치하는 기사님을 찾아드려요.
            </Text>

            <div className="flex flex-col gap-12">
              <Input
                readOnly
                value={departure?.roadAddress ?? ""}
                onClick={() => setAddressModalKind("출발지")}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setAddressModalKind("출발지");
                  }
                }}
                placeholder="출발지를 입력해 주세요."
                aria-label="출발지"
                aria-haspopup="dialog"
                leftSlot={
                  <span className="bg-text-secondary flex size-24 shrink-0 items-center justify-center rounded-full text-[12px] font-bold text-white">
                    출
                  </span>
                }
              />
              <Input
                readOnly
                value={destination?.roadAddress ?? ""}
                onClick={() => setAddressModalKind("도착지")}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setAddressModalKind("도착지");
                  }
                }}
                placeholder="도착지를 입력해 주세요."
                aria-label="도착지"
                aria-haspopup="dialog"
                leftSlot={
                  <span className="bg-background-brand flex size-24 shrink-0 items-center justify-center rounded-full text-[12px] font-bold text-white">
                    도
                  </span>
                }
              />
              <Select
                desc="이사 유형 전체"
                label="이사 유형"
                defaultValue={moveType}
                placeholderValue="ALL"
                onChange={(value) => setMoveType(value as MoveTypeFilter)}
                className="w-full [&>button]:w-full"
              >
                <Select.Option value="ALL">이사 유형 전체</Select.Option>
                <Select.Option value="SMALL">소형이사</Select.Option>
                <Select.Option value="HOME">가정이사</Select.Option>
                <Select.Option value="OFFICE">사무실이사</Select.Option>
              </Select>
              <Button
                size="cta"
                fullWidth
                disabled={!departure || !destination}
                onClick={handleSearch}
              >
                기사님 검색
              </Button>
            </div>
          </div>

          <div className="flex min-h-0 flex-1 flex-col p-24 lg:overflow-y-auto lg:overscroll-contain lg:p-20">
            <div className="mb-16 flex items-end justify-between gap-12">
              <div>
                <Text as="h2" variant="xl-semibold" className="text-text-secondary">
                  추천 기사님 {movers.length}명
                </Text>
                <Text as="p" variant="sm-medium" className="text-text-muted mt-2">
                  지역 일치도 우선 · 평점 높은 순
                </Text>
              </div>
            </div>

            <div className="rounded-12 mb-16 flex min-h-60 flex-col justify-center gap-2 bg-[#fff6f3] px-14 py-10 text-[12px] leading-[18px] text-[#8a4a3d]">
              <span className="block">추천 목록은 등록된 서비스 가능 지역 기준입니다.</span>
              <span className="block">실제 가능 여부는 견적 요청 시 확인해 주세요.</span>
            </div>

            {!hasSearched ? (
              <div className="text-text-muted rounded-16 border-border-subtle flex min-h-160 items-center justify-center border px-20 text-center text-[14px]">
                출발지와 도착지를 입력하고 기사님을 검색해 주세요.
              </div>
            ) : departureRegionId === null || destinationRegionId === null ? (
              <div className="text-text-error rounded-16 border-border-subtle flex min-h-160 items-center justify-center border px-20 text-center text-[14px]">
                선택한 주소의 지역 정보를 확인할 수 없습니다.
              </div>
            ) : isLoading ? (
              <div
                role="status"
                className="flex flex-col gap-12"
                aria-label="추천 기사님을 불러오는 중"
              >
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
                  추천 기사님을 불러오지 못했습니다.
                </Text>
                <button
                  type="button"
                  className="text-text-brand text-[14px] font-semibold"
                  onClick={() => void refetch()}
                >
                  다시 시도
                </button>
              </div>
            ) : movers.length > 0 ? (
              <div className="flex flex-col gap-12">
                {movers.map((mover) => (
                  <RecommendationCard key={mover.id} mover={mover} />
                ))}
              </div>
            ) : (
              <div className="text-text-muted rounded-16 border-border-subtle flex min-h-160 items-center justify-center border text-center text-[14px]">
                선택한 조건에 맞는 기사님이 없습니다.
              </div>
            )}
          </div>
        </aside>

        {/* 실제 지도 표시 - key에 두 주소 ID를 넣어서 주소 변경시 카카오 맵 새로 생성 */}
        {searchedDeparture && searchedDestination ? (
          <KakaoMap
            key={`${searchedDeparture.id}-${searchedDestination.id}`}
            departure={searchedDeparture}
            destination={searchedDestination}
          />
        ) : (
          <MapSearchPrompt />
        )}
      </div>

      {addressModalKind && (
        <AddressSelectModal
          open
          kind={addressModalKind}
          onClose={() => setAddressModalKind(null)}
          onConfirm={handleAddressConfirm}
        />
      )}
    </main>
  );
}
