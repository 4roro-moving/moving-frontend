"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";

import MoversErrorPanel from "@/components/mover/MoversErrorPanel";

interface MoverDetailErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function MoverDetailError({ error, reset }: MoverDetailErrorProps) {
  const t = useTranslations("moverSearch");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="bg-background-default flex w-full flex-1 flex-col items-center justify-center">
      <MoversErrorPanel
        title={t("detailError.title")}
        description={t("detailError.description")}
        actionLabel={t("retry")}
        isRetrying={false}
        onRetry={reset}
      />
    </div>
  );
}
