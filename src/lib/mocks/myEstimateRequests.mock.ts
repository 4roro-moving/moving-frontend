import { isConfirmedEstimate, isPendingEstimate } from "@/lib/utils/estimateFormat";
import type {
  MyEstimateRequestItem,
  MyPendingEstimateOffer,
  PendingEstimateDetailViewModel,
} from "@/types/estimate";

/**
 * 내 견적 요청 mock (백엔드 API 계약과 동일)
 * 컴포넌트에서 직접 import하지 말고 service를 통해 사용합니다.
 * // 2026.07.25 정슬기 - [추가] 내 견적 요청 mock
 */

export const MOCK_MY_ESTIMATE_REQUESTS: MyEstimateRequestItem[] = [
  {
    id: 102,
    customerId: "customer-1",
    moveType: "SMALL",
    moveDate: "2024-07-01T00:00:00.000Z",
    fromZipCode: "04523",
    fromAddress: "서울시 중구",
    fromDetailAddress: null,
    toZipCode: "16455",
    toAddress: "경기도 수원시",
    toDetailAddress: null,
    status: "OPEN",
    isActive: true,
    expiresAt: "2026-08-10T00:00:00.000Z",
    createdAt: "2024-06-24T00:00:00.000Z",
    canceledAt: null,
    fromRegion: { id: 1, name: "서울" },
    toRegion: { id: 2, name: "경기" },
    designatedMovers: [
      {
        moverId: "mover-code-301",
        createdAt: "2024-06-24T05:00:00.000Z",
        mover: {
          id: "mover-code-301",
          name: "김코드",
          moverProfile: {
            nickname: "김코드",
            imageUrl: null,
          },
        },
      },
    ],
    _count: { estimates: 4 },
  },
  {
    id: 101,
    customerId: "customer-1",
    moveType: "HOME",
    moveDate: "2026-09-15T00:00:00.000Z",
    fromZipCode: "04523",
    fromAddress: "서울 중구 삼일대로 343",
    fromDetailAddress: "10층",
    toZipCode: "13561",
    toAddress: "경기 성남시 분당구 판교역로 235",
    toDetailAddress: "101동 1203호",
    status: "PENDING",
    isActive: true,
    expiresAt: "2026-08-01T00:00:00.000Z",
    createdAt: "2026-07-20T02:15:08.867Z",
    canceledAt: null,
    fromRegion: { id: 1, name: "서울" },
    toRegion: { id: 2, name: "경기" },
    designatedMovers: [],
    _count: { estimates: 0 },
  },
  {
    id: 103,
    customerId: "customer-1",
    moveType: "OFFICE",
    moveDate: "2026-07-01T00:00:00.000Z",
    fromZipCode: "21998",
    fromAddress: "인천 연수구 센트럴로 123",
    fromDetailAddress: "3층",
    toZipCode: "48058",
    toAddress: "부산 해운대구 센텀중앙로 90",
    toDetailAddress: null,
    status: "COMPLETED",
    isActive: false,
    expiresAt: "2026-06-25T00:00:00.000Z",
    createdAt: "2026-06-01T09:00:00.000Z",
    canceledAt: null,
    fromRegion: { id: 3, name: "인천" },
    toRegion: { id: 4, name: "부산" },
    designatedMovers: [],
    _count: { estimates: 4 },
  },
];

/**
 * 대기 중 견적 목록 UI용 견적서 mock (requestId → offers)
 * API 계약과 분리된 ViewModel 조립용입니다.
 * // 2026.07.25 정슬기 - [추가] Figma 대기 목록 견적서 mock repository
 */
const KIM_CODE_OFFER = (id: number, isDesignated: boolean): MyPendingEstimateOffer => ({
  id,
  price: 180000,
  status: "SENT",
  isDesignated,
  createdAt: "2026-07-19T03:00:00.000Z",
  mover: {
    id: `mover-code-${id}`,
    name: "김코드",
    nickname: "김코드",
    imageUrl: null,
    career: 7,
    shortIntro: "고객님의 물품을 안전하게 운송해 드립니다.",
    averageRating: 5,
    reviewCount: 178,
    confirmedCount: 334,
    favoriteCount: 136,
    isFavorite: false,
  },
});

export const MOCK_PENDING_ESTIMATES_BY_REQUEST_ID: Record<number, MyPendingEstimateOffer[]> = {
  102: [
    KIM_CODE_OFFER(301, true),
    KIM_CODE_OFFER(302, true),
    KIM_CODE_OFFER(303, true),
    KIM_CODE_OFFER(304, true),
  ],
  101: [],
  103: [],
};

/**
 * 프론트 단계용 mock 견적 확정
 * 실제 confirm API는 백엔드 연동 시 service에서 교체합니다.
 * // 2026.07.25 정슬기 - [추가] 대기 목록 mock confirm
 */
export function confirmMockPendingEstimate(estimateId: number): MyPendingEstimateOffer {
  for (const [requestIdKey, offers] of Object.entries(MOCK_PENDING_ESTIMATES_BY_REQUEST_ID)) {
    const offerIndex = offers.findIndex((offer) => offer.id === estimateId);
    if (offerIndex < 0) {
      continue;
    }

    const requestId = Number(requestIdKey);
    const target = offers[offerIndex];
    if (!target) {
      break;
    }

    if (target.status === "CONFIRMED") {
      return target;
    }

    const hasConfirmed = offers.some((offer) => offer.status === "CONFIRMED");
    if (hasConfirmed) {
      throw new Error("이미 확정된 견적이 있어 추가로 확정할 수 없습니다.");
    }

    const confirmed: MyPendingEstimateOffer = {
      ...target,
      status: "CONFIRMED",
    };

    MOCK_PENDING_ESTIMATES_BY_REQUEST_ID[requestId] = offers.map((offer, index) => {
      if (index === offerIndex) {
        return confirmed;
      }
      if (offer.status === "SENT") {
        return { ...offer, status: "EXPIRED" };
      }
      return offer;
    });

    const request = MOCK_MY_ESTIMATE_REQUESTS.find((item) => item.id === requestId);
    if (request) {
      request.status = "CONFIRMED";
    }

    return confirmed;
  }

  throw new Error("견적을 찾을 수 없습니다.");
}

/**
 * 대기 견적 상세 ViewModel 조립 (목록 mock 기반)
 * // 2026.07.25 정슬기 - [추가] pending detail mock — 실 API 미호출
 */
export function getMockPendingEstimateDetail(estimateId: number): PendingEstimateDetailViewModel {
  for (const [requestIdKey, offers] of Object.entries(MOCK_PENDING_ESTIMATES_BY_REQUEST_ID)) {
    const offer = offers.find((item) => item.id === estimateId);
    if (!offer) {
      continue;
    }

    const requestId = Number(requestIdKey);
    const request = MOCK_MY_ESTIMATE_REQUESTS.find((item) => item.id === requestId);
    if (!request) {
      break;
    }

    const isConfirmed = isConfirmedEstimate(offer.status);
    const hasOtherConfirmed = offers.some(
      (item) => item.id !== offer.id && isConfirmedEstimate(item.status),
    );
    const canConfirm = isPendingEstimate(offer.status) && !hasOtherConfirmed;
    const confirmDisabledReason = canConfirm
      ? null
      : isConfirmed
        ? null
        : "이미 확정된 견적이 있어 추가로 확정할 수 없습니다.";

    return {
      id: offer.id,
      price: offer.price,
      comment: offer.mover.shortIntro ?? "",
      status: offer.status,
      isDesignated: offer.isDesignated,
      isConfirmed,
      canConfirm,
      confirmDisabledReason,
      // Info "견적 요청일" 표시용 — 요청 createdAt
      createdAt: request.createdAt,
      updatedAt: offer.createdAt,
      confirmedAt: isConfirmed ? offer.createdAt : null,
      estimateRequest: {
        id: request.id,
        moveType: request.moveType,
        moveDate: request.moveDate,
        fromZipCode: request.fromZipCode,
        fromAddress: request.fromAddress,
        fromDetailAddress: request.fromDetailAddress,
        fromRegion: request.fromRegion,
        toZipCode: request.toZipCode,
        toAddress: request.toAddress,
        toDetailAddress: request.toDetailAddress,
        toRegion: request.toRegion,
        status: request.status,
        confirmedEstimateId: isConfirmed
          ? offer.id
          : (offers.find((item) => isConfirmedEstimate(item.status))?.id ?? null),
      },
      mover: {
        ...offer.mover,
        description: offer.mover.shortIntro,
        serviceTypes: [request.moveType],
        serviceAreas: [request.fromRegion, request.toRegion],
      },
    };
  }

  throw new Error("견적을 찾을 수 없습니다.");
}
