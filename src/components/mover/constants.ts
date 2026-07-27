import type { Mover, MoverSort } from "@/types/mover";

export const SORT_OPTIONS: { value: MoverSort; label: string }[] = [
  { value: "reviewCount", label: "리뷰 많은순" },
  { value: "rating", label: "평점 높은순" },
  { value: "career", label: "경력 높은순" },
  { value: "confirmedCount", label: "확정 많은순" },
];

const DEFAULT_PROFILE = "/images/profile-character.png";

/** NOTE: API 연동 전 MOCK 데이터 */
export const MOCK_MOVERS: Mover[] = [
  {
    id: "1",
    name: "김코드",
    serviceType: "SMALL",
    serviceAreas: [1, 9], // 서울, 경기
    title: "고객님의 물품을 안전하게 운송해 드립니다.",
    description: "이사업계 경력 7년으로 안전한 이사를 도와드리는 김코드입니다.",
    rating: 5.0,
    reviewCount: 178,
    careerYears: 7,
    confirmedCount: 334,
    favoriteCount: 136,
    isFavorite: false,
    profileImageSrc: DEFAULT_PROFILE,
  },
  {
    id: "2",
    name: "김코드",
    serviceType: "SMALL",
    serviceAreas: [1], // 서울
    title: "고객님의 물품을 안전하게 운송해 드립니다.",
    description: "이사업계 경력 7년으로 안전한 이사를 도와드리는 김코드입니다.",
    rating: 5.0,
    reviewCount: 178,
    careerYears: 7,
    confirmedCount: 334,
    favoriteCount: 136,
    isFavorite: true,
    profileImageSrc: DEFAULT_PROFILE,
  },
  {
    id: "3",
    name: "김코드",
    serviceType: "SMALL",
    serviceAreas: [9, 4], // 경기, 인천
    title: "고객님의 물품을 안전하게 운송해 드립니다.",
    description: "이사업계 경력 7년으로 안전한 이사를 도와드리는 김코드입니다.",
    rating: 5.0,
    reviewCount: 178,
    careerYears: 7,
    confirmedCount: 334,
    favoriteCount: 136,
    isFavorite: true,
    profileImageSrc: DEFAULT_PROFILE,
  },
  {
    id: "4",
    name: "김코드",
    serviceType: "SMALL",
    serviceAreas: [2, 16], // 부산, 경남
    title: "고객님의 물품을 안전하게 운송해 드립니다.",
    description: "이사업계 경력 7년으로 안전한 이사를 도와드리는 김코드입니다.",
    rating: 5.0,
    reviewCount: 178,
    careerYears: 7,
    confirmedCount: 334,
    favoriteCount: 136,
    isFavorite: true,
    profileImageSrc: DEFAULT_PROFILE,
  },
];

export const MOCK_FAVORITE_MOVERS: Mover[] = [
  {
    id: "f1",
    name: "김코드",
    serviceType: "OFFICE",
    serviceAreas: [1, 9],
    title: "고객님의 물품을 안전하게 운송해 드립니다.",
    description: "이사업계 경력 7년으로 안전한 이사를 도와드리는 김코드입니다.",
    rating: 5.0,
    reviewCount: 178,
    careerYears: 7,
    confirmedCount: 334,
    favoriteCount: 136,
    isFavorite: true,
    profileImageSrc: DEFAULT_PROFILE,
  },
  {
    id: "f2",
    name: "김코드",
    serviceType: "OFFICE",
    serviceAreas: [1],
    title: "고객님의 물품을 안전하게 운송해 드립니다.",
    description: "이사업계 경력 7년으로 안전한 이사를 도와드리는 김코드입니다.",
    rating: 5.0,
    reviewCount: 178,
    careerYears: 7,
    confirmedCount: 334,
    favoriteCount: 136,
    isFavorite: true,
    profileImageSrc: DEFAULT_PROFILE,
  },
  {
    id: "f3",
    name: "김코드",
    serviceType: "OFFICE",
    serviceAreas: [6, 12], // 대전, 충남
    title: "고객님의 물품을 안전하게 운송해 드립니다.",
    description: "이사업계 경력 7년으로 안전한 이사를 도와드리는 김코드입니다.",
    rating: 5.0,
    reviewCount: 178,
    careerYears: 7,
    confirmedCount: 334,
    favoriteCount: 136,
    isFavorite: true,
    profileImageSrc: DEFAULT_PROFILE,
  },
];
