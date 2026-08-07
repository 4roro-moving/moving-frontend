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

interface KakaoMapsNamespace {
  load(callback: () => void): void;
  Map: new (
    container: HTMLElement,
    options: { center: KakaoMapLatLng; level?: number },
  ) => KakaoMapInstance;
  LatLng: new (latitude: number, longitude: number) => KakaoMapLatLng;
  LatLngBounds: new () => KakaoMapLatLngBounds;
  Marker: new (options: {
    map: KakaoMapInstance;
    position: KakaoMapLatLng;
    title?: string;
  }) => KakaoMapMarker;
}

interface Window {
  kakao?: {
    maps: KakaoMapsNamespace;
  };
}
