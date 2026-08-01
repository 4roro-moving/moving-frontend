import type { Metadata } from "next";

import { buildMoverShareTitle, MOVER_SHARE_DESCRIPTION } from "@/lib/share/shareText";
import { buildSharePageMetadata } from "@/lib/share/openGraph";
import type { MoverDetailItem } from "@/types/mover";

export function buildMoverDetailMetadata(moverId: string, mover: MoverDetailItem): Metadata {
  return buildSharePageMetadata({
    title: buildMoverShareTitle(mover.nickname),
    description: MOVER_SHARE_DESCRIPTION,
    path: `/movers/${moverId}`,
    imageUrl: mover.profileImageUrl,
    imageAlt: `${mover.nickname} 기사님 프로필`,
  });
}
