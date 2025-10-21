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

export default function Page() {
  const router = useRouter();
  const [gameName, setGameName] = useState('');
  const [grid, setGrid] = useState('3x3');
  const [numbers, setNumbers] = useState('');
  const [numberSequences, setNumberSequences] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const gameData = {
      gameName,
      grid,
      numbers,
      numberSequences,
    };
    localStorage.setItem('freeGameData', JSON.stringify(gameData));
    router.push('/Free/Tickets');
  };

  return (
    <div className="flex justify-center items-center py-12">
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
            <div className="space-y-2">
              <Label>Select Grid</Label>
              <RadioGroup
                defaultValue="3x3"
                className="flex space-x-4"
                onValueChange={setGrid}
                value={grid}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="3x3" id="r1" />
                  <Label htmlFor="r1">Kitty Party (3x3)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="4x4" id="r2" />
                  <Label htmlFor="r2">Double Decker (4x4)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="5x5" id="r3" />
                  <Label htmlFor="r3">Super Spin (5x5)</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="space-y-2">
              <Label htmlFor="numbers">Comma Separated Numbers</Label>
              <Input
                id="numbers"
                placeholder="e.g., 1, 5, 10, 23"
                value={numbers}
                onChange={(e) => setNumbers(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="numberSequences">
                Comma Separated Number Sequences
              </Label>
              <Input
                id="numberSequences"
                placeholder="e.g., 11-19, 21-29, 31, 32"
                value={numberSequences}
                onChange={(e) => setNumberSequences(e.target.value)}
              />
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
