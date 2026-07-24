import { Text } from "@/components/common/Text";

interface EstimateDetailHeaderProps {
  title?: string;
}

export default function EstimateDetailHeader({ title = "견적 상세" }: EstimateDetailHeaderProps) {
  return (
    // 2026.07.24 정슬기 - [수정] Figma Mobile/Tablet 페이지 헤더 높이·여백, Desktop(lg) 기존 유지
    // 2026.07.24 정슬기 - [수정] page-header height/padding·container를 디자인 토큰 유틸로 교체
    <header className="bg-background-default px-margin-mobile md:px-margin-tablet h-page-header-height-mobile md:h-page-header-height-tablet lg:h-page-header-height-desktop lg:px-page-header-padding-x-desktop flex w-full items-center justify-center shadow-[0_2px_10px_0_rgba(248,248,248,0.1)]">
      <div className="max-w-container-desktop flex w-full flex-1 items-center">
        {/* 2026.07.24 정슬기 - [수정] 반응형 타이포를 Text variant로 분리 (단일 h1 유지) */}
        <h1 className="text-text-primary">
          <Text as="span" variant="2lg-semibold" className="lg:hidden">
            {title}
          </Text>
          <Text as="span" variant="2xl-semibold" className="hidden lg:inline">
            {title}
          </Text>
        </h1>
      </div>
    </header>
  );
}
