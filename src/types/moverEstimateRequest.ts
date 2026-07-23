export type MoveType = "SMALL" | "HOME" | "OFFICE";
export type RequestSort = "moveDate" | "requestedAt";

export type MoverEstimateRequest = {
  id: number;
  customer: {
    id: string;
    name: string;
  };
  moveType: MoveType;
  moveDate: string;
  fromAddress: string;
  toAddress: string;
  fromRegion: string;
  toRegion: string;
  isDesignated: boolean;
  createdAt: string;
};

export type MoverEstimateRequestQuery = {
  keyword?: string;
  moveType?: MoveType[];
  isDesignated?: boolean;
  isServiceArea?: boolean;
  sort: RequestSort;
  limit: number;
};

export type MoverEstimateRequestResponse = {
  success: true;
  data: {
    items: MoverEstimateRequest[];
    pagination: {
      nextCursor: string | null;
      hasNextPage: boolean;
    };
  };
};
