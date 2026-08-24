import { Text } from "@/components/common/Text";
import { GIVEAWAY_REPORT_BUTTON_LABEL } from "@/lib/constants/giveaway";
import { cn } from "@/lib/utils/cn";

interface GiveawayReportButtonProps {
  className?: string;
}

const GiveawayReportButton = ({ className }: GiveawayReportButtonProps) => {
  return (
    <button
      type="button"
      disabled
      aria-label="신고하기. 아직 사용할 수 없습니다."
      className={cn("text-text-muted underline disabled:cursor-not-allowed", className)}
    >
      <Text
        as="span"
        variant={{ base: "sm-medium", xl: "md-medium" }}
        className="text-text-muted underline"
      >
        {GIVEAWAY_REPORT_BUTTON_LABEL}
      </Text>
    </button>
  );
};

export default GiveawayReportButton;
