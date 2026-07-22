import { NextResponse } from "next/server";

import {
  mapKakaoDocumentToAddressItem,
  mapKakaoKeywordToAddressItem,
  mergeAddressSearchResults,
  type KakaoAddressDocument,
  type KakaoKeywordDocument,
  type KakaoSearchResponse,
} from "@/lib/kakao/addressSearch";

const KAKAO_ADDRESS_SEARCH_URL = "https://dapi.kakao.com/v2/local/search/address.json";
const KAKAO_KEYWORD_SEARCH_URL = "https://dapi.kakao.com/v2/local/search/keyword.json";

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

  const addressUrl = new URL(KAKAO_ADDRESS_SEARCH_URL);
  addressUrl.searchParams.set("query", query);
  addressUrl.searchParams.set("analyze_type", "similar");
  addressUrl.searchParams.set("size", "15");

  const keywordUrl = new URL(KAKAO_KEYWORD_SEARCH_URL);
  keywordUrl.searchParams.set("query", query);
  keywordUrl.searchParams.set("size", "15");

  const [addressResult, keywordResult] = await Promise.allSettled([
    fetchKakao<KakaoAddressDocument>(addressUrl, apiKey),
    fetchKakao<KakaoKeywordDocument>(keywordUrl, apiKey),
  ]);

  const addressPayload = addressResult.status === "fulfilled" ? addressResult.value : null;
  const keywordPayload = keywordResult.status === "fulfilled" ? keywordResult.value : null;

  if (!addressPayload && !keywordPayload) {
    const reason =
      addressResult.status === "rejected"
        ? addressResult.reason
        : keywordResult.status === "rejected"
          ? keywordResult.reason
          : null;
    const message = reason instanceof Error ? reason.message : "카카오 주소 검색에 실패했습니다.";
    return NextResponse.json({ message }, { status: 502 });
  }

  const addressResults = (addressPayload?.documents ?? []).map(mapKakaoDocumentToAddressItem);
  const keywordResults = (keywordPayload?.documents ?? []).map(mapKakaoKeywordToAddressItem);
  const results = mergeAddressSearchResults(addressResults, keywordResults);

  return NextResponse.json({ results });
}
