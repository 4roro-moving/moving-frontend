import Link from "next/link";
import type { ReactNode } from "react";

import RoleGuard from "@/components/auth/RoleGuard";
import { Text } from "@/components/common/Text";
import { APP_ROUTES } from "@/lib/constants/appRoutes";
import type { AuthRole } from "@/lib/auth/role";

interface InquiryLayoutProps {
  children: ReactNode;
}

const INQUIRY_ALLOWED_ROLES: AuthRole[] = ["CUSTOMER", "MOVER"];

const InquiryLoginSelection = () => {
  return (
    <main className="px-margin-mobile max-w-container-desktop mx-auto flex min-h-[480px] w-full items-center justify-center md:px-40">
      <div className="flex w-full max-w-[420px] flex-col items-center gap-24 text-center">
        <div className="flex flex-col gap-8">
          <Text as="h1" variant="2xl-bold" className="text-text-primary">
            로그인이 필요합니다
          </Text>

          <Text as="p" variant="md-regular" className="text-text-secondary">
            이용하시는 계정 유형을 선택해 주세요.
          </Text>
        </div>

        <div className="flex w-full flex-col gap-12">
          <Link
            href={`${APP_ROUTES.LOGIN}?redirect=${encodeURIComponent(APP_ROUTES.INQUIRIES.ROOT)}`}
            className="bg-background-brand text-text-inverse rounded-8 px-20 py-12"
          >
            <Text as="span" variant="md-semibold">
              일반 사용자 로그인
            </Text>
          </Link>

          <Link
            href={`${APP_ROUTES.MOVER_LOGIN}?redirect=${encodeURIComponent(
              APP_ROUTES.INQUIRIES.ROOT,
            )}`}
            className="border-border-brand text-text-brand rounded-8 border px-20 py-12"
          >
            <Text as="span" variant="md-semibold">
              기사님 로그인
            </Text>
          </Link>
        </div>
      </div>
    </main>
  );
};

export default function InquiryLayout({ children }: InquiryLayoutProps) {
  return (
    <RoleGuard
      allowedRole={INQUIRY_ALLOWED_ROLES}
      unauthenticatedFallback={<InquiryLoginSelection />}
    >
      {children}
    </RoleGuard>
  );
}
