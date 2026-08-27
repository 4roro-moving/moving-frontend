"use client";

import EmptyState from "@/components/common/EmptyState/EmptyState";
import { useTranslations } from "next-intl";

/** 잘못된 URL / 존재하지 않는 기사 공통 안내 UI */
export default function MoverDetailNotFoundStatus() {
  const t = useTranslations("profile");
  return (
    <div className="bg-background-default flex w-full flex-1 flex-col items-center justify-center">
      <EmptyState
        size="sm"
        imageSrc="/images/empty/character.png"
        description={
          <>
            {t("moverDetailNotFoundTitle")}
            <br />
            {t("moverDetailNotFoundDescription")}
          </>
        }
        buttonLabel={t("moverDetailBack")}
        href="/movers"
      />
    </div>
  );
}
