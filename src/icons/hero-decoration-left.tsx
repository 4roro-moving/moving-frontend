import type { SVGProps } from "react";

// 2026.07.25 정슬기 - [추가] Figma hero-decoration(좌측) SVG export → React 컴포넌트
export default function HeroDecorationLeftIcon({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="170"
      height="115"
      viewBox="0 0 170 115"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
      focusable="false"
      aria-hidden="true"
    >
      <g opacity="0.2">
        <rect
          x="102.283"
          y="16.4844"
          width="27.3446"
          height="74.221"
          rx="13.6723"
          transform="rotate(-10.4621 102.283 16.4844)"
          fill="currentColor"
        />
        <rect
          x="55.6094"
          y="25.2422"
          width="27.3446"
          height="74.221"
          rx="13.6723"
          transform="rotate(-10.4621 55.6094 25.2422)"
          fill="currentColor"
        />
        <rect
          opacity="0.8"
          x="68.0605"
          y="17.1211"
          width="27.3446"
          height="94.0628"
          rx="13.6723"
          transform="rotate(35.0178 68.0605 17.1211)"
          fill="currentColor"
        />
        <rect
          opacity="0.8"
          x="138.658"
          y="33.4023"
          width="26.9689"
          height="53.1258"
          rx="13.4844"
          transform="rotate(35.0178 138.658 33.4023)"
          fill="currentColor"
        />
        <rect
          opacity="0.8"
          x="114.734"
          y="8.36328"
          width="27.6597"
          height="93.7229"
          rx="13.8298"
          transform="rotate(35.0178 114.734 8.36328)"
          fill="currentColor"
        />
      </g>
    </svg>
  );
}
