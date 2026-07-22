export interface KakaoPostcodeData {
  zonecode: string;
  address: string;
  addressEnglish: string;
  addressType: "R" | "J";
  userSelectedType: "R" | "J";
  roadAddress: string;
  roadAddressEnglish: string;
  jibunAddress: string;
  jibunAddressEnglish: string;
  autoRoadAddress: string;
  autoJibunAddress: string;
  buildingCode: string;
  buildingName: string;
  apartment: "Y" | "N";
  sido: string;
  sigungu: string;
  bname: string;
  query: string;
  noSelected: "Y" | "N";
}

export interface KakaoPostcodeOptions {
  oncomplete?: (data: KakaoPostcodeData) => void;
  onresize?: (size: { width: number; height: number }) => void;
  onclose?: (state: "FORCE_CLOSE" | "COMPLETE_CLOSE") => void;
  onsearch?: (data: { q: string; count: number }) => void;
  width?: string | number;
  height?: string | number;
  animation?: boolean;
  focusInput?: boolean;
  autoMapping?: boolean;
  shorthand?: boolean;
  pleaseReadGuide?: number;
  maxSuggestItems?: number;
  hideMapBtn?: boolean;
  hideEngBtn?: boolean;
  theme?: Record<string, string>;
}

export interface KakaoPostcodeInstance {
  open: (options?: {
    q?: string;
    left?: number;
    top?: number;
    popupTitle?: string;
    popupKey?: string;
    autoClose?: boolean;
  }) => void;
  embed: (
    element: HTMLElement,
    options?: {
      q?: string;
      autoClose?: boolean;
    },
  ) => void;
}

export interface KakaoPostcodeConstructor {
  new (options: KakaoPostcodeOptions): KakaoPostcodeInstance;
}

declare global {
  interface Window {
    kakao?: {
      Postcode: KakaoPostcodeConstructor;
    };
    daum?: {
      Postcode: KakaoPostcodeConstructor;
    };
  }
}

export {};
