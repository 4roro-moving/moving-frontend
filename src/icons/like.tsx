import type { SVGProps } from "react";

type LikeIconProps = SVGProps<SVGSVGElement> & {
  /** 활성(채워진) 하트 여부 */
  isActive?: boolean;
  /** isActive와 동일. 찜 도메인에서 사용 */
  isFavorite?: boolean;
};

// 2026.07.24 정슬기 - [수정] 찜 상태에 따라 fill을 전환하도록 LikeIcon 확장
export default function LikeIcon({ isActive, isFavorite, className, ...props }: LikeIconProps) {
  const active = Boolean(isActive ?? isFavorite);

  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      focusable="false"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M12.001 20.5c-.35 0-.69-.1-.98-.3C7.54 17.95 4.5 15.1 4.5 11.4c0-2.45 1.9-4.4 4.3-4.4 1.2 0 2.3.5 3.2 1.4.9-.9 2-1.4 3.2-1.4 2.4 0 4.3 1.95 4.3 4.4 0 3.7-3.04 6.55-6.52 8.8-.29.2-.63.3-.98.3Z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill={active ? "currentColor" : "none"}
      />
    </svg>
  );
}
