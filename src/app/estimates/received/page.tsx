import ReceivedEstimatesList from "@/components/estimate/received/ReceivedEstimatesList";
import type { ReceivedEstimatePanel } from "@/types/estimate";

/**
 * Desktop UI 확인용 임시 데이터.
 * 고객용 받은 견적 API 라우트가 연결되면 props/query로 교체합니다.
 */
const MOCK_PANELS: ReceivedEstimatePanel[] = [
  {
    request: {
      id: 1,
      createdAtLabel: "24. 06. 24.",
      moveTypeLabel: "사무실 이사",
      fromAddress: "서울 중구 삼일대로 343",
      toAddress: "서울 강남구 선릉로 428",
      moveDateLabel: "2024년 07월 01일 (월)",
    },
    offers: [
      {
        id: 101,
        price: 180000,
        status: "confirmed",
        isDesignated: true,
        moveType: "OFFICE",
        mover: {
          id: "mover-1",
          name: "김코드",
          imageUrl: null,
          career: 7,
          shortIntro: "고객님의 물품을 안전하게 운송해 드립니다.",
          averageRating: 5,
          reviewCount: 178,
          confirmedCount: 334,
          favoriteCount: 136,
        },
      },
      {
        id: 102,
        price: 180000,
        status: "pending",
        isDesignated: true,
        moveType: "OFFICE",
        mover: {
          id: "mover-2",
          name: "김코드",
          imageUrl: null,
          career: 7,
          shortIntro: "고객님의 물품을 안전하게 운송해 드립니다.",
          averageRating: 5,
          reviewCount: 178,
          confirmedCount: 334,
          favoriteCount: 136,
        },
      },
      {
        id: 103,
        price: 180000,
        status: "pending",
        isDesignated: true,
        moveType: "OFFICE",
        mover: {
          id: "mover-3",
          name: "김코드",
          imageUrl: null,
          career: 7,
          shortIntro: "고객님의 물품을 안전하게 운송해 드립니다.",
          averageRating: 5,
          reviewCount: 178,
          confirmedCount: 334,
          favoriteCount: 136,
        },
      },
      {
        id: 104,
        price: 180000,
        status: "pending",
        isDesignated: true,
        moveType: "OFFICE",
        mover: {
          id: "mover-4",
          name: "김코드",
          imageUrl: null,
          career: 7,
          shortIntro: "고객님의 물품을 안전하게 운송해 드립니다.",
          averageRating: 5,
          reviewCount: 178,
          confirmedCount: 334,
          favoriteCount: 136,
        },
      },
    ],
  },
  {
    request: {
      id: 2,
      createdAtLabel: "24. 06. 24.",
      moveTypeLabel: "사무실 이사",
      fromAddress: "서울 중구 삼일대로 343",
      toAddress: "서울 강남구 선릉로 428",
      moveDateLabel: "2024년 07월 01일 (월)",
    },
    offers: [
      {
        id: 201,
        price: 180000,
        status: "confirmed",
        isDesignated: true,
        moveType: "OFFICE",
        mover: {
          id: "mover-5",
          name: "김코드",
          imageUrl: null,
          career: 7,
          shortIntro: "고객님의 물품을 안전하게 운송해 드립니다.",
          averageRating: 5,
          reviewCount: 178,
          confirmedCount: 334,
          favoriteCount: 136,
        },
      },
      {
        id: 202,
        price: 180000,
        status: "pending",
        isDesignated: true,
        moveType: "OFFICE",
        mover: {
          id: "mover-6",
          name: "김코드",
          imageUrl: null,
          career: 7,
          shortIntro: "고객님의 물품을 안전하게 운송해 드립니다.",
          averageRating: 5,
          reviewCount: 178,
          confirmedCount: 334,
          favoriteCount: 136,
        },
      },
      {
        id: 203,
        price: 180000,
        status: "pending",
        isDesignated: true,
        moveType: "OFFICE",
        mover: {
          id: "mover-7",
          name: "김코드",
          imageUrl: null,
          career: 7,
          shortIntro: "고객님의 물품을 안전하게 운송해 드립니다.",
          averageRating: 5,
          reviewCount: 178,
          confirmedCount: 334,
          favoriteCount: 136,
        },
      },
      {
        id: 204,
        price: 180000,
        status: "pending",
        isDesignated: true,
        moveType: "OFFICE",
        mover: {
          id: "mover-8",
          name: "김코드",
          imageUrl: null,
          career: 7,
          shortIntro: "고객님의 물품을 안전하게 운송해 드립니다.",
          averageRating: 5,
          reviewCount: 178,
          confirmedCount: 334,
          favoriteCount: 136,
        },
      },
    ],
  },
];

export default function ReceivedEstimatesPage() {
  return (
    <main className="bg-background-subtle flex min-h-screen w-full flex-col items-center py-64">
      <ReceivedEstimatesList panels={MOCK_PANELS} />
    </main>
  );
}
