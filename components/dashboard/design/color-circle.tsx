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
  const sizeClasses = {
    sm: "w-7 h-7",
    md: "w-8 h-8",
    lg: "w-10 h-10"
  };

  return (
    <div className={cn(
      "relative group rounded-full overflow-hidden border border-gray-200 shadow-sm cursor-pointer hover:scale-105 transition-transform shrink-0",
      sizeClasses[size]
    )}>
      <input
        type="color"
        value={color || '#000000'}
        onChange={(e) => onChange(e.target.value)}
        className="absolute inset-0 w-[150%] h-[150%] -top-1/4 -left-1/4 cursor-pointer p-0 border-0"
      />
    </div>
  );
};
