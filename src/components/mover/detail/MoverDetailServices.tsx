"use client";

import { Text } from "@/components/common/Text";
import { useTranslations } from "next-intl";
import {
  MoverOfferedServiceChips,
  MoverServiceChip,
} from "@/components/mover/detail/MoverServiceChip";
import type { MoverDetail } from "@/types/moverDetail";

interface MoverDetailServicesProps {
  detail: MoverDetail;
}

export default function MoverDetailServices({ detail }: MoverDetailServicesProps) {
  const t = useTranslations("profile");
  const tMoverSearch = useTranslations("moverSearch");
  return (
    <dl className="flex w-full flex-col gap-32 md:gap-40">
      <div className="flex w-full flex-col gap-16">
        <Text
          as="dt"
          variant={{ base: "lg-semibold", md: "xl-semibold" }}
          className="text-text-primary"
        >
          {t("moverServices")}
        </Text>
        <dd className="m-0">
          <MoverOfferedServiceChips serviceTypes={detail.serviceTypes} />
        </dd>
      </div>

      <div className="flex w-full flex-col gap-16">
        <Text
          as="dt"
          variant={{ base: "lg-semibold", md: "xl-semibold" }}
          className="text-text-primary"
        >
          {t("moverRegions")}
        </Text>
        <dd className="m-0 flex flex-wrap gap-8 md:gap-12">
          {detail.serviceAreas.map((regionId) => (
            <MoverServiceChip
              key={regionId}
              label={tMoverSearch(`regions.${regionId}`)}
              variant="region"
            />
          ))}
        </dd>
      </div>
    </dl>
  );
}
