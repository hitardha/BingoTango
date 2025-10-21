'use client';
import { cn } from "@/lib/utils";
import type { LucideProps } from "lucide-react";

type BingoGridProps = {
  size: number;
  cardData: (string | number | null)[];
  FreeSpaceIcon: React.ComponentType<LucideProps>;
  highlightedNumbers?: Set<number>;
  strikeThrough?: boolean;
};

const gridClasses = {
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  5: 'grid-cols-5',
};

const fontClasses = {
  3: 'text-3xl',
  4: 'text-2xl',
  5: 'text-xl',
};

export function BingoGrid({ size, cardData, FreeSpaceIcon, highlightedNumbers, strikeThrough }: BingoGridProps) {
  
  return (
    <div className={`grid ${gridClasses[size as keyof typeof gridClasses]} gap-2`}>
      {cardData.map((cell, index) => {
        const isFreeSpace = cell === 'FREE';
        const isNumber = typeof cell === 'number';
        const isHighlighted = isNumber && highlightedNumbers?.has(cell);
        
        return (
          <div
            key={index}
            className={cn(
              "aspect-square rounded-lg flex items-center justify-center font-bold border-2 transition-all duration-300",
              fontClasses[size as keyof typeof fontClasses],
              isFreeSpace 
                ? "bg-primary text-primary-foreground" 
                : "bg-card text-card-foreground",
              isHighlighted && "bg-accent text-accent-foreground scale-110",
            )}
          >
            {isFreeSpace 
                ? <FreeSpaceIcon className="w-8 h-8" /> 
                : <span className={cn(isHighlighted && strikeThrough && "line-through")}>{cell}</span>
            }
          </div>
        );
      })}
    </div>
  );
}
