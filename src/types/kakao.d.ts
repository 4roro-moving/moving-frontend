interface KakaoShareLink {
  mobileWebUrl: string;
  webUrl: string;
}

interface KakaoShareDefaultText {
  objectType: "text";
  text: string;
  link: KakaoShareLink;
}

interface KakaoSDK {
  init: (appKey: string) => void;
  isInitialized: () => boolean;
  Share: {
    sendDefault: (settings: KakaoShareDefaultText) => void;
  };
}

declare global {
  interface Window {
    Kakao?: KakaoSDK;
  }
}

export {};
