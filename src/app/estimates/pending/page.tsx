import { Text } from "@/components/common/Text";

export default function PendingEstimatesPage() {
  return (
    <div className="bg-background-subtle flex w-full flex-col items-center py-64">
      <div className="flex w-full max-w-[var(--container-desktop-narrow)] items-center justify-center py-80">
        <Text as="p" variant="lg-regular" className="text-text-muted">
          대기 중인 견적 화면은 준비 중입니다.
        </Text>
      </div>
    </div>
  );
}
