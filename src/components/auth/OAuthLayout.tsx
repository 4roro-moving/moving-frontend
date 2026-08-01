import EmptyState from "@/components/common/EmptyState/EmptyState";

const OAUTH_LOADING_IMAGE = "/images/empty/moving-car.png";
const OAUTH_ERROR_IMAGE = "/images/empty-received-requests.png";
const OAUTH_LOADING_MESSAGE = "로그인 처리 중...";
const DEFAULT_LOGIN_BUTTON_LABEL = "로그인으로 돌아가기";

interface OAuthLayoutProps {
  /** 에러 문구. 있으면 에러 UI + 로그인 버튼, 없으면 로딩 UI */
  error?: string | null;
  /** 에러 시 로그인 이동 경로 */
  loginHref: string;
  loginButtonLabel?: string;
}

/**
 * OAuth callback 로딩·에러 공통 레이아웃.
 * Figma empty-state: Mobile/Tablet sm · Desktop lg
 */
const OAuthLayout = ({
  error,
  loginHref,
  loginButtonLabel = DEFAULT_LOGIN_BUTTON_LABEL,
}: OAuthLayoutProps) => {
  const isError = Boolean(error);
  const imageSrc = isError ? OAUTH_ERROR_IMAGE : OAUTH_LOADING_IMAGE;
  const description = isError ? error : OAUTH_LOADING_MESSAGE;
  const buttonLabel = isError ? loginButtonLabel : undefined;
  const href = isError ? loginHref : undefined;

  return (
    <div className="bg-background-subtle px-margin-mobile flex w-full flex-1 flex-col items-center justify-center md:px-72 lg:px-0">
      <EmptyState
        size="sm"
        imageSrc={imageSrc}
        description={description}
        buttonLabel={buttonLabel}
        href={href}
        imageAlt=""
        className="lg:hidden"
      />
      <EmptyState
        size="lg"
        imageSrc={imageSrc}
        description={description}
        buttonLabel={buttonLabel}
        href={href}
        imageAlt=""
        className="hidden lg:flex"
      />
    </div>
  );
};

export default OAuthLayout;
