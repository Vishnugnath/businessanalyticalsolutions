import React from "react";
import { LogoIcon } from "./LogoIcon";

interface LogoProps {
  className?: string;
  iconSize?: number;
  showSubtitle?: boolean;
  textColor?: string;
}

export function Logo({
  className = "",
  iconSize = 36,
  showSubtitle = true,
  textColor = "text-slate-900 dark:text-white",
}: LogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <LogoIcon size={iconSize} className="shrink-0" />
      <div className="leading-none select-none">
        <div className="font-['Space_Grotesk'] font-bold tracking-tight text-sm sm:text-base md:text-lg flex flex-wrap items-center gap-x-1">
          <span className={textColor}>Samagra</span>
          <span className="text-[#00A5DF]">Business</span>
          <span className="text-blue-600 dark:text-blue-400">Analytical Solutions</span>
        </div>
        {showSubtitle && (
          <div className="hidden sm:block font-['JetBrains_Mono'] text-[9px] uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mt-0.5">
            Enterprise Intelligence Console
          </div>
        )}
      </div>
    </div>
  );
}
