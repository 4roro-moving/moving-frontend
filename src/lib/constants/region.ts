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
