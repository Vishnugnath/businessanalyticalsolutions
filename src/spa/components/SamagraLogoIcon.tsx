import React from "react";

export default function SamagraLogoIcon({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Upper-left swoosh (Dark Blue in light mode, Light Blue in dark mode) */}
      <path
        d="M45.5 14C38.2 24.5 31.5 36.8 38 48C40 51.2 45.2 51.2 45.8 47.5C47.8 38.5 42.2 31.2 47.5 25C50.5 20.8 51.5 15.5 45.5 14Z"
        className="fill-[#1D2A68] dark:fill-[#60A5FA]"
      />
      {/* Lower-right swoosh (Light Blue in light mode, Cyan in dark mode) */}
      <path
        d="M54.5 86C61.8 75.5 68.5 63.2 62 52C60 48.8 54.8 48.8 54.2 52.5C52.2 61.5 57.8 68.8 52.5 75C49.5 79.2 48.5 84.5 54.5 86Z"
        className="fill-[#00A5DF] dark:fill-[#38BDF8]"
      />
    </svg>
  );
}
