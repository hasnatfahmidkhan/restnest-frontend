"use client";

import { Star } from "lucide-react";
import { useState } from "react";

interface StarRatingProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export default function StarRating({
  value,
  onChange,
  disabled,
}: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const currentDisplay = hoverValue ?? value;

  const handleClick = (e: React.MouseEvent, index: number) => {
    if (disabled) return;
    // Calculate if click was on left half (0.5) or right half (1.0)
    const rect = e.currentTarget.getBoundingClientRect();
    const isHalf = e.clientX - rect.left < rect.width / 2;
    onChange(isHalf ? index + 0.5 : index + 1);
  };

  const handleMouseEnter = (e: React.MouseEvent, index: number) => {
    if (disabled) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const isHalf = e.clientX - rect.left < rect.width / 2;
    setHoverValue(isHalf ? index + 0.5 : index + 1);
  };

  return (
    <div
      className="flex items-center gap-1"
      onMouseLeave={() => setHoverValue(null)}
    >
      {[0, 1, 2, 3, 4].map((index) => {
        const fillPercentage =
          Math.max(0, Math.min(1, currentDisplay - index)) * 100;

        return (
          <div
            key={index}
            className="relative cursor-pointer"
            onClick={(e) => handleClick(e, index)}
            onMouseMove={(e) => handleMouseEnter(e, index)}
          >
            {/* Empty Star (Background) */}
            <Star className="w-8 h-8 text-muted-foreground/30" />
            {/* Filled Star (Foreground) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${fillPercentage}%` }}
            >
              <Star className="w-8 h-8 text-amber-400 fill-amber-400" />
            </div>
          </div>
        );
      })}
      <span className="ml-2 text-sm font-medium text-muted-foreground">
        {currentDisplay.toFixed(1)} / 5.0
      </span>
    </div>
  );
}
