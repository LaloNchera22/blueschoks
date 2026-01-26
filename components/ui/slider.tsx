"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  value: number;
  onValueChange: (value: number) => void;
  max?: number;
  min?: number;
  step?: number;
}

export function Slider({
  className,
  value,
  onValueChange,
  max = 100,
  min = 0,
  step = 1,
  ...props
}: SliderProps) {
  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onValueChange(Number(e.target.value))}
      className={cn(
        "w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black focus:outline-none focus:ring-2 focus:ring-black/5",
        className
      )}
      {...props}
    />
  );
}
