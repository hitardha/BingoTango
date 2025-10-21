'use client';

import { useState } from 'react';
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
import { cn } from '@/lib/utils';

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

export default function Page() {
  const router = useRouter();
  const [gameName, setGameName] = useState('');
  const [grid, setGrid] = useState('3x3');
  const [numbers, setNumbers] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const gameData = {
      gameName,
      grid,
      numbers,
    };
    localStorage.setItem('freeGameData', JSON.stringify(gameData));
    router.push('/Free/Tickets');
  };

  return (
    <div className="flex justify-center items-center py-12 px-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Create a Free Game</CardTitle>
          <CardDescription>
            Instantly generate cards and host games without any sign-up.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
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
                defaultValue="3x3"
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
        </form>
      </Card>
    </div>
  );
}
