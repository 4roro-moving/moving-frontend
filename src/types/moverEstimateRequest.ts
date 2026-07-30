import type { MoveType } from "@/types/move";

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
  cursor?: string;
  keyword?: string;
  moveType?: MoveType[];
  isDesignated?: boolean;
  isServiceArea?: boolean;
  sort: RequestSort;
  limit: number;
};

export type MoverEstimateRequestResponse =
  | {
      success: true;
      data: {
        items: MoverEstimateRequest[];
        pagination: {
          nextCursor: string | null;
          hasNextPage: boolean;
          totalCount: number;
        };
      };
    }
  | {
      success: false;
      error: {
        code: string;
        message: string;
      };
    };

// 기사 견적 전송 요청 Body
export type SendEstimateRequest = {
  price: number;
  comment: string;
};

export type RejectEstimateRequest = {
  reason: string;
};

// 기사 견적 전송 성공 데이터
export type SentEstimate = {
  id: number;
  estimateRequestId: number;
  moverId: string;
  price: number;
  comment: string;
  status: "SENT";
  isDesignated: boolean;
  createdAt: string;
};

// 기사 견적 전송 API 응답
export type SendEstimateResponse =
  | {
      success: true;
      data: SentEstimate;
    }
  | {
      success: false;
      error: {
        code: string;
        message: string;
      };
    };

export type RejectedEstimate = {
  id: number;
  estimateRequestId: number;
  moverId: string;
  reason: string;
  createdAt: string;
};

export type RejectEstimateResponse =
  | {
      success: true;
      data: RejectedEstimate;
    }
  | {
      success: false;
      error: {
        code: string;
        message: string;
      };
    };

//기사 견적 반려 조회
export type RejectedEstimateRequestItem = {
  id: number;
  reason: string;
  rejectedAt: string;
  request: {
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
  };
};

export type RejectedEstimateRequestListResponse =
  | {
      success: true;
      data: {
        items: RejectedEstimateRequestItem[];
        pagination: {
          nextCursor: string | null;
          hasNextPage: boolean;
        };
      };
    }
  | {
      success: false;
      error: {
        code: string;
        message: string;
      };
    };
