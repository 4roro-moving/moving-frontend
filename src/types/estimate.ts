export type MoveType = "SMALL" | "HOME" | "OFFICE";

export type EstimateOfferStatus = "pending" | "confirmed";

export interface EstimateOfferMover {
  id: string;
  name: string;
  imageUrl: string | null;
  career: number;
  shortIntro: string | null;
  averageRating: number;
  reviewCount: number;
  confirmedCount: number;
  favoriteCount: number;
}

export interface EstimateOffer {
  id: number;
  price: number;
  status: EstimateOfferStatus;
  isDesignated: boolean;
  moveType: MoveType;
  mover: EstimateOfferMover;
}

export interface EstimateRequestSummaryData {
  id: number;
  createdAtLabel: string;
  moveTypeLabel: string;
  fromAddress: string;
  toAddress: string;
  moveDateLabel: string;
}

export interface ReceivedEstimatePanel {
  request: EstimateRequestSummaryData;
  offers: EstimateOffer[];
}

export type EstimateOfferFilter = "all" | "confirmed" | "pending";
