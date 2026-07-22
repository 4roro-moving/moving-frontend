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

export interface AddressSearchItem {
  id: string;
  zipCode: string;
  roadAddress: string;
  jibunAddress: string;
}

/** 괄호 안 건물명 제거 후 도로명 기준 비교용 */
export function normalizeRoadAddress(roadAddress: string): string {
  return roadAddress.replace(/\s*\([^)]*\)\s*/g, "").trim();
}

function dedupeKey(item: AddressSearchItem): string {
  return `${normalizeRoadAddress(item.roadAddress)}|${item.jibunAddress.trim()}`;
}

export function mapKakaoDocumentToAddressItem(
  document: KakaoAddressDocument,
  index: number,
): AddressSearchItem {
  const road = document.road_address;
  const jibun = document.address;

  const roadBase = road?.address_name || document.address_name;
  const buildingName = road?.building_name?.trim();
  const roadAddress =
    buildingName && !roadBase.includes(buildingName) ? `${roadBase} (${buildingName})` : roadBase;

  return {
    id: `address-${document.x}-${document.y}-${index}`,
    zipCode: road?.zone_no || jibun?.zip_code || "",
    roadAddress,
    jibunAddress: jibun?.address_name || "",
  };
}

/** 건물명·장소명 검색 결과 (keyword API) */
export function mapKakaoKeywordToAddressItem(
  document: KakaoKeywordDocument,
  index: number,
): AddressSearchItem {
  const road = document.road_address_name.trim();
  const place = document.place_name.trim();
  const jibun = document.address_name.trim();

  let roadAddress = road || jibun || place;
  if (road && place && !road.includes(place)) {
    roadAddress = `${road} (${place})`;
  }

  return {
    id: `keyword-${document.id}-${index}`,
    zipCode: "",
    roadAddress,
    jibunAddress: jibun,
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
