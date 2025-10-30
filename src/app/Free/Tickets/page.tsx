
'use client';

import { Suspense, useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  parseNumbers,
  shuffleArray,
  getActiveAd,
} from '@/lib/game-utils';
import {
  Download,
  Share2,
  PlusCircle,
  Trash2,
  Dices,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { freeSpaceIcons } from '@/components/icons';
import { cn } from '@/lib/utils';
import * as htmlToImage from 'html-to-image';
import Link from 'next/link';
import { AdCreative } from '@/lib/ads-config';

type Ticket = {
  id: string;
  name: string;
  gameName: string;
  grid: (string | number | null)[];
  size: number;
  iconName: string;
};

const gridClasses = {
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  5: 'grid-cols-5',
};

const fontClasses = {
  3: 'text-2xl',
  4: 'text-xl',
  5: 'text-lg',
};

// Minimum tickets required to start the game based on grid size
const minTicketsRequired = {
  3: 5,
  4: 11,
  5: 18,
};

function TicketDisplay({ ticket }: { ticket: Ticket }) {
  const ticketRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [canShareFiles, setCanShareFiles] = useState(false);
  const [activeAd, setActiveAd] = useState<AdCreative | null>(null);

  useEffect(() => {
    setActiveAd(getActiveAd('ticketCard'));
    if (navigator.share && navigator.canShare) {
      const dummyFile = new File(['foo'], 'foo.png', { type: 'image/png' });
      setCanShareFiles(navigator.canShare({ files: [dummyFile] }));
    }
  }, []);

  const downloadTicket = useCallback(() => {
    if (ticketRef.current === null) {
      return;
    }

    htmlToImage
      .toPng(ticketRef.current, { cacheBust: true, pixelRatio: 2 })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = `bingo-ticket-${ticket.name
          .toLowerCase()
          .replace(/ /g, '-')}.png`;
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
  }, [ticket.name, toast]);

  const shareTicket = useCallback(async () => {
    if (ticketRef.current === null) {
      return;
    }

    try {
      const dataUrl = await htmlToImage.toPng(ticketRef.current, {
        cacheBust: true,
        pixelRatio: 2,
      });
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File(
        [blob],
        `bingo-ticket-${ticket.name.toLowerCase().replace(/ /g, '-')}.png`,
        { type: 'image/png' }
      );

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Bingo Ticket',
          text: `Here is my BingoTango ticket for ${ticket.gameName}!`,
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
  }, [ticket.name, ticket.gameName, toast]);

  const FreeSpaceIcon =
    freeSpaceIcons.find((icon) => icon.displayName === ticket.iconName) ||
    freeSpaceIcons[0];

  return (
    <Card className="w-full max-w-sm mx-auto">
      <div ref={ticketRef} className="bg-card p-4">
        <CardHeader className="text-center p-2">
          <CardTitle className="text-2xl font-headline text-primary">
            BingoTango
          </CardTitle>
        </CardHeader>
        <CardContent className="p-2">
           {activeAd && (
                <Link href={activeAd.linkUrl} target="_blank" rel="noopener noreferrer" className="block mb-2">
                  <Image 
                    src={activeAd.imagePath}
                    alt="Banner" 
                    width={400} 
                    height={80} 
                    className="w-full rounded-md object-cover"
                    data-ai-hint={activeAd.dataAiHint}
                    onError={(e) => e.currentTarget.src = 'https://picsum.photos/seed/placeholder/400/80'}
                  />
                </Link>
            )}
          <div
            className={`grid ${
              gridClasses[ticket.size as keyof typeof gridClasses]
            } gap-1`}
          >
            {ticket.grid.map((cell, index) => {
              const isFreeSpace = cell === 'FREE';
              return (
                <div
                  key={index}
                  className={cn(
                    'aspect-square rounded-md flex items-center justify-center font-bold border-2',
                    fontClasses[ticket.size as keyof typeof fontClasses],
                    isFreeSpace
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card text-card-foreground'
                  )}
                >
                  {isFreeSpace ? <FreeSpaceIcon className="w-6 h-6" /> : cell}
                </div>
              );
            })}
          </div>
          <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
            <span>{ticket.name}</span>
            <span>{ticket.gameName}</span>
          </div>
        </CardContent>
      </div>
      <CardFooter className="p-4 flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={downloadTicket}>
          <Download className="mr-2 h-4 w-4" /> PNG
        </Button>
        {canShareFiles && (
          <Button variant="outline" size="sm" onClick={shareTicket}>
            <Share2 className="mr-2 h-4 w-4" /> Share
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

function GenerateTicketContent() {
  const router = useRouter();
  const { toast } = useToast();

  const [isClient, setIsClient] = useState(false);
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const [participantName, setParticipantName] = useState('');
  const [tickets, setTickets] = useState<Ticket[]>([]);

  const [gameId, setGameId] = useState<string | null>(null);
  const [gameName, setGameName] = useState<string | null>(null);
  const [grid, setGrid] = useState('5x5');
  const [numbersInput, setNumbersInput] = useState<string | null>(null);
  const [storageKey, setStorageKey] = useState('');
  const [activeAd, setActiveAd] = useState<AdCreative | null>(null);

  const gridSize = parseInt(grid.split('x')[0]);
  const minTickets = minTicketsRequired[gridSize as keyof typeof minTicketsRequired] || 1;
  const canStartGame = tickets.length >= minTickets;

  const generateTicketId = () => {
    return `local-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }

  useEffect(() => {
    setIsClient(true);
    setActiveAd(getActiveAd('tickets'));
    const gameData = localStorage.getItem('freeGameData');
    if (!gameData) {
      toast({
        title: 'No Active Game',
        description: 'Please start a new game from the home page.',
        variant: 'destructive',
      });
      router.push('/Free/Game');
      return;
    }

    const {
      gameId: configGameId,
      gameName: configGameName,
      grid: configGrid,
      numbers: configNumbers,
    } = JSON.parse(gameData);
    setGameId(configGameId);
    setGameName(configGameName);
    setGrid(configGrid);
    setNumbersInput(configNumbers);
    const key = `bingo-tickets-${configGameId}`;
    setStorageKey(key);
    const storedTickets = localStorage.getItem(key);
    if (storedTickets) {
      setTickets(JSON.parse(storedTickets));
    }
  }, [router, toast]);

  const saveTicketsToStorage = (updatedTickets: Ticket[]) => {
    if (storageKey) {
      localStorage.setItem(storageKey, JSON.stringify(updatedTickets));
    }
  };

  const handleSpinClick = () => {
    router.push(`/Free/Wheel`);
  };

  const generateUniqueGrid = () => {
    if (!numbersInput) {
      toast({
        title: 'Error',
        description: 'Number sequence not found.',
        variant: 'destructive',
      });
      return null;
    }
    const allNumbers = Array.from(parseNumbers(numbersInput));
    const cardSize = gridSize * gridSize;
    const requiredNumbers = cardSize;

    if (allNumbers.length < requiredNumbers) {
      toast({
        title: 'Not enough numbers',
        description: `You need at least ${requiredNumbers} unique numbers for this grid.`,
        variant: 'destructive',
      });
      return null;
    }

    const existingNumberSets = new Set(
      tickets.map((t) =>
        JSON.stringify(t.grid.filter((c) => typeof c === 'number').sort())
      )
    );

    let newGridNumbers: number[];
    let attempts = 0;
    do {
      newGridNumbers = shuffleArray(allNumbers).slice(0, requiredNumbers);
      attempts++;
      if (attempts > 100) {
        // Failsafe to prevent infinite loop
        toast({
          title: 'Generation failed',
          description:
            'Could not generate a unique ticket. Try changing the number sequence.',
          variant: 'destructive',
        });
        return null;
      }
    } while (existingNumberSets.has(JSON.stringify([...newGridNumbers].sort())));

    let newGrid: (string | number | null)[] = [...newGridNumbers];
    
    return newGrid;
  };

  const handleGenerateClick = () => {
    const trimmedName = participantName.trim();
    if (!trimmedName) {
      toast({
        title: 'Name required',
        description: 'Please enter a name for the participant.',
        variant: 'destructive',
      });
      return;
    }

    if (
      tickets.some(
        (ticket) => ticket.name.toLowerCase() === trimmedName.toLowerCase()
      )
    ) {
      toast({
        title: 'Duplicate Name',
        description: `A ticket for "${trimmedName}" has already been generated. Please use a different name.`,
        variant: 'destructive',
      });
      return;
    }

    if (!gameName) {
      toast({
        title: 'Game Info Missing',
        description: 'Could not find game details. Please start a new game.',
        variant: 'destructive',
      });
      return;
    }

    const newGrid = generateUniqueGrid();
    if (!newGrid) return;

    const randomIcon =
      freeSpaceIcons[Math.floor(Math.random() * freeSpaceIcons.length)];

    const ticketId = generateTicketId();

    const newTicket: Ticket = {
      id: ticketId,
      name: trimmedName,
      gameName: gameName,
      grid: newGrid,
      size: gridSize,
      iconName: (randomIcon as any).displayName || 'Diamond',
    };

    const updatedTickets = [newTicket, ...tickets];
    setTickets(updatedTickets);
    saveTicketsToStorage(updatedTickets);
    
    setParticipantName('');
    setIsNameModalOpen(false);
  };

  const removeTicket = (id: string) => {
    const updatedTickets = tickets.filter((t) => t.id !== id);
    setTickets(updatedTickets);
    saveTicketsToStorage(updatedTickets);
  };

  if (!isClient) return <div>Loading...</div>;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Sticky Header for Actions */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm z-10 border-b">
        <div className="container mx-auto p-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" className="w-full sm:w-auto" onClick={() => setIsNameModalOpen(true)}>
            <PlusCircle className="mr-2 h-5 w-5" />
            Generate New Ticket
          </Button>
          {canStartGame && (
            <Button size="lg" variant="outline" className="w-full sm:w-auto" onClick={handleSpinClick}>
              <Dices className="mr-2 h-5 w-5" /> Spin the Wheel
            </Button>
          )}
        </div>
        {!canStartGame && tickets.length > 0 && (
          <p className="pb-2 text-sm text-center text-muted-foreground">
            Generate {minTickets - tickets.length} more tickets to start the game.
          </p>
        )}
      </div>

      {/* Main Content */}
      <div className="container mx-auto p-4 md:p-8 flex-grow">
        {tickets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="relative group">
                <TicketDisplay ticket={ticket} />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeTicket(ticket.id)}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete ticket</span>
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-16">
            <h2 className="text-2xl font-semibold">No Tickets Generated Yet</h2>
            <p className="mt-2 text-muted-foreground">Click the "Generate New Ticket" button above to start creating tickets for your players.</p>
          </div>
        )}
      </div>

      <Dialog open={isNameModalOpen} onOpenChange={setIsNameModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Enter Participant's Name</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={participantName}
                onChange={(e) => setParticipantName(e.target.value)}
                className="col-span-3"
                autoComplete="off"
                onKeyDown={(e) => e.key === 'Enter' && handleGenerateClick()}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </DialogClose>
            <Button type="button" onClick={handleGenerateClick}>
              Generate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function GenerateTicketPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GenerateTicketContent />
    </Suspense>
  );
}
