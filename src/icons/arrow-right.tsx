import type { SVGProps } from "react";
import { cn } from "@/lib/utils/cn";

import ArrowRight8Icon from "./arrow-right-8.svg";
import ArrowRight12Icon from "./arrow-right-12.svg";
import ArrowRight16Icon from "./arrow-right-16.svg";

export type ArrowRightIconSize = 8 | 12 | 16;

interface ArrowRightIconProps extends Omit<SVGProps<SVGSVGElement>, "width" | "height"> {
  size?: ArrowRightIconSize;
}

const ARROW_RIGHT_ICONS = {
  8: ArrowRight8Icon,
  12: ArrowRight12Icon,
  16: ArrowRight16Icon,
} satisfies Record<ArrowRightIconSize, React.ComponentType<SVGProps<SVGSVGElement>>>;

const ARROW_RIGHT_WIDTHS = {
  8: 9,
  12: 13,
  16: 17,
} satisfies Record<ArrowRightIconSize, number>;

/** Figma `ic/arrow-right`의 길이 variant를 지원하는 오른쪽 화살표 아이콘 */
export default function ArrowRightIcon({ size = 8, className, ...props }: ArrowRightIconProps) {
  const Icon = ARROW_RIGHT_ICONS[size];

  return (
    <Icon
      width={ARROW_RIGHT_WIDTHS[size]}
      height={8}
      className={cn("text-icon-arrow-right-fill", className)}
      {...props}
    />
  );
}
