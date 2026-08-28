/** Kakao JavaScript SDK (공유용). window.Kakao 전역 타입 */
declare global {
  interface KakaoShareLink {
    mobileWebUrl: string;
    webUrl: string;
  }

  interface KakaoShareDefaultText {
    objectType: "text";
    text: string;
    link: KakaoShareLink;
  }

  interface KakaoShareCustomSettings {
    templateId: number;
    templateArgs?: Record<string, string>;
    installTalk?: boolean;
    serverCallbackArgs?: Record<string, string> | string;
  }

  interface KakaoSDK {
    init: (javascriptKey: string) => void;
    isInitialized: () => boolean;
    Share: {
      sendDefault: (settings: KakaoShareDefaultText) => void;
      sendCustom: (settings: KakaoShareCustomSettings) => void;
    };
  }

  interface Window {
    Kakao?: KakaoSDK;
  }
}

export {};
