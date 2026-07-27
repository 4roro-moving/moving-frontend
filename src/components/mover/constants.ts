import type { Mover, MoverSort } from "@/types/mover";

export const SORT_OPTIONS: { value: MoverSort; label: string }[] = [
  { value: "reviewCount", label: "리뷰 많은순" },
  { value: "rating", label: "평점 높은순" },
  { value: "career", label: "경력 높은순" },
  { value: "confirmedCount", label: "확정 많은순" },
];

const DEFAULT_PROFILE = "/images/profile-character.png";

/** NOTE: 찜한 기사님 사이드바용 MOCK. 찜 목록 API 연동 전 */
export const MOCK_FAVORITE_MOVERS: Mover[] = [
  {
    id: "f1",
    name: "한경기",
    serviceType: "HOME",
    serviceAreas: [9, 4],
    title: "경기·인천 가정이사",
    description: "가정이사 리뷰가 많은 경기권 전문 기사입니다.",
    rating: 4.7,
    reviewCount: 320,
    careerYears: 12,
    confirmedCount: 290,
    favoriteCount: 200,
    isFavorite: true,
    profileImageSrc: DEFAULT_PROFILE,
  },
  {
    id: "f2",
    name: "이가경",
    serviceType: "OFFICE",
    serviceAreas: [1, 4],
    title: "사무실 이전 전문 컨설팅",
    description: "사무실·상가 이전 경력 15년. 야간 작업 가능합니다.",
    rating: 4.6,
    reviewCount: 140,
    careerYears: 15,
    confirmedCount: 220,
    favoriteCount: 120,
    isFavorite: true,
    profileImageSrc: DEFAULT_PROFILE,
  },
  {
    id: "f3",
    name: "오제주",
    serviceType: "OFFICE",
    serviceAreas: [17],
    title: "제주 사무실·상가 이전",
    description: "제주 지역 사무실 이전 특화. 평점 최상위입니다.",
    rating: 5.0,
    reviewCount: 88,
    careerYears: 9,
    confirmedCount: 95,
    favoriteCount: 70,
    isFavorite: true,
    profileImageSrc: DEFAULT_PROFILE,
  },
];
