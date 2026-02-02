'use client';

import { useRef } from "react";
import { cn } from "@/lib/utils";

interface ColorCircleProps {
  color: string;
  onChange: (c: string) => void;
  size?: "sm" | "md" | "lg";
}

export const ColorCircle = ({
  color,
  onChange,
  size = "md"
}: ColorCircleProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: "w-7 h-7",
    md: "w-8 h-8",
    lg: "w-10 h-10"
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <button
      onClick={handleClick}
      type="button"
      className={cn(
        "relative group rounded-full overflow-hidden border border-gray-200 shadow-sm cursor-pointer hover:scale-105 transition-transform shrink-0 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black",
        sizeClasses[size]
      )}
      style={{ backgroundColor: color || '#000000' }}
      aria-label="Seleccionar color"
    >
      <input
        ref={inputRef}
        type="color"
        value={color || '#000000'}
        onChange={(e) => onChange(e.target.value)}
        className="opacity-0 absolute top-0 left-0 w-0 h-0 pointer-events-none"
        tabIndex={-1}
      />
    </button>
  );
};
