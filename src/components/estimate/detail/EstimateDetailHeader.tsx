import { Text } from "@/components/common/Text";

interface EstimateDetailHeaderProps {
  title?: string;
}

export default function EstimateDetailHeader({ title = "견적 상세" }: EstimateDetailHeaderProps) {
  return (
    // 2026.07.24 정슬기 - [수정] Figma Mobile/Tablet 페이지 헤더 높이·여백, Desktop(lg) 기존 유지
    <header className="bg-background-default px-margin-mobile md:px-margin-tablet flex h-[var(--page-header-height-mobile)] w-full items-center justify-center shadow-[0_2px_10px_0_rgba(248,248,248,0.1)] md:h-[var(--page-header-height-tablet)] lg:h-[var(--page-header-height-desktop)] lg:px-[var(--page-header-padding-x-desktop)]">
      <div className="flex w-full max-w-[1200px] flex-1 items-center">
        <Text
          as="h1"
          variant="2lg-semibold"
          className="text-text-primary lg:text-[length:var(--font-size-24)] lg:leading-[var(--line-height-32)]"
        >
          {title}
        </Text>
      </div>
    </header>
  );
}
