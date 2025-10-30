
'use client';

import { Suspense, useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogClose,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"
import { Trophy, RefreshCw, Gem, Ticket as TicketIcon, Download, Share2, FileText, Calculator, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { freeSpaceIcons } from '@/components/icons';
import * as htmlToImage from 'html-to-image';
import { Input } from '@/components/ui/input';
import { scoreWeights } from '@/lib/score-calculator';
import { getActiveAd } from '@/lib/game-utils';
import { AdCreative } from '@/lib/ads-config';
import Image from 'next/image';

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
  firstMatchIndex: number;
  lastMatchIndex: number;
  strikeRank: number;
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
}: {
  score: Score;
  spunNumbersSet: Set<number>;
}) {
  const { ticket } = score;
  const ticketIcon = freeSpaceIcons.find(icon => icon.displayName === ticket.iconName) || freeSpaceIcons[0];
  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="p-4 flex flex-row justify-center items-center">
        <CardTitle className="text-xl">BingoTango</CardTitle>
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
            const IconComponent = isFreeSpace ? ticketIcon : ticketIcon;
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
                {isFreeSpace ? <IconComponent className="w-5 h-5" /> : cell}
              </div>
            );
          })}
        </div>
         <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground px-1">
            <span>{ticket.name}</span>
            <span>{ticket.gameName}</span>
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
  ticketName,
  winnerScore,
}: {
  title: string;
  grid: (string | number | null)[];
  size: number;
  spunNumbersSet: Set<number>;
  Icon: React.FC<any>;
  isGolden?: boolean;
  titleIcon: React.ReactNode;
  ticketName?: string;
  winnerScore?: number;
}) {
  const ticketRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [canShareFiles, setCanShareFiles] = useState(false);

  useEffect(() => {
    if (navigator.share && navigator.canShare) {
      const dummyFile = new File(['foo'], 'foo.png', { type: 'image/png' });
      setCanShareFiles(navigator.canShare({ files: [dummyFile] }));
    }
  }, []);

  const downloadTicket = useCallback(() => {
    if (ticketRef.current === null) {
      return;
    }
    const name = ticketName || title.toLowerCase().replace(/ /g, '-');
    htmlToImage
      .toPng(ticketRef.current, { cacheBust: true, pixelRatio: 2 })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = `bingo-ticket-${name}.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        toast({
          title: 'Error generating image',
          description: 'Could not create PNG for download.',
          variant: 'destructive',
        });
        console.error(err);
      });
  }, [ticketName, title, toast]);

  const shareTicket = useCallback(async () => {
    if (ticketRef.current === null) {
      return;
    }
    const name = ticketName || title.toLowerCase().replace(/ /g, '-');
    try {
      const dataUrl = await htmlToImage.toPng(ticketRef.current, {
        cacheBust: true,
        pixelRatio: 2,
      });
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File(
        [blob],
        `bingo-ticket-${name}.png`,
        { type: 'image/png' }
      );

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Bingo Ticket',
          text: `BingoTango Ticket: ${name}`,
        });
      } else {
        toast({
          title: 'Sharing Not Supported',
          description: 'Your browser does not support sharing files.',
          variant: 'destructive',
        });
      }
    } catch (err) {
      toast({
        title: 'Error sharing ticket',
        description: 'Could not generate image for sharing.',
        variant: 'destructive',
      });
      console.error(err);
    }
  }, [ticketName, title, toast]);


  const iconComponent = isGolden ? <Icon className="w-6 h-6" /> : <Icon className="w-6 h-6 text-primary-foreground" />;
  return (
    <div className="flex-1 w-full max-w-sm mx-auto">
        <div ref={ticketRef} className='bg-card p-4 rounded-t-lg'>
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
                      ? isMatched ? 'bg-amber-400/20 text-amber-500' : 'bg-amber-400/5'
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
         <div className="p-4 flex justify-center items-baseline gap-2 bg-card rounded-b-lg border-t-0">
            {winnerScore !== undefined ? (
                 <>
                    <span className="text-xl font-bold">Score:</span>
                    <span className="text-3xl font-bold text-primary">{winnerScore}</span>
                </>
            ) : (
                <>
                    <Button variant="outline" size="sm" onClick={downloadTicket}>
                      <Download className="mr-2 h-4 w-4" /> PNG
                    </Button>
                    {canShareFiles && (
                      <Button variant="outline" size="sm" onClick={shareTicket}>
                        <Share2 className="mr-2 h-4 w-4" /> Share
                      </Button>
                    )}
                </>
            )}
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
  const [searchQuery, setSearchQuery] = useState('');
  const [carouselApi, setCarouselApi] = useState<CarouselApi>()

  // Ad state
  const [isShowingAd, setIsShowingAd] = useState(true);
  const [canSkipAd, setCanSkipAd] = useState(false);
  const [activeAd, setActiveAd] = useState<AdCreative | null>(null);

  const youtubeEmbedUrl = useMemo(() => {
    if (!activeAd?.youtubeUrl) return null;
    try {
      const url = new URL(activeAd.youtubeUrl);
      const videoId = url.searchParams.get("v");
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0`;
      }
    } catch (e) {
      console.error("Invalid YouTube URL", e);
    }
    return null;
  }, [activeAd]);

  useEffect(() => {
    if (!searchQuery || !carouselApi || sortedScores.length === 0) return;

    const playerIndex = sortedScores.findIndex(s => s.name.toLowerCase().startsWith(searchQuery.toLowerCase()));

    if (playerIndex !== -1) {
        carouselApi.scrollTo(playerIndex);
    }
  }, [searchQuery, carouselApi, sortedScores]);

  useEffect(() => {
    setIsClient(true);
    setActiveAd(getActiveAd('winner'));

    const gameDataStr = localStorage.getItem('freeGameData');
    const resultsStr = localStorage.getItem('bingoGameResults');

    if (!gameDataStr || !resultsStr) {
      toast({
        title: 'Game Data Missing',
        description: 'Could not find results for the previous game. Please start a new one.',
        variant: 'destructive',
      });
      router.push('/Free/Game');
      return;
    }

    let adDuration = 6000; // Default ad duration

    const calculationPromise = new Promise<void>(async (resolve, reject) => {
        try {
            const { gameId, grid } = JSON.parse(gameDataStr);
            const {
                spunNumbers: finalSpunNumbers,
                finalGrid,
                iconName,
            } = JSON.parse(resultsStr);
            
            const size = parseInt(grid.split('x')[0]);
            const weights = scoreWeights[size as keyof typeof scoreWeights];

            const ticketsStorageKey = `bingo-tickets-${gameId}`;
            const ticketsStr = localStorage.getItem(ticketsStorageKey);
            const tickets: Ticket[] = ticketsStr ? JSON.parse(ticketsStr) : [];

            if (tickets.length === 0) {
                toast({
                title: 'No Tickets Found',
                description: 'No tickets were generated for this game.',
                variant: 'destructive',
                });
                router.push('/Free/Tickets');
                reject(new Error("No tickets found"));
                return;
            }

            setGoldenTicketGrid(finalGrid || []);
            setSpunNumbers(finalSpunNumbers || []);
            setGridSize(size || 0);

            // Set ad duration based on grid size
            if (size === 3) adDuration = 9000;
            if (size === 4) adDuration = 16000;
            if (size === 5) adDuration = 25000;

            const icon =
                freeSpaceIcons.find((i) => (i as any).displayName === iconName) ||
                freeSpaceIcons[0];
            setGoldenTicketIcon(() => icon);

            const scores: Score[] = tickets.map((ticket) => {
                let score = 0;
                let firstMatchIndex = -1;
                let lastMatchIndex = -1;
                let strikeRank = 0;

                const spunNumbersSet = new Set(finalSpunNumbers);
                
                // --- Score Calculation ---
                const filledGrid = ticket.grid;
                const gridSize = ticket.size;
                
                const completedCells = (filledGrid.filter(c => typeof c === 'number' && spunNumbersSet.has(c)) as number[]).length;
                score += completedCells * weights.cell;

                const lines: (string | number | null)[][] = [];
                for (let i = 0; i < gridSize; i++) {
                    lines.push(filledGrid.slice(i * gridSize, (i + 1) * gridSize));
                    const col = [];
                    for (let j = 0; j < gridSize; j++) col.push(filledGrid[j * gridSize + i]);
                    lines.push(col);
                }

                let fullLines = 0, n1Lines = 0, n2Lines = 0;
                lines.forEach(line => {
                    const filledCount = line.filter(c => (typeof c === 'number' && spunNumbersSet.has(c)) || c === 'FREE').length;
                    if (filledCount === gridSize) fullLines++;
                    else if (filledCount === gridSize - 1) n1Lines++;
                    else if (filledCount === gridSize - 2 && gridSize > 2) n2Lines++;
                });

                score += fullLines * weights.line;
                score += n1Lines * weights.nMinus1;
                if (gridSize > 2) {
                    score += n2Lines * weights.nMinus2;
                }

                if (gridSize > 2) {
                    const corners = [filledGrid[0], filledGrid[gridSize - 1], filledGrid[gridSize * (gridSize - 1)], filledGrid[gridSize * gridSize - 1]];
                    const filledCorners = corners.filter(c => (typeof c === 'number' && spunNumbersSet.has(c)) || c === 'FREE').length;
                    if (filledCorners === 4) {
                        score += weights.corners;
                    }
                }
                
                // --- Tie-Breaker Calculation ---
                const ticketNumbers = new Set(ticket.grid.filter((c) => typeof c === 'number'));
                
                finalSpunNumbers.forEach((spunNumber: number, index: number) => {
                    if (ticketNumbers.has(spunNumber)) {
                        if (firstMatchIndex === -1) {
                            firstMatchIndex = index; // Set the first match
                        }
                        lastMatchIndex = index; // Continuously update to find the last match
                        strikeRank += (index + 1); // Sum of draw numbers (1-based)
                    }
                });

                return {
                  name: ticket.name,
                  score,
                  firstMatchIndex,
                  lastMatchIndex,
                  strikeRank,
                  ticket,
                };
            });

            const sorted = [...scores].sort((a, b) => {
                if (a.score !== b.score) return b.score - a.score;
                if (a.firstMatchIndex !== b.firstMatchIndex) return a.firstMatchIndex - b.firstMatchIndex;
                if (a.lastMatchIndex !== b.lastMatchIndex) return a.lastMatchIndex - b.lastMatchIndex;
                return a.strikeRank - b.strikeRank;
            });

            setSortedScores(sorted);
            
            resolve();
        } catch (error) {
            console.error('Error processing game results:', error);
            toast({
                title: 'Error Loading Results',
                description: 'There was a problem calculating the winner.',
                variant: 'destructive',
            });
            reject(error);
        }
    });

    const adDisplayPromise = new Promise(resolve => setTimeout(resolve, adDuration));
    
    Promise.all([calculationPromise, adDisplayPromise]).then(() => {
        setCanSkipAd(true);
    }).catch(() => {
        setCanSkipAd(true);
    });

  }, [router, toast]);


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
  

  const handleNewGame = () => {
    localStorage.removeItem('freeGameData');
    localStorage.removeItem('bingoGameResults');
    // Also remove all ticket storage keys
     Object.keys(localStorage).forEach(key => {
        if (key.startsWith('bingo-tickets-')) {
            localStorage.removeItem(key);
        }
    });
    router.push('/Free/Game');
  };

  if (!isClient) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <RefreshCw className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (isShowingAd) {
    return (
      <Dialog open={true}>
        <DialogContent className="w-screen h-screen max-w-full flex flex-col items-center justify-center bg-black/90 p-0 border-none rounded-none">
            <DialogHeader className="absolute top-8 left-1/2 -translate-x-1/2 z-20">
                <DialogTitle className="text-3xl font-bold text-white">Scores are being calculated...</DialogTitle>
            </DialogHeader>
            
            {canSkipAd && (
                <DialogClose asChild>
                    <Button
                        className="absolute right-4 top-4 z-20 bg-amber-400 hover:bg-amber-500 text-black font-bold"
                        onClick={() => setIsShowingAd(false)}
                    >
                        Skip Ad
                    </Button>
                </DialogClose>
            )}

            {youtubeEmbedUrl ? (
              <div className="absolute inset-0 w-full h-full z-10">
                <iframe
                  width="100%"
                  height="100%"
                  src={youtubeEmbedUrl}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            ) : (
                <div className="flex items-center justify-center w-full h-full z-10">
                    {activeAd?.imagePath && 
                        <Image 
                          src={activeAd.imagePath} 
                          alt="advertisement" 
                          width={1280}
                          height={720}
                          className="w-full h-full object-contain" 
                          data-ai-hint={activeAd.dataAiHint}
                          onError={(e) => e.currentTarget.src = 'https://picsum.photos/seed/placeholder/1280/720'}
                        />
                    }
                </div>
            )}
        </DialogContent>
      </Dialog>
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
                  ticketName='golden-ticket'
                  grid={goldenTicketGrid}
                  size={gridSize}
                  spunNumbersSet={spunNumbersSet}
                  Icon={goldenTicketIcon}
                  isGolden={true}
                  titleIcon={<Gem className="text-amber-400"/>}
              />
              <GridDisplay 
                  title="Winner's Ticket"
                  ticketName={winner.name}
                  grid={winner.ticket.grid}
                  size={winner.ticket.size}
                  spunNumbersSet={spunNumbersSet}
                  Icon={winnerIcon}
                  titleIcon={<TicketIcon className="text-primary"/>}
                  winnerScore={winner.score}
              />
          </CardContent>
      </Card>

      <div className="mt-12">
        <h2 className="text-3xl font-bold text-center mb-8">All Player Scores</h2>
        <div className="relative w-full max-w-md mx-auto mb-8">
            <Input
                type="text"
                placeholder="Search by player name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        </div>
        
        {sortedScores.length > 0 ? (
          <div className="w-full max-w-lg mx-auto">
            <Carousel setApi={setCarouselApi} opts={{ align: "start" }} className="w-full">
              <CarouselContent>
                {sortedScores.map((score) => (
                  <CarouselItem key={score.ticket.id} className="md:basis-1/2 lg:basis-1/1">
                    <div className="p-1">
                      <ScoreTicketCard score={score} spunNumbersSet={spunNumbersSet} />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="h-10 w-10 -left-12" />
              <CarouselNext className="h-10 w-10 -right-12" />
            </Carousel>
          </div>
        ) : (
          <p className="text-center text-muted-foreground mt-8">No players found.</p>
        )}
      </div>

       <div className="flex justify-center flex-wrap gap-4 mt-8">
            <Button onClick={handleNewGame}>
              <RefreshCw className="mr-2 h-4 w-4" /> Start New Game
           </Button>
           <Button asChild variant="outline">
              <Link href="/Free/Formula">
                  <FileText className="mr-2 h-4 w-4" /> Score Formula
              </Link>
           </Button>
           <Button asChild variant="outline">
              <Link href="/Free/Calculator">
                  <Calculator className="mr-2 h-4 w-4" /> Score Calculator
              </Link>
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
