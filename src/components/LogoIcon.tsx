import React from "react";

interface LogoIconProps {
  className?: string;
  size?: number;
}

export function LogoIcon({ className = "", size = 40 }: LogoIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Monitor base/stand */}
      <rect x="52" y="88" width="16" height="8" rx="2" fill="#2563EB" />
      <rect x="42" y="94" width="36" height="5" rx="2.5" fill="#2563EB" />

      {/* Monitor Outer Frame */}
      <rect
        x="18"
        y="20"
        width="84"
        height="66"
        rx="12"
        stroke="#2563EB"
        strokeWidth="5"
        fill="#FFFFFF"
        className="dark:fill-[#0F172A]"
      />

      {/* Inner Screen Elements */}
      {/* Left side: Bar chart */}
      <rect x="28" y="44" width="6" height="24" rx="2.5" fill="#2563EB" />
      <rect x="38" y="36" width="6" height="32" rx="2.5" fill="#2563EB" />
      <rect x="48" y="40" width="6" height="28" rx="2.5" fill="#2563EB" />
      <rect x="58" y="48" width="6" height="20" rx="2.5" fill="#60A5FA" />

      {/* Right side: Line chart container */}
      <g>
        <rect
          x="68"
          y="32"
          width="28"
          height="22"
          rx="4"
          fill="#EFF6FF"
          stroke="#93C5FD"
          strokeWidth="1.5"
          className="dark:fill-slate-800/80 dark:stroke-slate-700"
        />
        <path
          d="M 70,48 L 76,40 L 82,45 L 88,36 L 94,42"
          stroke="#2563EB"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <circle cx="76" cy="40" r="2.2" fill="#1D4ED8" />
        <circle cx="82" cy="45" r="2.2" fill="#1D4ED8" />
        <circle cx="88" cy="36" r="2.2" fill="#1D4ED8" />
        <circle cx="94" cy="42" r="2.2" fill="#1D4ED8" />
      </g>

      {/* Bottom overlay: Gold circular sync/refresh button */}
      <circle cx="28" cy="78" r="14" fill="#F59E0B" stroke="#D97706" strokeWidth="1.5" />
      <path
        d="M 28,70 A 8,8 0 1,1 20,78"
        stroke="#FFFFFF"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 20,74 L 20,78 L 24,78"
        stroke="#FFFFFF"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
