import { NextResponse } from "next/server";

import {
  collectAddressQueriesForMissingZip,
  collectZipCodeLookups,
  mapKakaoDocumentToAddressItem,
  mapKakaoKeywordToAddressItem,
  mergeAddressDocumentIntoZipLookups,
  mergeAddressSearchResults,
  mergeCoordDocumentIntoZipLookups,
  resolveKeywordZipCode,
  setZipLookup,
  toValidCoordinateKey,
  type KakaoAddressDocument,
  type KakaoCoord2AddressDocument,
  type KakaoKeywordDocument,
  type KakaoSearchResponse,
  type ZipCodeLookups,
} from "@/lib/kakao/addressSearch";

const KAKAO_ADDRESS_SEARCH_URL = "https://dapi.kakao.com/v2/local/search/address.json";
const KAKAO_KEYWORD_SEARCH_URL = "https://dapi.kakao.com/v2/local/search/keyword.json";
const KAKAO_COORD2ADDRESS_URL = "https://dapi.kakao.com/v2/local/geo/coord2address.json";

async function fetchKakao<T>(url: URL, apiKey: string): Promise<KakaoSearchResponse<T>> {
  const response = await fetch(url.toString(), {
    headers: { Authorization: `KakaoAK ${apiKey}` },
    cache: "no-store",
  });

  const payload = (await response.json()) as KakaoSearchResponse<T> & {
    errorType?: string;
    message?: string;
  };

  if (!response.ok) {
    throw new Error(payload.message || "카카오 주소 검색에 실패했습니다.");
  }

  return payload;
}

async function searchAddressDocuments(
  query: string,
  apiKey: string,
): Promise<KakaoAddressDocument[]> {
  const addressUrl = new URL(KAKAO_ADDRESS_SEARCH_URL);
  addressUrl.searchParams.set("query", query);
  addressUrl.searchParams.set("analyze_type", "similar");
  addressUrl.searchParams.set("size", "15");

  const payload = await fetchKakao<KakaoAddressDocument>(addressUrl, apiKey);
  return payload.documents ?? [];
}

/** coord2address로 좌표별 우편번호 보강. 지번/도로명 룩업도 함께 채운다. */
async function enrichZipCodesByCoordinates(
  coordinates: string[],
  apiKey: string,
  lookups: ZipCodeLookups,
): Promise<void> {
  await Promise.allSettled(
    coordinates.map(async (coordinateKey) => {
      if (lookups.byCoordinate.has(coordinateKey)) return;

      const [x, y] = coordinateKey.split(",");
      if (!x || !y) return;

      const coordUrl = new URL(KAKAO_COORD2ADDRESS_URL);
      coordUrl.searchParams.set("x", x);
      coordUrl.searchParams.set("y", y);

      const payload = await fetchKakao<KakaoCoord2AddressDocument>(coordUrl, apiKey);
      mergeCoordDocumentIntoZipLookups(lookups, coordinateKey, payload.documents?.[0]);
    }),
  );
}

/**
 * coord2address로도 못 채운 키워드는 지번/도로명으로 주소 검색을 다시 호출해 우편번호를 보강한다.
 * (키워드 좌표가 도로명 매칭이 안 되는 지번-only 케이스 대응)
 * 이미 확정된 룩업 값은 덮어쓰지 않고, query→zip 매핑은 첫 유효 문서만 사용한다.
 */
async function enrichZipCodesByAddressQueries(
  queries: string[],
  apiKey: string,
  lookups: ZipCodeLookups,
): Promise<void> {
  await Promise.allSettled(
    queries.map(async (query) => {
      const documents = await searchAddressDocuments(query, apiKey);
      let queryZipCode = "";

      for (const document of documents) {
        const zipCode = mergeAddressDocumentIntoZipLookups(lookups, document);
        // analyze_type=similar 상위 결과(첫 유효 문서)만 query 문자열 매핑에 사용
        if (!queryZipCode && zipCode) {
          queryZipCode = zipCode;
        }
      }

      if (queryZipCode) {
        setZipLookup(lookups.byJibun, query, queryZipCode);
        setZipLookup(lookups.byRoad, query, queryZipCode);
      }
    }),
  );
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query")?.trim() ?? "";

  if (!query) {
    return NextResponse.json({ message: "검색어(query)가 필요합니다." }, { status: 400 });
  }

  const apiKey = process.env.KAKAO_REST_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { message: "KAKAO_REST_API_KEY가 설정되지 않았습니다." },
      { status: 500 },
    );
  }

  const keywordUrl = new URL(KAKAO_KEYWORD_SEARCH_URL);
  keywordUrl.searchParams.set("query", query);
  keywordUrl.searchParams.set("size", "15");

  const [addressResult, keywordResult] = await Promise.allSettled([
    searchAddressDocuments(query, apiKey),
    fetchKakao<KakaoKeywordDocument>(keywordUrl, apiKey),
  ]);

  const addressDocuments = addressResult.status === "fulfilled" ? addressResult.value : null;
  const keywordPayload = keywordResult.status === "fulfilled" ? keywordResult.value : null;

  if (!addressDocuments && !keywordPayload) {
    const reason =
      addressResult.status === "rejected"
        ? addressResult.reason
        : keywordResult.status === "rejected"
          ? keywordResult.reason
          : null;
    const message = reason instanceof Error ? reason.message : "카카오 주소 검색에 실패했습니다.";
    return NextResponse.json({ message }, { status: 502 });
  }

  const lookups = collectZipCodeLookups(addressDocuments ?? []);
  const keywordDocuments = keywordPayload?.documents ?? [];

  const missingCoordinateKeys = [
    ...new Set(
      keywordDocuments.flatMap((document) => {
        const coordinateKey = toValidCoordinateKey(document.x, document.y);
        return coordinateKey && !lookups.byCoordinate.has(coordinateKey) ? [coordinateKey] : [];
      }),
    ),
  ];

  if (missingCoordinateKeys.length > 0) {
    await enrichZipCodesByCoordinates(missingCoordinateKeys, apiKey, lookups);
  }

  const missingAddressQueries = collectAddressQueriesForMissingZip(keywordDocuments, lookups);
  if (missingAddressQueries.length > 0) {
    await enrichZipCodesByAddressQueries(missingAddressQueries, apiKey, lookups);
  }

  const addressResults = (addressDocuments ?? []).flatMap((document, index) => {
    const item = mapKakaoDocumentToAddressItem(document, index);
    return item?.zipCode?.trim() ? [item] : [];
  });
  const keywordResults = keywordDocuments.flatMap((document, index) => {
    const item = mapKakaoKeywordToAddressItem(
      document,
      index,
      resolveKeywordZipCode(document, lookups),
    );
    return item?.zipCode?.trim() ? [item] : [];
  });

  // 우편번호 없는 도로명(REGION/ROAD)이 merge limit을 채우지 않도록,
  // 우편번호가 있는 항목만 합친다.
  const results = mergeAddressSearchResults(addressResults, keywordResults);

  return NextResponse.json({ results });
}
