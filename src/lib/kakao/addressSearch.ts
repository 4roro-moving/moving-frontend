export interface KakaoAddressDocument {
  address_name: string;
  address_type: string;
  x: string;
  y: string;
  address: {
    address_name: string;
    region_1depth_name: string;
    region_2depth_name: string;
    region_3depth_name: string;
    region_3depth_h_name: string;
    h_code: string;
    b_code: string;
    mountain_yn: string;
    main_address_no: string;
    sub_address_no: string;
    zip_code?: string;
  } | null;
  road_address: {
    address_name: string;
    region_1depth_name: string;
    region_2depth_name: string;
    region_3depth_name: string;
    road_name: string;
    underground_yn: string;
    main_building_no: string;
    sub_building_no: string;
    building_name: string;
    zone_no: string;
  } | null;
}

export interface KakaoKeywordDocument {
  id: string;
  place_name: string;
  category_name: string;
  category_group_code: string;
  category_group_name: string;
  phone: string;
  address_name: string;
  road_address_name: string;
  x: string;
  y: string;
  place_url: string;
  distance: string;
}

export interface KakaoSearchResponse<T> {
  meta: {
    total_count: number;
    pageable_count: number;
    is_end: boolean;
  };
  documents: T[];
}

export interface KakaoCoord2AddressDocument {
  address: KakaoAddressDocument["address"];
  road_address: KakaoAddressDocument["road_address"];
}

export interface AddressSearchItem {
  id: string;
  zipCode: string;
  roadAddress: string;
  jibunAddress: string;
  sido: string;
  latitude: number;
  longitude: number;
}

// 2026.08.06 윤소정 - [추가] 카카오 주소 검색 좌표 유효성 검사
function parseCoordinates(x: unknown, y: unknown): { latitude: number; longitude: number } | null {
  if (typeof x !== "string" || typeof y !== "string" || !x.trim() || !y.trim()) return null;

  const latitude = Number(y);
  const longitude = Number(x);
  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude) ||
    latitude === 0 ||
    longitude === 0 ||
    latitude < -90 ||
    latitude > 90 ||
    longitude < -180 ||
    longitude > 180
  ) {
    return null;
  }

  return { latitude, longitude };
}

export function toValidCoordinateKey(x: unknown, y: unknown): string | null {
  const coordinates = parseCoordinates(x, y);
  if (!coordinates) return null;
  return toCoordinateKey(String(coordinates.longitude), String(coordinates.latitude));
}

/** 괄호 안 건물명 제거 후 도로명 기준 비교용 */
export function normalizeRoadAddress(roadAddress: string): string {
  return roadAddress.replace(/\s*\([^)]*\)\s*/g, "").trim();
}

function dedupeKey(item: AddressSearchItem): string {
  return `${normalizeRoadAddress(item.roadAddress)}|${item.jibunAddress.trim()}`;
}

function extractSido(value: string): string {
  return value.trim().split(/\s+/)[0] ?? "";
}

export function extractZipCodeFromAddressDocument(
  document: Pick<KakaoAddressDocument, "road_address" | "address">,
): string {
  return document.road_address?.zone_no || document.address?.zip_code || "";
}

export function extractZipCodeFromCoordDocument(
  document: KakaoCoord2AddressDocument | undefined,
): string {
  if (!document) return "";
  return extractZipCodeFromAddressDocument(document);
}

export function toCoordinateKey(x: string, y: string): string {
  return `${x},${y}`;
}

export interface ZipCodeLookups {
  byCoordinate: Map<string, string>;
  byJibun: Map<string, string>;
  byRoad: Map<string, string>;
}

export function setZipLookup(map: Map<string, string>, key: string, zipCode: string): void {
  const normalizedKey = key.trim();
  if (!normalizedKey || !zipCode || map.has(normalizedKey)) return;
  map.set(normalizedKey, zipCode);
}

/** 주소 검색 문서에서 좌표/지번/도로명 → 우편번호 룩업 테이블 생성 */
export function collectZipCodeLookups(documents: KakaoAddressDocument[]): ZipCodeLookups {
  const lookups: ZipCodeLookups = {
    byCoordinate: new Map(),
    byJibun: new Map(),
    byRoad: new Map(),
  };

  for (const document of documents) {
    mergeAddressDocumentIntoZipLookups(lookups, document);
  }

  return lookups;
}

/** 주소 검색 문서를 룩업에 반영 (이미 있는 키는 유지) */
export function mergeAddressDocumentIntoZipLookups(
  lookups: ZipCodeLookups,
  document: KakaoAddressDocument,
): string {
  const zipCode = extractZipCodeFromAddressDocument(document);
  if (!zipCode) return "";

  setZipLookup(lookups.byCoordinate, toValidCoordinateKey(document.x, document.y) ?? "", zipCode);
  setZipLookup(lookups.byJibun, document.address?.address_name ?? "", zipCode);
  setZipLookup(lookups.byJibun, document.address_name, zipCode);
  setZipLookup(lookups.byRoad, document.road_address?.address_name ?? "", zipCode);
  return zipCode;
}

/** coord2address 결과도 같은 룩업에 반영 */
export function mergeCoordDocumentIntoZipLookups(
  lookups: ZipCodeLookups,
  coordinateKey: string,
  document: KakaoCoord2AddressDocument | undefined,
): void {
  if (!document) return;

  const zipCode = extractZipCodeFromCoordDocument(document);
  if (!zipCode) return;

  setZipLookup(lookups.byCoordinate, coordinateKey, zipCode);
  setZipLookup(lookups.byJibun, document.address?.address_name ?? "", zipCode);
  setZipLookup(lookups.byRoad, document.road_address?.address_name ?? "", zipCode);
}

/** 키워드 문서의 우편번호 조회 우선순위: 좌표 → 지번 → 도로명 */
export function resolveKeywordZipCode(
  document: KakaoKeywordDocument,
  lookups: ZipCodeLookups,
): string {
  const road = document.road_address_name.trim();
  const jibun = document.address_name.trim();
  const coordinateKey = toValidCoordinateKey(document.x, document.y);

  return (
    (coordinateKey ? lookups.byCoordinate.get(coordinateKey) : undefined) ||
    lookups.byJibun.get(jibun) ||
    lookups.byRoad.get(road) ||
    ""
  );
}

/** 우편번호가 아직 없는 키워드에 대해 주소 재검색용 쿼리 목록 */
export function collectAddressQueriesForMissingZip(
  documents: KakaoKeywordDocument[],
  lookups: ZipCodeLookups,
): string[] {
  const queries = new Set<string>();

  for (const document of documents) {
    if (resolveKeywordZipCode(document, lookups)) continue;

    const road = document.road_address_name.trim();
    const jibun = document.address_name.trim();
    if (road) queries.add(road);
    else if (jibun) queries.add(jibun);
  }

  return [...queries];
}

export function mapKakaoDocumentToAddressItem(
  document: KakaoAddressDocument,
  index: number,
): AddressSearchItem | null {
  const coordinates = parseCoordinates(document.x, document.y);
  if (!coordinates) return null;

  const road = document.road_address;
  const jibun = document.address;

  const roadBase = road?.address_name || document.address_name;
  const buildingName = road?.building_name?.trim();
  const roadAddress =
    buildingName && !roadBase.includes(buildingName) ? `${roadBase} (${buildingName})` : roadBase;

  return {
    id: `address-${document.x}-${document.y}-${index}`,
    zipCode: extractZipCodeFromAddressDocument(document),
    roadAddress,
    jibunAddress: jibun?.address_name || "",
    sido: extractSido(jibun?.address_name || roadBase),
    ...coordinates,
  };
}

/** 건물명·장소명 검색 결과 (keyword API) */
export function mapKakaoKeywordToAddressItem(
  document: KakaoKeywordDocument,
  index: number,
  resolvedZipCode = "",
): AddressSearchItem | null {
  const coordinates = parseCoordinates(document.x, document.y);
  if (!coordinates) return null;

  const road = document.road_address_name.trim();
  const place = document.place_name.trim();
  const jibun = document.address_name.trim();

  let roadAddress = road || jibun || place;
  if (road && place && !road.includes(place)) {
    roadAddress = `${road} (${place})`;
  }

  return {
    id: `keyword-${document.id}-${index}`,
    zipCode: resolvedZipCode,
    roadAddress,
    jibunAddress: jibun,
    sido: extractSido(jibun || roadAddress),
    ...coordinates,
  };
}

/** 주소 검색 + 키워드 검색 결과 병합 (중복 제거, 주소 검색 결과 우선) */
export function mergeAddressSearchResults(
  addressResults: AddressSearchItem[],
  keywordResults: AddressSearchItem[],
  limit = 15,
): AddressSearchItem[] {
  const merged: AddressSearchItem[] = [];
  const seen = new Set<string>();

  for (const item of [...addressResults, ...keywordResults]) {
    const key = dedupeKey(item);
    if (seen.has(key)) continue;
    seen.add(key);
    merged.push(item);
    if (merged.length >= limit) break;
  }

  return merged;
}
