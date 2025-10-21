'use client';
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Trophy, Dices } from "lucide-react";

type NumberWheelProps = {
  numbers: number[];
  onSpinEnd: (selectedNumber: number) => void;
  isGridFull: boolean;
  onFindWinner: () => void;
};

export function NumberWheel({ numbers, onSpinEnd, isGridFull, onFindWinner }: NumberWheelProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [displayNumber, setDisplayNumber] = useState<number | string | null>('?');

  useEffect(() => {
    if (numbers.length === 0 && !isGridFull) {
       setDisplayNumber('🎉');
    } else if (displayNumber === '?' && numbers.length > 0) {
        // Keep '?' until first spin
    }
  }, [numbers, isGridFull, displayNumber]);

  const handleSpinClick = () => {
    if (isSpinning || numbers.length === 0 || isGridFull) return;

    setIsSpinning(true);
    let spinCount = 0;
    const totalSpins = 30; // Number of "ticks" for the animation
    let finalNumber = displayNumber; // Keep track of the number to be selected

    const spinInterval = setInterval(() => {
      spinCount++;
      const randomIndex = Math.floor(Math.random() * numbers.length);
      const randomDisplayNumber = numbers[randomIndex];
      setDisplayNumber(randomDisplayNumber);
      
      if (spinCount >= totalSpins) {
        clearInterval(spinInterval);
        setIsSpinning(false);
        finalNumber = randomDisplayNumber; // The last displayed number is the final one
        setDisplayNumber(finalNumber);
        onSpinEnd(finalNumber as number);
      }
    }, 100); // Animation speed
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-6 rounded-xl bg-card shadow-lg border w-full max-w-sm">
        <div className="relative w-48 h-48 rounded-full flex items-center justify-center bg-primary/10 border-4 border-primary">
            <div className="absolute inset-0 rounded-full bg-background animate-pulse" style={{ animationDuration: isSpinning ? '0.5s' : '2s'}}></div>
            <span
                className={cn(
                    "text-6xl font-bold text-primary transition-transform duration-100",
                    isSpinning ? "scale-125" : "scale-100"
                )}
            >
                {displayNumber}
            </span>
        </div>
        
        {isGridFull ? (
             <Button
                size="lg"
                onClick={onFindWinner}
                className="w-full bg-green-500 hover:bg-green-600 text-white"
            >
                <Trophy className="mr-2 h-6 w-6" />
                Find the Winner
            </Button>
        ) : (
            <Button
                size="lg"
                onClick={handleSpinClick}
                disabled={isSpinning || numbers.length === 0}
                className="w-full"
            >
                <Dices className={cn("mr-2 h-6 w-6", isSpinning && "animate-spin")} />
                {isSpinning ? 'Spinning...' : 'Spin the Wheel'}
            </Button>
        )}
    </div>
  );
}
