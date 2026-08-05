declare global {
  interface FacebookShareParams {
    method: "share";
    href: string;
    display?: "popup" | "page" | "iframe" | "async" | "touch";
    hashtag?: string;
    quote?: string;
    redirect_uri?: string;
  }

  interface FacebookSDKConfig {
    appId: string;
    xfbml?: boolean;
    version?: string;
  }

  interface FacebookShareResponse {
    error_code?: number;
    error_message?: string;
  }

  interface FacebookSDK {
    init: (config: FacebookSDKConfig) => void;
    ui: (params: FacebookShareParams, callback?: (response: FacebookShareResponse) => void) => void;
    AppEvents: {
      logPageView: () => void;
    };
  }

  interface Window {
    FB?: FacebookSDK;
  }
}

export {};
