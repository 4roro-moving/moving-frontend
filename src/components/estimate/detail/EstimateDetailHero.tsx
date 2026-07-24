import Image from "next/image";

import { ProfileDefaultIcon } from "@/icons";

interface EstimateDetailHeroProps {
  imageUrl: string | null;
  name: string;
}

export default function EstimateDetailHero({ imageUrl, name }: EstimateDetailHeroProps) {
  return (
    <div className="relative h-[200px] w-full shrink-0 md:h-[259px]">
      <div className="bg-background-brand absolute top-0 left-1/2 h-[170px] w-full max-w-[1920px] -translate-x-1/2 overflow-hidden md:h-[225px]">
        <div
          className="bg-icon-brand-tertiary pointer-events-none absolute top-1/2 left-[calc(50%+314px)] hidden size-[240px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 md:block"
          aria-hidden="true"
        />
        <div
          className="bg-icon-brand-tertiary pointer-events-none absolute top-1/2 left-[calc(50%-665px)] hidden size-[120px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 md:block"
          aria-hidden="true"
        />
      </div>

      <div className="rounded-20 absolute bottom-0 left-16 size-[96px] overflow-hidden md:top-[122px] md:bottom-auto md:left-[max(1rem,calc(50%-600px))] md:h-[137px] md:w-[129px]">
        <div className="relative size-full">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={`${name} 기사님 프로필`}
              fill
              sizes="(max-width: 768px) 96px, 129px"
              className="object-cover"
            />
          ) : (
            <ProfileDefaultIcon className="size-full" aria-hidden="true" />
          )}
        </div>
      </div>
    </div>
  );
}
