import type React from "react";
import "./LiquidMetalContainer.scss";

interface LiquidMetalDividerProps {
  height?: number;
  speed?: number;
  className?: string;
}

export function LiquidMetalDivider({
  height = 5,
  speed = 0.6,
  className = "",
}: LiquidMetalDividerProps) {
  return (
    <div
      className={`liquid-metal-divider ${className}`}
      style={{
        "--lmd-height": `${height}px`,
        "--lmd-speed": `${Math.max(0.1, speed)}s`,
      } as React.CSSProperties}
    />
  );
}
