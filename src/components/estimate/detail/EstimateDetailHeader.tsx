import { Text } from "@/components/common/Text";

interface EstimateDetailHeaderProps {
  title?: string;
}

export default function EstimateDetailHeader({ title = "견적 상세" }: EstimateDetailHeaderProps) {
  return (
    <header className="bg-background-default flex h-[54px] w-full items-center justify-center px-16 shadow-[0_2px_10px_0_rgba(248,248,248,0.1)] md:h-[var(--page-header-height-desktop)] md:px-[var(--page-header-padding-x-desktop)]">
      <div className="flex w-full max-w-[1200px] flex-1 items-center">
        <Text as="h1" variant="2xl-semibold" className="text-text-primary">
          {title}
        </Text>
      </div>
    </header>
  );
}
