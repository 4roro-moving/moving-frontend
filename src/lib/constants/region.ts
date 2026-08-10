export type RegionId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17;

export const REGION_LABEL: Record<RegionId, string> = {
  1: "서울",
  2: "부산",
  3: "대구",
  4: "인천",
  5: "광주",
  6: "대전",
  7: "울산",
  8: "세종",
  9: "경기",
  10: "강원",
  11: "충북",
  12: "충남",
  13: "전북",
  14: "전남",
  15: "경북",
  16: "경남",
  17: "제주",
};

/** Figma 지역 드롭다운 표시 순서 (id 오름차순과 다름) */
export const REGION_DISPLAY_ORDER: RegionId[] = [
  1, // 서울
  9, // 경기
  4, // 인천
  10, // 강원
  11, // 충북
  12, // 충남
  8, // 세종
  6, // 대전
  13, // 전북
  14, // 전남
  5, // 광주
  15, // 경북
  3, // 대구
  7, // 울산
  2, // 부산
  16, // 경남
  17, // 제주
];

export const REGION_OPTIONS = REGION_DISPLAY_ORDER.map((value) => ({
  value,
  label: REGION_LABEL[value],
}));

// 카카오 주소 검색 결과의 sido 값을 내부 지역 ID로 변환하기 위함
const REGION_ID_BY_SIDO: Record<string, RegionId> = {
  서울: 1,
  서울특별시: 1,
  부산: 2,
  부산광역시: 2,
  대구: 3,
  대구광역시: 3,
  인천: 4,
  인천광역시: 4,
  광주: 5,
  광주광역시: 5,
  대전: 6,
  대전광역시: 6,
  울산: 7,
  울산광역시: 7,
  세종: 8,
  세종특별자치시: 8,
  경기: 9,
  경기도: 9,
  강원: 10,
  강원도: 10,
  강원특별자치도: 10,
  충북: 11,
  충청북도: 11,
  충남: 12,
  충청남도: 12,
  전북: 13,
  전라북도: 13,
  전북특별자치도: 13,
  전남: 14,
  전라남도: 14,
  경북: 15,
  경상북도: 15,
  경남: 16,
  경상남도: 16,
  제주: 17,
  제주도: 17,
  제주특별자치도: 17,
};

export function getRegionIdBySido(sido: string): RegionId | null {
  return REGION_ID_BY_SIDO[sido.trim()] ?? null;
}
