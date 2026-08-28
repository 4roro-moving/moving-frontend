export type PricePredictionMoveType = "SMALL" | "HOME" | "OFFICE";

export type PricePredictionLoadAmount = "LOW" | "MEDIUM" | "HIGH";

export interface PricePredictionRequest {
  moveType: PricePredictionMoveType;
  fromRegion: string;
  toRegion: string;
  distanceKm: number;
  houseSize: number;
  loadAmount: PricePredictionLoadAmount;
  fromFloor: number;
  fromElevator: boolean;
  toFloor: number;
  toElevator: boolean;
  ladderTruck: boolean;
  moveDate: string;
}

export interface PricePredictionResponse {
  estimatedPrice: number;
  priceRange: {
    min: number;
    max: number;
  };
  sampleCount: number;
  factors: {
    moveType: PricePredictionMoveType;
    route: string;
    distanceKm: number;
    houseSize: number;
    loadAmount: PricePredictionLoadAmount;
    isWeekend: boolean;
    isPeakSeason: boolean;
  };
}

export interface RouteDistanceRequest {
  origin: {
    latitude: number;
    longitude: number;
  };
  destination: {
    latitude: number;
    longitude: number;
  };
}

export interface RouteDistanceResponse {
  distanceKm: number;
  distanceMeters: number;
  durationSeconds: number;
}
