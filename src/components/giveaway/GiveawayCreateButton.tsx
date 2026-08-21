"use client";

import Button from "@/components/common/Button/Button";
import { GIVEAWAY_WRITE_BUTTON_LABEL } from "@/lib/constants/giveaway";

interface GiveawayCreateButtonProps {
  onClick: () => void;
}

const GiveawayCreateButton = ({ onClick }: GiveawayCreateButtonProps) => {
  return (
    <div className="flex w-full justify-end">
      <Button type="button" size="cta" className="w-full xl:w-auto" onClick={onClick}>
        {GIVEAWAY_WRITE_BUTTON_LABEL}
      </Button>
    </div>
  );
};

export default GiveawayCreateButton;
