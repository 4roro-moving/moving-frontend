"use client";

import { useRouter } from "next/navigation";

import Button from "@/components/common/Button/Button";
import { Text } from "@/components/common/Text";
import { APP_ROUTES } from "@/lib/constants/appRoutes";

/**
 * 전역 404 안내 UI
 * // 2026.07.30 정슬기 - [추가] Empty/Error 톤에 맞춘 중앙 정렬 404
 * // 2026.07.31 정슬기 - [수정] 동일 origin referrer일 때만 back, 그 외 홈 이동
 */
export default function NotFoundView() {
  const router = useRouter();

  const handleBack = () => {
    try {
      const referrer = document.referrer;
      if (referrer) {
        const referrerOrigin = new URL(referrer).origin;
        if (referrerOrigin === window.location.origin) {
          router.back();
          return;
        }
      }
    } catch {
      // referrer URL 파싱 실패 시 홈으로 이동
    }
    router.push(APP_ROUTES.HOME);
  };

  return (
    <div className="bg-background-default px-margin-mobile md:px-margin-tablet flex w-full flex-1 flex-col items-center justify-center py-64 lg:px-0">
      <div className="max-w-container-desktop flex w-full flex-col items-center gap-32 md:gap-40">
        <div className="flex flex-col items-center gap-16 md:gap-20">
          <Text
            as="h1"
            variant={{ base: "3xl-bold", md: "3xl-bold" }}
            className="text-text-primary text-center"
          >
            404
          </Text>
          <div className="flex flex-col items-center gap-8 text-center">
            <Text
              as="p"
              variant={{ base: "lg-semibold", md: "2lg-semibold" }}
              className="text-text-primary"
            >
              페이지를 찾을 수 없습니다.
            </Text>
            <Text
              as="p"
              variant={{ base: "md-regular", md: "lg-regular" }}
              className="text-text-muted"
            >
              입력하신 주소가 잘못되었거나
              <br />
              페이지가 이동 또는 삭제되었을 수 있습니다.
            </Text>
          </div>
        </div>

        <div className="flex w-full flex-col gap-12 sm:w-auto sm:flex-row sm:justify-center sm:gap-16">
          <Button
            type="button"
            variant="solid"
            size="cta"
            className="w-full sm:w-auto sm:min-w-160"
            onClick={() => {
              router.push(APP_ROUTES.HOME);
            }}
          >
            홈으로 이동
          </Button>
          <Button
            type="button"
            variant="outline"
            size="cta"
            className="w-full sm:w-auto sm:min-w-160"
            onClick={handleBack}
          >
            이전 페이지로 이동
          </Button>
        </div>
      </div>
    </div>
  );
}
