import type { MoveType } from "@/types/move";

export type SentEstimateDisplayStatus = "SENT" | "CONFIRMED" | "COMPLETED";
export type SentEstimateStatus = "SENT" | "CONFIRMED" | "EXPIRED" | "CANCELED";

export interface SentEstimate {
  id: number;
  price: number;
  comment: string;
  status: SentEstimateDisplayStatus;
  estimateStatus: SentEstimateStatus;
  isDesignated: boolean;
  createdAt: string;
  updatedAt: string;
  confirmedAt: string | null;
  customer: {
    id: string;
    name: string;
  };
  estimateRequest: {
    id: number;
    moveType: MoveType;
    moveDate: string;
    fromZipCode: string;
    fromAddress: string;
    fromDetailAddress: string | null;
    fromRegion: { id: number; name: string };
    toZipCode: string;
    toAddress: string;
    toDetailAddress: string | null;
    toRegion: { id: number; name: string };
    status: "PENDING" | "OPEN" | "CONFIRMED" | "COMPLETED" | "EXPIRED" | "CANCELED";
    requestedAt: string;
    completedAt: string | null;
  };
}
