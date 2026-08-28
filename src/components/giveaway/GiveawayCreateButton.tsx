"use client";

import { useTranslations } from "next-intl";

import Button from "@/components/common/Button/Button";

interface GiveawayCreateButtonProps {
  onClick?: () => void;
  disabled?: boolean;
}

const GiveawayCreateButton = ({ onClick, disabled = false }: GiveawayCreateButtonProps) => {
  const t = useTranslations("giveaway");

  return (
    <div className="flex w-full justify-end">
      <Button
        type="button"
        size="cta"
        className="w-full xl:w-auto"
        disabled={disabled}
        onClick={onClick}
      >
        {t("write")}
      </Button>
    </div>
  );
};

export default GiveawayCreateButton;
