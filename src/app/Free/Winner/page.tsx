'use client';

import { Suspense, useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Trophy, ArrowLeft, RefreshCw, Crown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';


type Ticket = {
  id: string;
  name: string;
  grid: (string | number | null)[];
};

type Score = {
  name: string;
  score: number;
  lastMatchIndex: number;
};

function WinnerPageContent() {
  const router = useRouter();
  const { toast } = useToast();
  const { width, height } = useWindowSize();

  const [isClient, setIsClient] = useState(false);
  const [winner, setWinner] = useState<Score | null>(null);
  const [sortedScores, setSortedScores] = useState<Score[]>([]);

  useEffect(() => {
    setIsClient(true);
    
    const gameDataStr = localStorage.getItem('freeGameData');
    const resultsStr = localStorage.getItem('bingoGameResults');

    if (!gameDataStr || !resultsStr) {
      toast({
        title: 'Game Data Missing',
        description:
          'Could not find results for the previous game. Please start a new one.',
        variant: 'destructive',
      });
      router.push('/Free/Game');
      return;
    }

    try {
      const { gameName, grid, numbers } = JSON.parse(gameDataStr);
      const { spunNumbers } = JSON.parse(resultsStr);
      
      const ticketsStorageKey = `bingo-tickets-${gameName}-${grid}-${numbers}`;
      const ticketsStr = localStorage.getItem(ticketsStorageKey);
      const tickets: Ticket[] = ticketsStr ? JSON.parse(ticketsStr) : [];

      if (tickets.length === 0) {
         toast({
            title: 'No Tickets Found',
            description: 'No tickets were generated for this game.',
            variant: 'destructive',
        });
        router.push('/Free/Tickets');
        return;
      }

      // --- Scoring Logic ---
      const scores: Score[] = tickets.map((ticket) => {
        const ticketNumbers = new Set(ticket.grid.filter(c => typeof c === 'number'));
        let score = 0;
        let lastMatchIndex = -1;

        spunNumbers.forEach((spunNumber: number, index: number) => {
          if (ticketNumbers.has(spunNumber)) {
            score++;
            lastMatchIndex = index;
          }
        });

        return {
          name: ticket.name,
          score,
          lastMatchIndex,
        };
      });

      // --- Sorting and Tie-breaking ---
      const sorted = [...scores].sort((a, b) => {
        // Higher score wins
        if (a.score !== b.score) {
          return b.score - a.score;
        }
        // If scores are tied, earlier last match wins
        return a.lastMatchIndex - b.lastMatchIndex;
      });
      
      setSortedScores(sorted);
      if (sorted.length > 0) {
        setWinner(sorted[0]);
      }

    } catch (error) {
      console.error("Error processing game results:", error);
      toast({
        title: 'Error Loading Results',
        description: 'There was a problem calculating the winner.',
        variant: 'destructive',
      });
    }
  }, [router, toast]);

  const handleNewGame = () => {
    // Clear all game-related data to start fresh
    localStorage.removeItem('freeGameData');
    localStorage.removeItem('bingoGameResults');
    // Keep ticket history for now, will be cleared on new game setup
    router.push('/Free/Game');
  };

  if (!isClient) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <RefreshCw className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8 min-h-screen flex flex-col items-center gap-8">
      {winner && <Confetti width={width} height={height} recycle={false} numberOfPieces={400}/>}
      
      <header className="text-center space-y-2">
        <h1 className="text-5xl font-headline text-primary">Game Over!</h1>
        <p className="text-muted-foreground text-lg">Here are the final results.</p>
      </header>

      {winner && (
        <Card className="w-full max-w-md text-center shadow-2xl border-2 border-primary bg-primary/5 animate-in fade-in-50 zoom-in-90 duration-500">
           <CardHeader>
             <div className="flex justify-center items-center gap-2">
                <Trophy className="w-10 h-10 text-amber-400" />
                <CardTitle className="text-3xl">The Winner is...</CardTitle>
             </div>
          </CardHeader>
          <CardContent>
            <p className="text-5xl font-bold font-headline text-primary">{winner.name}</p>
            <p className="text-xl text-muted-foreground mt-2">Score: {winner.score}</p>
          </CardContent>
        </Card>
      )}

      <Card className="w-full max-w-2xl">
        <CardHeader>
            <CardTitle>Final Leaderboard</CardTitle>
            <CardDescription>Scores are based on matched numbers. Ties are broken by who scored first.</CardDescription>
        </CardHeader>
        <CardContent>
            <ul className="space-y-3">
                {sortedScores.map((player, index) => (
                    <li key={player.name}
                        className={cn(
                            "flex justify-between items-center p-3 rounded-lg",
                             index === 0 ? "bg-amber-100 dark:bg-amber-900/50 border-amber-400 border" : "bg-muted/50"
                        )}
                    >
                        <div className="flex items-center gap-3">
                            <span className={cn(
                                "font-bold text-lg w-6 text-center",
                                index === 0 && "text-amber-500",
                                index === 1 && "text-slate-500",
                                index === 2 && "text-orange-700",
                            )}>{index + 1}</span>
                            <span className="font-semibold text-lg">{player.name}</span>
                            {index === 0 && <Crown className="w-5 h-5 text-amber-500" />}
                        </div>
                        <span className="font-bold text-lg text-primary">Score: {player.score}</span>
                    </li>
                ))}
            </ul>
        </CardContent>
      </Card>
       <div className="flex gap-4 mt-8">
           <Button onClick={handleNewGame} size="lg">
              <RefreshCw className="mr-2 h-5 w-5" /> Start New Game
           </Button>
           <Button onClick={() => router.back()} size="lg" variant="outline">
              <ArrowLeft className="mr-2 h-5 w-5" /> Back to Wheel
           </Button>
       </div>
    </div>
  );
}

export default function WinnerPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen w-full items-center justify-center">
                <RefreshCw className="h-10 w-10 animate-spin text-primary" />
            </div>
        }>
            <WinnerPageContent />
        </Suspense>
    )
}
