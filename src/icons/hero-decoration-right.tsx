import type { SVGProps } from "react";

// 2026.07.25 정슬기 - [추가] Figma hero-decoration(우측) SVG export → React 컴포넌트
export default function HeroDecorationRightIcon({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="325"
      height="148"
      viewBox="0 0 325 148"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
      focusable="false"
      aria-hidden="true"
    >
      <g opacity="0.2">
        <rect
          x="225.092"
          y="64.0508"
          width="50.948"
          height="138.288"
          rx="25.474"
          transform="rotate(15.6745 225.092 64.0508)"
          fill="currentColor"
        />
        <rect
          x="139.832"
          y="40.3906"
          width="50.948"
          height="138.288"
          rx="25.474"
          transform="rotate(15.6745 139.832 40.3906)"
          fill="currentColor"
        />
        <rect
          opacity="0.8"
          x="167.322"
          y="37.0312"
          width="50.948"
          height="175.256"
          rx="25.474"
          transform="rotate(61.1545 167.322 37.0312)"
          fill="currentColor"
        />
        <rect
          opacity="0.8"
          x="272.049"
          y="122.211"
          width="50.248"
          height="98.9833"
          rx="25.124"
          transform="rotate(61.1545 272.049 122.211)"
          fill="currentColor"
        />
        <rect
          opacity="0.8"
          x="252.582"
          y="60.6914"
          width="51.5351"
          height="174.623"
          rx="25.7676"
          transform="rotate(61.1545 252.582 60.6914)"
          fill="currentColor"
        />
      </g>
    </svg>
  );
}
