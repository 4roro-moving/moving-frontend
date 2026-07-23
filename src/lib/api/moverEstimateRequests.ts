import axiosInstance from "./axiosInstance";
import { API_ROUTES } from "../constants/apiRoutes";
import type {
  MoverEstimateRequest,
  MoverEstimateRequestQuery,
  MoverEstimateRequestResponse,
} from "@/types/moverEstimateRequest";

type MockRequest = MoverEstimateRequest & { isServiceArea: boolean };

//빠르게 테스트하려고 넣어놓은 데이터입니다.
//추후에 제거하고 연결하겠습니다.
const MOCK_REQUESTS: MockRequest[] = [
  {
    id: 1,
    customer: { id: "mock-customer-1", name: "김고객" },
    moveType: "HOME",
    moveDate: "2026-09-01T00:00:00.000Z",
    fromAddress: "서울 중구 삼일대로 343",
    toAddress: "경기 성남시 분당구 판교역로 235",
    fromRegion: "서울",
    toRegion: "경기",
    isDesignated: false,
    isServiceArea: true,
    createdAt: "2026-07-21T02:15:08.867Z",
  },
  {
    id: 2,
    customer: { id: "mock-customer-2", name: "이무빙" },
    moveType: "SMALL",
    moveDate: "2026-08-12T00:00:00.000Z",
    fromAddress: "서울 마포구 월드컵북로 120",
    toAddress: "서울 강남구 테헤란로 152",
    fromRegion: "서울",
    toRegion: "서울",
    isDesignated: true,
    isServiceArea: true,
    createdAt: "2026-07-22T04:30:00.000Z",
  },
  {
    id: 3,
    customer: { id: "mock-customer-3", name: "박이사" },
    moveType: "OFFICE",
    moveDate: "2026-10-05T00:00:00.000Z",
    fromAddress: "인천 연수구 센트럴로 123",
    toAddress: "부산 해운대구 센텀중앙로 90",
    fromRegion: "인천",
    toRegion: "부산",
    isDesignated: false,
    isServiceArea: false,
    createdAt: "2026-07-20T09:00:00.000Z",
  },
];

function getMockMoverEstimateRequests(query: MoverEstimateRequestQuery) {
  const keyword = query.keyword?.trim().toLowerCase();
  const filtered = MOCK_REQUESTS.filter((request) => {
    if (keyword && !request.customer.name.toLowerCase().includes(keyword)) return false;

    const hasActiveFilter =
      Boolean(query.moveType?.length) ||
      query.isDesignated === true ||
      query.isServiceArea === true;

    if (!hasActiveFilter) return true;

    return (
      Boolean(query.moveType?.includes(request.moveType)) ||
      (query.isDesignated === true && request.isDesignated) ||
      (query.isServiceArea === true && request.isServiceArea)
    );
  }).sort((a, b) => {
    const field = query.sort === "moveDate" ? "moveDate" : "createdAt";
    return new Date(a[field]).getTime() - new Date(b[field]).getTime();
  });

  return {
    items: filtered.slice(0, query.limit),
    pagination: { nextCursor: null, hasNextPage: filtered.length > query.limit },
  };
}

export async function getMoverEstimateRequests(query: MoverEstimateRequestQuery) {
  if (process.env.NEXT_PUBLIC_USE_MOCK_ESTIMATE_REQUESTS === "true") {
    await new Promise((resolve) => setTimeout(resolve, 250));
    return getMockMoverEstimateRequests(query);
  }

  const params = new URLSearchParams();

  params.set("limit", String(query.limit));
  params.set("sort", query.sort);

  if (query.keyword) params.set("keyword", query.keyword);
  if (query.isDesignated !== undefined) {
    params.set("isDesignated", String(query.isDesignated));
  }
  if (query.isServiceArea !== undefined) {
    params.set("isServiceArea", String(query.isServiceArea));
  }
  query.moveType?.forEach((moveType) => params.append("moveType", moveType));

  const mockUser = process.env.NEXT_PUBLIC_MOCK_USER_EMAIL;
  const response = await axiosInstance.get<MoverEstimateRequestResponse>(
    `/api${API_ROUTES.ESTIMATES}/requests?${params.toString()}`,
    {
      headers: mockUser ? { "x-mock-user": mockUser } : undefined,
    },
  );

  return response.data.data;
}
