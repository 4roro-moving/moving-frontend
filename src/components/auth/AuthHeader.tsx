import Image from "next/image";
import Link from "next/link";

import { Text, getTextVariantClass } from "@/components/common/Text";
import { APP_ROUTES } from "@/lib/constants/appRoutes";
import { cn } from "@/lib/utils/cn";

/**
 * 로그인·회원가입 공통 헤더 (로고 + 기사님 전용 안내)
 * 사용자, 기사님 구분 추가할 예정
 */
const AuthHeader = () => {
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
          기사님이신가요?
        </Text>
        <Link
          href={APP_ROUTES.MOVER_LOGIN}
          className={cn(getTextVariantClass({ base: "link-xs", md: "link-xl" }), "text-text-brand")}
        >
          기사님 전용 페이지
        </Link>
      </p>
    </header>
  );
};

export default AuthHeader;
