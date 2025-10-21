
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  RadioGroup,
  RadioGroupItem,
} from '@/components/ui/radio-group';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { getActiveAdConfig } from '@/lib/game-utils';
import { AdPlacement } from '@/lib/ads-config';

const GAME_CREATION_LIMIT = 3;
const GAME_TIMESTAMPS_KEY = 'freeGameTimestamps';

const GRID_REQUIREMENTS = {
  '3x3': 14,
  '4x4': 24,
  '5x5': 38,
};

const GridOption = ({
  value,
  label,
  gridSize,
  selectedValue,
}: {
  value: string;
  label: string;
  gridSize: number;
  selectedValue: string;
}) => {
  const isSelected = selectedValue === value;
  return (
    <div className="flex flex-col items-center space-y-2">
      <div
        className={cn(
          'grid gap-1 p-2 border-2 rounded-lg cursor-pointer',
          isSelected ? 'border-primary bg-primary/10' : 'border-border'
        )}
        style={{
          gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
        }}
      >
        {Array.from({ length: gridSize * gridSize }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'w-3 h-3 rounded-sm',
              isSelected ? 'bg-primary/50' : 'bg-muted'
            )}
          />
        ))}
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value={value} id={value} />
        <Label htmlFor={value} className="cursor-pointer">{label}</Label>
      </div>
    </div>
  );
};

// Helper function to parse numbers and ranges
const parseNumbers = (input: string): Set<number> => {
    const numbers = new Set<number>();
    if (!input) return numbers;

    const parts = input.split(',').map(part => part.trim());
    for (const part of parts) {
        if (part.includes('-')) {
            const [start, end] = part.split('-').map(num => parseInt(num.trim(), 10));
            if (!isNaN(start) && !isNaN(end) && start <= end) {
                for (let i = start; i <= end; i++) {
                    numbers.add(i);
                }
            }
        } else {
            const num = parseInt(part, 10);
            if (!isNaN(num)) {
                numbers.add(num);
            }
        }
    }
    return numbers;
};


export default function Page() {
  const router = useRouter();
  const [gameName, setGameName] = useState('');
  const [grid, setGrid] = useState('4x4');
  const [numbers, setNumbers] = useState('');
  const [activeAd, setActiveAd] = useState<AdPlacement | null>(null);
  const [gamesToday, setGamesToday] = useState(0);
  const [showLimitDialog, setShowLimitDialog] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const isProduction = process.env.NODE_ENV === 'production';
  const isLimitReached = isProduction && gamesToday >= GAME_CREATION_LIMIT;


  useEffect(() => {
    setActiveAd(getActiveAdConfig().placements.game);

    // Clear previous game data on new game setup
    localStorage.removeItem("freeGameData");

    const timestamps = JSON.parse(localStorage.getItem(GAME_TIMESTAMPS_KEY) || '[]') as number[];
    const today = new Date().toDateString();
    const todayTimestamps = timestamps.filter(ts => new Date(ts).toDateString() === today);
    setGamesToday(todayTimestamps.length);
    if(isProduction) {
      localStorage.setItem(GAME_TIMESTAMPS_KEY, JSON.stringify(todayTimestamps));
    } else {
      localStorage.removeItem(GAME_TIMESTAMPS_KEY);
    }

  }, [isProduction]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLimitReached) {
      setShowLimitDialog(true);
      return;
    }

    const uniqueNumbers = parseNumbers(numbers);
    const requiredNumbers = GRID_REQUIREMENTS[grid as keyof typeof GRID_REQUIREMENTS];

    if (uniqueNumbers.size < requiredNumbers) {
        setValidationError(`A ${grid} grid requires at least ${requiredNumbers} unique numbers. You have provided ${uniqueNumbers.size}.`);
        return;
    }
    setValidationError(null);

    const gameData = {
      gameName,
      grid,
      numbers,
    };
    // Set the flag for the new game session
    localStorage.setItem('freeGameData', JSON.stringify(gameData));
    
    if (isProduction) {
      // Add new timestamp for game limit tracking
      const timestamps = JSON.parse(localStorage.getItem(GAME_TIMESTAMPS_KEY) || '[]');
      const newTimestamps = [...timestamps, Date.now()];
      localStorage.setItem(GAME_TIMESTAMPS_KEY, JSON.stringify(newTimestamps));
      setGamesToday(newTimestamps.length);
    }

    router.push('/Free/Tickets');
  };

  return (
    <div className="flex flex-col justify-center items-center py-12 px-4 gap-8">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Create a Free Game</CardTitle>
          {isProduction ? (
            isLimitReached ? (
              <CardDescription className="text-destructive font-semibold">
                You have reached the daily limit of {GAME_CREATION_LIMIT} free games. Please come back tomorrow!
              </CardDescription>
            ) : (
              <CardDescription>
                Instantly generate cards and host games without any sign-up. You can create {GAME_CREATION_LIMIT - gamesToday} more games today.
              </CardDescription>
            )
          ) : (
            <CardDescription>
              Instantly generate cards and host games without any sign-up. (Dev mode: No daily limit)
            </CardDescription>
          )}
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <fieldset disabled={isLimitReached}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="gameName">Game Name</Label>
                <Input
                  id="gameName"
                  placeholder="e.g., My Awesome Game"
                  value={gameName}
                  onChange={(e) => setGameName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-4">
                <Label>Select Grid</Label>
                <RadioGroup
                  defaultValue="4x4"
                  className="flex justify-around items-start"
                  onValueChange={setGrid}
                  value={grid}
                >
                  <GridOption value="3x3" label="Kitty Party" gridSize={3} selectedValue={grid} />
                  <GridOption value="4x4" label="Double Decker" gridSize={4} selectedValue={grid} />
                  <GridOption value="5x5" label="Super Spin" gridSize={5} selectedValue={grid} />
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <Label htmlFor="numbers">Numbers or Sequences</Label>
                <Input
                  id="numbers"
                  placeholder="e.g., 1, 5, 10-15, 23"
                  value={numbers}
                  onChange={(e) => setNumbers(e.target.value)}
                  required
                />
                 <p className="text-xs text-muted-foreground">
                  Use comma-separated numbers or number ranges.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full">
                Create the Game
              </Button>
            </CardFooter>
          </fieldset>
        </form>
      </Card>
      {activeAd && (
        <div className="w-full max-w-lg">
            <Link href={activeAd.linkUrl} target="_blank" rel="noopener noreferrer">
              <Image 
                src={activeAd.imagePath}
                alt="Banner" 
                width={800} 
                height={100} 
                className="w-full rounded-lg object-cover"
                data-ai-hint={activeAd.dataAiHint}
                onError={(e) => e.currentTarget.src = 'https://placehold.co/800x100/E2FAF7/16A38A/png?text=Your+Ad+Here'}
              />
            </Link>
        </div>
      )}
       <AlertDialog open={showLimitDialog} onOpenChange={setShowLimitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Daily Limit Reached</AlertDialogTitle>
            <AlertDialogDescription>
              You have already created {GAME_CREATION_LIMIT} free games today. Please come back tomorrow to create more.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowLimitDialog(false)}>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
       <AlertDialog open={!!validationError} onOpenChange={() => setValidationError(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Insufficient Numbers</AlertDialogTitle>
            <AlertDialogDescription>
                {validationError}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setValidationError(null)}>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
