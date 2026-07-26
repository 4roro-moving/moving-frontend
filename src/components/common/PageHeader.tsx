import { Text } from "@/components/common/Text";

interface PageHeaderProps {
  title: string;
}

export function PageHeader({ title }: PageHeaderProps) {
  return (
    <header className="bg-background-default flex w-full items-center justify-center shadow-[0_2px_10px_0_rgba(248,248,248,0.1)]">
      <div className="px-margin-mobile md:px-margin-tablet h-page-header-height-mobile md:h-page-header-height-tablet lg:h-page-header-height-desktop max-w-container-desktop mx-auto flex w-full items-center lg:px-0">
        <Text
          as="h1"
          variant={{ base: "2lg-semibold", lg: "2xl-semibold" }}
          className="text-text-primary"
        >
          {title}
        </Text>
      </div>
    </header>
  );
}
