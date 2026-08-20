import Image from "next/image";
import Link from "next/link";

import { Text, getTextVariantClass } from "@/components/common/Text";
import { getSignUpPath, getSocialSignUpPath, type AuthAudience } from "@/lib/auth/redirect";
import { APP_ROUTES } from "@/lib/constants/appRoutes";
import { cn } from "@/lib/utils/cn";

type AuthHeaderMode = "login" | "signup" | "social-signup";

interface AuthHeaderProps {
  audience?: AuthAudience;
  mode?: AuthHeaderMode;
}

const getOppositeAudience = (audience: AuthAudience): AuthAudience => {
  return audience === "mover" ? "customer" : "mover";
};

const getSwitchHref = (audience: AuthAudience, mode: AuthHeaderMode): string => {
  const oppositeAudience = getOppositeAudience(audience);

  if (mode === "signup") {
    return getSignUpPath(oppositeAudience);
  }

  if (mode === "social-signup") {
    return getSocialSignUpPath(oppositeAudience);
  }

  return oppositeAudience === "mover" ? APP_ROUTES.MOVER_LOGIN : APP_ROUTES.LOGIN;
};

/**
 * 로그인·회원가입 공통 헤더 (로고 + 역할 전환 안내)
 */
const AuthHeader = ({ audience = "customer", mode = "login" }: AuthHeaderProps) => {
  const isMoverAudience = audience === "mover";

  return (
    <header className="flex w-full flex-col items-center gap-0 md:gap-8">
      <div className="flex h-104 w-full items-center justify-center py-20 md:h-auto">
        <Link href="/" aria-label="무빙 홈으로 이동">
          <Image
            src="/icons/moving-logo-text.svg"
            alt="무빙"
            width={112}
            height={44}
            priority
            className="h-44 w-auto md:h-[55px] md:w-[107px]"
          />
        </Link>
      </div>

      <p className="flex items-center justify-center gap-4 md:gap-8">
        <Text
          as="span"
          variant={{ base: "xs-regular", md: "xl-regular" }}
          className="text-text-description"
        >
          {isMoverAudience ? "일반 유저라면?" : "기사님이신가요?"}
        </Text>
        <Link
          href={getSwitchHref(audience, mode)}
          className={cn(getTextVariantClass({ base: "link-xs", md: "link-xl" }), "text-text-brand")}
        >
          {isMoverAudience ? "일반 유저 전용 페이지" : "기사님 전용 페이지"}
        </Link>
      </p>
    </header>
  );
};

export default AuthHeader;
