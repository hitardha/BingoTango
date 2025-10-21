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
  CardFooter,
} from '@/components/ui/card';
import { Trophy, RefreshCw, Gem, Ticket as TicketIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { freeSpaceIcons } from '@/components/icons';

type Ticket = {
  id: string;
  name: string;
  gameName: string;
  grid: (string | number | null)[];
  size: number;
  iconName: string;
};

type Score = {
  name: string;
  score: number;
  lastMatchIndex: number;
  ticket: Ticket;
};

const gridClasses = {
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  5: 'grid-cols-5',
};

const fontClasses = {
  3: 'text-lg',
  4: 'text-base',
  5: 'text-sm',
};

function ScoreTicketCard({
  score,
  spunNumbersSet,
  Icon,
}: {
  score: Score;
  spunNumbersSet: Set<number>;
  Icon: React.FC<any>;
}) {
  const { ticket } = score;
  return (
    <Card className="flex flex-col">
      <CardHeader className="p-4">
        <CardTitle className="text-xl">{ticket.name}</CardTitle>
        <CardDescription>{ticket.gameName}</CardDescription>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <div
          className={cn(
            `grid gap-1 mx-auto bg-card p-2 rounded-lg border`,
            gridClasses[ticket.size as keyof typeof gridClasses]
          )}
        >
          {ticket.grid.map((cell, index) => {
            const isFreeSpace = cell === 'FREE';
            const isMatched = typeof cell === 'number' && spunNumbersSet.has(cell);
            return (
              <div
                key={index}
                className={cn(
                  'aspect-square rounded-md flex items-center justify-center font-bold',
                  fontClasses[ticket.size as keyof typeof fontClasses],
                  isFreeSpace
                    ? 'bg-primary text-primary-foreground'
                    : isMatched
                    ? 'bg-accent text-accent-foreground'
                    : 'bg-secondary/30'
                )}
              >
                {isFreeSpace ? <Icon className="w-5 h-5" /> : cell}
              </div>
            );
          })}
        </div>
      </CardContent>
      <CardFooter className="p-4 bg-muted/50 flex justify-center items-baseline gap-2">
        <span className="text-xl font-bold">Score:</span>
        <span className="text-3xl font-bold text-primary">{score.score}</span>
      </CardFooter>
    </Card>
  );
}

function GridDisplay({
  title,
  grid,
  size,
  spunNumbersSet,
  Icon,
  isGolden = false,
  titleIcon,
}: {
  title: string;
  grid: (string | number | null)[];
  size: number;
  spunNumbersSet: Set<number>;
  Icon: React.FC<any>;
  isGolden?: boolean;
  titleIcon: React.ReactNode;
}) {
    const iconComponent = isGolden ? <Icon className="w-6 h-6" /> : <Icon className="w-6 h-6 text-primary-foreground" />;
  return (
    <div className="flex-1 w-full max-w-sm mx-auto">
      <h3 className="text-2xl font-bold mb-4 flex items-center justify-center gap-2">
        {titleIcon}
        {title}
      </h3>
      <div
        className={cn(
          `grid gap-2 mx-auto bg-card p-2 rounded-lg border`,
          gridClasses[size as keyof typeof gridClasses],
          isGolden && 'border-amber-400'
        )}
      >
        {grid.map((cell, index) => {
          const isFreeSpace = cell === 'FREE';
          const isMatched = typeof cell === 'number' && spunNumbersSet.has(cell);
          return (
            <div
              key={index}
              className={cn(
                'aspect-square rounded-md flex items-center justify-center font-bold',
                fontClasses[size as keyof typeof fontClasses],
                isFreeSpace
                  ? 'bg-primary text-primary-foreground'
                  : isGolden
                  ? 'bg-amber-400/20'
                  : isMatched
                  ? 'bg-accent text-accent-foreground'
                  : 'bg-card'
              )}
            >
              {isFreeSpace ? iconComponent : cell}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function WinnerPageContent() {
  const router = useRouter();
  const { toast } = useToast();
  const { width, height } = useWindowSize();

  const [isClient, setIsClient] = useState(false);
  const [sortedScores, setSortedScores] = useState<Score[]>([]);
  const [goldenTicketGrid, setGoldenTicketGrid] = useState<(string | number | null)[]>([]);
  const [spunNumbers, setSpunNumbers] = useState<number[]>([]);
  const [gridSize, setGridSize] = useState(0);
  const [goldenTicketIcon, setGoldenTicketIcon] = useState(() => freeSpaceIcons[0]);

  const spunNumbersSet = useMemo(() => new Set(spunNumbers), [spunNumbers]);
  const winner = useMemo(
    () => (sortedScores.length > 0 ? sortedScores[0] : null),
    [sortedScores]
  );
  const winnerIcon = useMemo(() => {
    if (!winner) return freeSpaceIcons[0];
    return (
      freeSpaceIcons.find(
        (i) => (i as any).displayName === winner.ticket.iconName
      ) || freeSpaceIcons[0]
    );
  }, [winner]);

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
      const {
        spunNumbers: finalSpunNumbers,
        finalGrid,
        iconName,
      } = JSON.parse(resultsStr);

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

      setGoldenTicketGrid(finalGrid || []);
      setSpunNumbers(finalSpunNumbers || []);
      setGridSize(parseInt(grid.split('x')[0]) || 0);

      const icon =
        freeSpaceIcons.find((i) => (i as any).displayName === iconName) ||
        freeSpaceIcons[0];
      setGoldenTicketIcon(() => icon);

      const scores: Score[] = tickets.map((ticket) => {
        const ticketNumbers = new Set(
          ticket.grid.filter((c) => typeof c === 'number')
        );
        let score = 0;
        let lastMatchIndex = -1;

        finalSpunNumbers.forEach((spunNumber: number, index: number) => {
          if (ticketNumbers.has(spunNumber)) {
            score++;
            lastMatchIndex = index;
          }
        });

        return {
          name: ticket.name,
          score,
          lastMatchIndex,
          ticket,
        };
      });

      const sorted = [...scores].sort((a, b) => {
        if (a.score !== b.score) {
          return b.score - a.score;
        }
        return a.lastMatchIndex - b.lastMatchIndex;
      });

      setSortedScores(sorted);
    } catch (error) {
      console.error('Error processing game results:', error);
      toast({
        title: 'Error Loading Results',
        description: 'There was a problem calculating the winner.',
        variant: 'destructive',
      });
    }
  }, [router, toast]);

  const handleNewGame = () => {
    localStorage.removeItem('freeGameData');
    localStorage.removeItem('bingoGameResults');
    router.push('/Free/Game');
  };

  if (!isClient) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <RefreshCw className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }
  
  if (sortedScores.length === 0 || !winner) {
    return (
         <div className="container mx-auto p-4 md:p-8 min-h-screen flex flex-col items-center justify-center gap-8">
            <p className="text-xl text-muted-foreground">Could not determine a winner.</p>
             <Button onClick={handleNewGame} size="lg">
              <RefreshCw className="mr-2 h-5 w-5" /> Start New Game
           </Button>
        </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8 min-h-screen">
       {winner && <Confetti width={width} height={height} recycle={false} numberOfPieces={400}/>}
       
       <Card className="my-12 p-6 shadow-2xl bg-secondary/30">
          <CardHeader className="text-center p-0 mb-6">
              <Trophy className="w-16 h-16 text-amber-400 mx-auto mb-4" />
              <CardTitle className="text-4xl md:text-5xl font-bold text-amber-400">Congratulations!</CardTitle>
              <CardDescription className="text-2xl md:text-3xl font-headline text-foreground">{winner.name}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col lg:flex-row items-start justify-center gap-8">
               <GridDisplay 
                  title="Golden Ticket"
                  grid={goldenTicketGrid}
                  size={gridSize}
                  spunNumbersSet={spunNumbersSet}
                  Icon={goldenTicketIcon}
                  isGolden={true}
                  titleIcon={<Gem className="text-amber-400"/>}
              />
              <GridDisplay 
                  title="Winner's Ticket"
                  grid={winner.ticket.grid}
                  size={winner.ticket.size}
                  spunNumbersSet={spunNumbersSet}
                  Icon={winnerIcon}
                  titleIcon={<TicketIcon className="text-primary"/>}
              />
          </CardContent>
      </Card>

      <div className="mt-12">
        <h2 className="text-3xl font-bold text-center mb-8">All Player Scores</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedScores.map(score => (
                <ScoreTicketCard key={score.ticket.id} score={score} spunNumbersSet={spunNumbersSet} Icon={winnerIcon} />
            ))}
        </div>
      </div>
       <div className="flex justify-center gap-4 mt-8">
           <Button onClick={handleNewGame} size="lg">
              <RefreshCw className="mr-2 h-5 w-5" /> Start New Game
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
