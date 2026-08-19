import { NextResponse } from "next/server";

import { getRegionIdByAdministrativeCode } from "@/lib/mover-recommendation/administrativeCode";
import type { KakaoSearchResponse } from "@/lib/kakao/addressSearch";

const KAKAO_COORD2REGIONCODE_URL = "https://dapi.kakao.com/v2/local/geo/coord2regioncode.json";

interface KakaoRegionCodeDocument {
  region_type: "H" | "B";
  code: string;
}

function parseCoordinate(value: string | null, min: number, max: number): number | null {
  if (value === null || value.trim() === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= min && parsed <= max ? parsed : null;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const latitude = parseCoordinate(searchParams.get("latitude"), -90, 90);
  const longitude = parseCoordinate(searchParams.get("longitude"), -180, 180);

  if (latitude === null || longitude === null) {
    return NextResponse.json({ message: "유효한 위도와 경도가 필요합니다." }, { status: 400 });
  }

  const apiKey = process.env.KAKAO_REST_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { message: "KAKAO_REST_API_KEY가 설정되지 않았습니다." },
      { status: 500 },
    );
  }

  const url = new URL(KAKAO_COORD2REGIONCODE_URL);
  url.searchParams.set("x", String(longitude));
  url.searchParams.set("y", String(latitude));

  try {
    const response = await fetch(url, {
      headers: { Authorization: `KakaoAK ${apiKey}` },
      cache: "no-store",
    });
    const payload = (await response.json()) as KakaoSearchResponse<KakaoRegionCodeDocument> & {
      message?: string;
    };

    if (!response.ok) {
      return NextResponse.json(
        { message: payload.message || "카카오 행정구역 조회에 실패했습니다." },
        { status: 502 },
      );
    }

    const documents = payload.documents ?? [];
    const administrativeCode =
      documents.find((document) => document.region_type === "H")?.code ||
      documents.find((document) => document.region_type === "B")?.code ||
      "";
    const regionId = getRegionIdByAdministrativeCode(administrativeCode);

    if (regionId === null) {
      return NextResponse.json(
        { message: "선택한 주소의 서비스 지역을 확인할 수 없습니다." },
        { status: 422 },
      );
    }

    return NextResponse.json({ regionId });
  } catch {
    return NextResponse.json({ message: "카카오 행정구역 조회에 실패했습니다." }, { status: 502 });
  }
}
