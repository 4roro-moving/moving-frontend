interface KakaoMapLatLng {
  getLat(): number;
  getLng(): number;
}

interface KakaoMapLatLngBounds {
  extend(position: KakaoMapLatLng): void;
}

interface KakaoMapInstance {
  setBounds(
    bounds: KakaoMapLatLngBounds,
    paddingTop?: number,
    paddingRight?: number,
    paddingBottom?: number,
    paddingLeft?: number,
  ): void;
}

interface KakaoMapMarker {
  setMap(map: KakaoMapInstance | null): void;
}

interface KakaoMapCustomOverlay {
  setMap(map: KakaoMapInstance | null): void;
}

interface KakaoMapPolyline {
  setMap(map: KakaoMapInstance | null): void;
}

interface KakaoMapMarkerClusterer {
  clear(): void;
}

interface KakaoMapsNamespace {
  load(callback: () => void): void;
  Map: new (
    container: HTMLElement,
    options: { center: KakaoMapLatLng; level?: number; tileAnimation?: boolean },
  ) => KakaoMapInstance;
  LatLng: new (latitude: number, longitude: number) => KakaoMapLatLng;
  LatLngBounds: new () => KakaoMapLatLngBounds;
  Size: new (width: number, height: number) => KakaoMapSize;
  Point: new (x: number, y: number) => KakaoMapPoint;
  MarkerImage: new (
    src: string,
    size: KakaoMapSize,
    options?: { offset?: KakaoMapPoint },
  ) => KakaoMapMarkerImage;
  Marker: new (options: {
    map?: KakaoMapInstance;
    position: KakaoMapLatLng;
    title?: string;
    image?: KakaoMapMarkerImage;
  }) => KakaoMapMarker;
  CustomOverlay: new (options: {
    position: KakaoMapLatLng;
    content: HTMLElement;
    xAnchor?: number;
    yAnchor?: number;
    zIndex?: number;
    clickable?: boolean;
  }) => KakaoMapCustomOverlay;
  Polyline: new (options: {
    map?: KakaoMapInstance;
    path: KakaoMapLatLng[];
    strokeWeight?: number;
    strokeColor?: string;
    strokeOpacity?: number;
    strokeStyle?:
      | "solid"
      | "shortdash"
      | "shortdot"
      | "shortdashdot"
      | "dot"
      | "dash"
      | "dashdot"
      | "longdash"
      | "longdashdot";
    zIndex?: number;
  }) => KakaoMapPolyline;
  event: {
    addListener(target: KakaoMapMarker, type: string, handler: () => void): void;
  };
  MarkerClusterer: new (options: {
    map: KakaoMapInstance;
    markers?: KakaoMapMarker[];
    averageCenter?: boolean;
    minLevel?: number;
    calculator?: number[];
    styles?: Array<Record<string, string>>;
  }) => KakaoMapMarkerClusterer;
}

interface KakaoMapSize {
  readonly __kakaoMapSize?: never;
}
interface KakaoMapPoint {
  readonly __kakaoMapPoint?: never;
}
interface KakaoMapMarkerImage {
  readonly __kakaoMapMarkerImage?: never;
}

interface Window {
  kakao?: {
    maps: KakaoMapsNamespace;
  };
}
