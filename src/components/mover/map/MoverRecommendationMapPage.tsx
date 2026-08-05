"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import Button from "@/components/common/Button/Button";
import Input from "@/components/common/Input/Input";
import NavigationTabs from "@/components/common/NavigationTabs/NavigationTabs";
import Select from "@/components/common/Select/Select";
import { Text } from "@/components/common/Text";
import AddressSelectModal from "@/components/estimate/request/AddressSelectModal";
import { DriverBadgeIcon, StarIcon } from "@/icons";
import { APP_ROUTES } from "@/lib/constants/appRoutes";
import type { AddressSearchItem } from "@/lib/kakao/addressSearch";
import { cn } from "@/lib/utils/cn";

type MatchType = "BOTH" | "DEPARTURE" | "DESTINATION";
type AddressModalKind = "출발지" | "도착지";

const MOVER_NAVIGATION_ITEMS = [
  { href: APP_ROUTES.MOVERS.ROOT, label: "기사님 찾기", match: "exact" },
  { href: APP_ROUTES.MOVERS.MAP, label: "기사님 추천", match: "exact" },
] as const;

interface MockMover {
  id: string;
  nickname: string;
  title: string;
  rating: number;
  reviewCount: number;
  career: number;
  confirmedCount: number;
  service: string;
  regions: string[];
  matchType: MatchType;
  marker: { left: string; top: string };
}

const MOCK_MOVERS: MockMover[] = [
  {
    id: "11111111-1111-1111-1111-111111111111",
    nickname: "김코드",
    title: "고객님의 물품을 안전하게 운송해 드립니다.",
    rating: 5,
    reviewCount: 178,
    career: 7,
    confirmedCount: 334,
    service: "가정이사",
    regions: ["서울", "경기"],
    matchType: "BOTH",
    marker: { left: "38%", top: "34%" },
  },
  {
    id: "22222222-2222-2222-2222-222222222222",
    nickname: "이무빙",
    title: "꼼꼼하고 편안한 이사를 약속드립니다.",
    rating: 4.9,
    reviewCount: 126,
    career: 5,
    confirmedCount: 219,
    service: "소형이사",
    regions: ["서울", "인천"],
    matchType: "DEPARTURE",
    marker: { left: "57%", top: "48%" },
  },
  {
    id: "33333333-3333-3333-3333-333333333333",
    nickname: "박안심",
    title: "처음부터 끝까지 책임지고 함께하겠습니다.",
    rating: 4.8,
    reviewCount: 94,
    career: 9,
    confirmedCount: 287,
    service: "사무실이사",
    regions: ["경기", "인천"],
    matchType: "DESTINATION",
    marker: { left: "69%", top: "63%" },
  },
];

const MATCH_LABEL: Record<MatchType, string> = {
  BOTH: "출발지·도착지 모두 가능",
  DEPARTURE: "출발지 지역 서비스",
  DESTINATION: "도착지 지역 서비스",
};

function RecommendationCard({
  mover,
  selected,
  onSelect,
}: {
  mover: MockMover;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <article
      className={cn(
        "rounded-16 bg-background-surface border p-16 transition-all",
        selected
          ? "border-border-brand shadow-input"
          : "border-border-subtle shadow-[-2px_-2px_10px_0_rgba(220,220,220,0.2),2px_2px_10px_0_rgba(220,220,220,0.2)]",
      )}
    >
      <button type="button" aria-pressed={selected} onClick={onSelect} className="w-full text-left">
        <div className="mb-12 flex items-center justify-between gap-8">
          <span className="bg-background-brand-muted text-text-brand rounded-4 px-8 py-2 text-[13px] font-semibold">
            {mover.service}
          </span>
          <span className="text-text-brand text-[12px] font-semibold">
            {MATCH_LABEL[mover.matchType]}
          </span>
        </div>

        <Text as="h3" variant="lg-semibold" className="text-text-secondary mb-12 line-clamp-1">
          {mover.title}
        </Text>

        <div className="flex items-center gap-12">
          <div className="bg-background-avatar rounded-12 relative size-56 shrink-0 overflow-hidden">
            <Image
              src="/images/profile-character.png"
              alt=""
              width={84}
              height={84}
              className="absolute -top-8 -left-14 size-84 max-w-none object-cover"
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="mb-4 flex items-center gap-4">
              <DriverBadgeIcon className="h-20 w-18 shrink-0" />
              <Text as="span" variant="md-semibold" className="text-text-secondary">
                {mover.nickname} 기사님
              </Text>
            </div>
            <div className="text-text-muted flex flex-wrap items-center gap-6 text-[13px]">
              <span className="text-text-secondary flex items-center gap-2 font-medium">
                <StarIcon className="size-16" /> {mover.rating.toFixed(1)}
              </span>
              <span>({mover.reviewCount})</span>
              <span aria-hidden="true">·</span>
              <span>경력 {mover.career}년</span>
              <span aria-hidden="true">·</span>
              <span>{mover.confirmedCount}건 확정</span>
            </div>
          </div>
        </div>
      </button>

      <Link
        href={APP_ROUTES.MOVERS.DETAIL(mover.id)}
        className="border-border-default text-text-secondary rounded-12 hover:bg-background-hover mt-14 flex h-40 w-full items-center justify-center border text-[14px] font-semibold"
      >
        프로필 보기
      </Link>
    </article>
  );
}

function MockMap({
  movers,
  selectedMoverId,
  onSelectMover,
}: {
  movers: MockMover[];
  selectedMoverId: string | null;
  onSelectMover: (id: string) => void;
}) {
  return (
    <section
      aria-label="추천 기사님 지도 미리보기"
      className="relative min-h-[520px] flex-1 overflow-hidden bg-[#eef1ed] lg:min-h-0"
    >
      <div className="absolute inset-0 opacity-80" aria-hidden="true">
        <div className="absolute top-[18%] left-[-8%] h-24 w-[116%] rotate-[7deg] bg-white/90 shadow-[0_0_0_1px_#d9ddd8]" />
        <div className="absolute top-[-8%] left-[38%] h-[116%] w-20 rotate-[-12deg] bg-white/90 shadow-[0_0_0_1px_#d9ddd8]" />
        <div className="absolute top-[66%] left-[-4%] h-16 w-[112%] rotate-[-5deg] bg-[#d9e8f5]" />
        <div className="absolute top-[40%] left-[2%] h-10 w-[96%] rotate-[18deg] bg-white/80" />
        <div className="absolute top-[8%] left-[12%] size-48 rounded-full bg-[#dcebd8]" />
        <div className="absolute right-[8%] bottom-[10%] size-64 rounded-full bg-[#dcebd8]" />
      </div>

      <div className="absolute top-24 left-24 rounded-full bg-white px-14 py-8 text-[13px] font-semibold shadow-md">
        서울 → 경기
      </div>

      <div className="absolute top-[25%] left-[22%] flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
        <span className="bg-text-secondary rounded-full px-10 py-5 text-[12px] font-bold text-white shadow-md">
          출발
        </span>
        <span className="bg-text-secondary h-8 w-2" />
      </div>
      <div className="absolute top-[74%] left-[79%] flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
        <span className="bg-background-brand rounded-full px-10 py-5 text-[12px] font-bold text-white shadow-md">
          도착
        </span>
        <span className="bg-background-brand h-8 w-2" />
      </div>

      {movers.map((mover, index) => {
        const selected = selectedMoverId === mover.id;
        return (
          <button
            key={mover.id}
            type="button"
            aria-pressed={selected}
            onClick={() => onSelectMover(mover.id)}
            style={mover.marker}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            aria-label={`${mover.nickname} 기사님 마커`}
          >
            <span
              className={cn(
                "flex size-44 items-center justify-center rounded-full border-4 border-white font-bold text-white shadow-lg transition-transform",
                selected ? "bg-background-brand scale-125" : "bg-text-secondary hover:scale-110",
              )}
            >
              {index + 1}
            </span>
            {selected && (
              <span className="text-text-secondary rounded-8 absolute top-52 left-1/2 w-max -translate-x-1/2 bg-white px-10 py-6 text-[12px] font-semibold shadow-md">
                {mover.nickname} 기사님
              </span>
            )}
          </button>
        );
      })}

      <div className="text-text-muted rounded-8 absolute right-20 bottom-20 bg-white/95 px-12 py-8 text-[12px] shadow-sm">
        지도 영역 목업 · 추후 Kakao Map 연결
      </div>
    </section>
  );
}

export function MoverRecommendationMapPage() {
  const [departure, setDeparture] = useState<AddressSearchItem | null>(null);
  const [destination, setDestination] = useState<AddressSearchItem | null>(null);
  const [addressModalKind, setAddressModalKind] = useState<AddressModalKind | null>(null);
  const [moveType, setMoveType] = useState("ALL");
  const [searchedMoveType, setSearchedMoveType] = useState("ALL");
  const [selectedMoverId, setSelectedMoverId] = useState<string | null>(MOCK_MOVERS[0]?.id ?? null);

  const visibleMovers = useMemo(
    () =>
      searchedMoveType === "ALL"
        ? MOCK_MOVERS
        : MOCK_MOVERS.filter((mover) => mover.service === searchedMoveType),
    [searchedMoveType],
  );

  function handleSearch() {
    setSearchedMoveType(moveType);
    const firstMatch =
      moveType === "ALL" ? MOCK_MOVERS[0] : MOCK_MOVERS.find((mover) => mover.service === moveType);
    setSelectedMoverId(firstMatch?.id ?? null);
  }

  function handleAddressConfirm(address: AddressSearchItem) {
    if (addressModalKind === "출발지") {
      setDeparture(address);
    } else if (addressModalKind === "도착지") {
      setDestination(address);
    }

    setAddressModalKind(null);
  }

  return (
    <main className="bg-background-surface flex min-h-[calc(100dvh-88px)] flex-col">
      <NavigationTabs ariaLabel="기사님 찾기 방식" items={MOVER_NAVIGATION_ITEMS} />

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <aside className="border-border-subtle z-10 flex w-full shrink-0 flex-col border-b bg-white lg:w-[430px] lg:border-r lg:border-b-0">
          <div className="border-border-subtle border-b p-24 lg:p-28">
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
                onChange={setMoveType}
                className="w-full [&>button]:w-full"
              >
                <Select.Option value="ALL">이사 유형 전체</Select.Option>
                <Select.Option value="소형이사">소형이사</Select.Option>
                <Select.Option value="가정이사">가정이사</Select.Option>
                <Select.Option value="사무실이사">사무실이사</Select.Option>
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

          <div className="flex min-h-0 flex-1 flex-col p-24 lg:overflow-y-auto lg:p-20">
            <div className="mb-16 flex items-end justify-between gap-12">
              <div>
                <Text as="h2" variant="xl-semibold" className="text-text-secondary">
                  추천 기사님 {visibleMovers.length}명
                </Text>
                <Text as="p" variant="sm-medium" className="text-text-muted mt-2">
                  지역 일치도 우선 · 평점 높은 순
                </Text>
              </div>
            </div>

            <div className="rounded-12 mb-16 flex min-h-60 flex-col justify-center gap-2 bg-[#fff6f3] px-14 py-10 text-[12px] leading-[18px] text-[#8a4a3d]">
              <span className="block">지도 위치는 대표 서비스 지역 기준입니다.</span>
              <span className="block">실제 가능 여부는 견적 요청 시 확인해 주세요.</span>
            </div>

            {visibleMovers.length > 0 ? (
              <div className="flex flex-col gap-12">
                {visibleMovers.map((mover) => (
                  <RecommendationCard
                    key={mover.id}
                    mover={mover}
                    selected={selectedMoverId === mover.id}
                    onSelect={() => setSelectedMoverId(mover.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-text-muted rounded-16 border-border-subtle flex min-h-160 items-center justify-center border text-center text-[14px]">
                선택한 조건에 맞는 기사님이 없습니다.
              </div>
            )}
          </div>
        </aside>

        <MockMap
          movers={visibleMovers}
          selectedMoverId={selectedMoverId}
          onSelectMover={setSelectedMoverId}
        />
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
