import type { RegionId } from "@/lib/constants/region";

/**
 * 카카오 행정동/법정동 코드의 상위 행정구역 prefix를 서비스 지역 ID로 변환합니다.
 * 주소 명칭이 변경돼도 행정코드를 기준으로 추천 지역을 안정적으로 결정합니다.
 * 긴 prefix를 먼저 검사해야 통합 특별시 내부 권역을 구분할 수 있습니다.
 */
const REGION_ID_BY_ADMINISTRATIVE_CODE_PREFIX: ReadonlyArray<
  readonly [prefix: string, regionId: RegionId]
> = [
  ["122", 5], // 전남광주통합특별시 내 기존 광주 권역
  ["121", 14], // 전남광주통합특별시 내 기존 전남 권역
  ["11", 1],
  ["26", 2],
  ["27", 3],
  ["28", 4],
  ["29", 5],
  ["30", 6],
  ["31", 7],
  ["36", 8],
  ["41", 9],
  ["51", 10],
  ["43", 11],
  ["44", 12],
  ["52", 13],
  ["46", 14],
  ["47", 15],
  ["48", 16],
  ["50", 17],
];

export function getRegionIdByAdministrativeCode(code: string): RegionId | null {
  const normalizedCode = code.trim();
  if (!/^\d{10}$/.test(normalizedCode)) return null;

  return (
    REGION_ID_BY_ADMINISTRATIVE_CODE_PREFIX.find(([prefix]) =>
      normalizedCode.startsWith(prefix),
    )?.[1] ?? null
  );
}
