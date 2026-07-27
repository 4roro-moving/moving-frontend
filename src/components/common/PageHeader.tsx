import { Text } from "@/components/common/Text";

interface PageHeaderProps {
  title: string;
}

export function PageHeader({ title }: PageHeaderProps) {
  return (
    <header className="bg-background-default shadow-page-header flex w-full items-center justify-center">
      <div className="px-margin-mobile md:px-margin-tablet h-page-header-height-mobile md:h-page-header-height-tablet lg:h-page-header-height-desktop max-w-container-desktop mx-auto flex w-full items-center lg:px-0">
        <Text as="h1" variant="pageTitle" className="text-text-primary">
          {title}
        </Text>
      </div>
    </header>
  );
}
