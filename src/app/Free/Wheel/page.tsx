
'use client';

import { Suspense, useEffect, useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  parseNumbers,
  shuffleArray,
  getActiveAdConfig,
} from '@/lib/game-utils';
import { BingoGrid } from '@/components/game/BingoGrid';
import { NumberWheel } from '@/components/game/NumberWheel';
import { Button } from '@/components/ui/button';
import { Home, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { freeSpaceIcons } from '@/components/icons';
import Image from 'next/image';
import { AdPlacement } from '@/lib/ads-config';

type Ticket = {
  id: string;
  name: string;
  gameName: string;
  grid: (string | number | null)[];
  size: number;
  iconName: string;
};

const minTicketsRequired = {
  3: 5,
  4: 11,
  5: 18,
};

function GamePageContent() {
  const router = useRouter();
  const { toast } = useToast();

  const [isClient, setIsClient] = useState(false);

  const [cardData, setCardData] = useState<(string | number | null)[]>([]);
  const [spunNumbersHistory, setSpunNumbersHistory] = useState<Set<number>>(
    new Set()
  );

  const [gameConfig, setGameConfig] = useState<{
    size: number;
    numbers: string;
    gameName: string;
    grid: string;
  } | null>(null);
  const [allGameNumbers, setAllGameNumbers] = useState<number[]>([]);
  const [iconName, setIconName] = useState('Diamond');

  const [activeAd, setActiveAd] = useState<AdPlacement | null>(null);

  const FreeSpaceIcon = useMemo(() => {
    if (typeof window === 'undefined') return freeSpaceIcons[0];
    const icon = freeSpaceIcons.find((i) => (i as any).displayName === iconName);
    return icon || freeSpaceIcons[0];
  }, [iconName]);

  useEffect(() => {
    setIsClient(true);
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

    const storedConfig = localStorage.getItem('freeGameData');

    if (storedConfig) {
      try {
        const parsedConfig = JSON.parse(storedConfig);
        const configWithSize = {
          ...parsedConfig,
          size: parseInt(parsedConfig.grid.split('x')[0], 10),
        };
        setGameConfig(configWithSize);
        setActiveAd(getActiveAdConfig().placements.wheel);

        const {
          size: configSize,
          numbers: configNumbers,
          gameName: configGameName,
          grid: configGrid,
        } = configWithSize;

        // Ticket validation
        const minTickets =
          minTicketsRequired[configSize as keyof typeof minTicketsRequired];
        const storageKey = `bingo-tickets-${configGameName}-${configGrid}-${configNumbers}`;
        const ticketsStr = localStorage.getItem(storageKey);
        const tickets: Ticket[] = ticketsStr ? JSON.parse(ticketsStr) : [];

        if (tickets.length < minTickets) {
          toast({
            title: 'Not Enough Tickets',
            description: `A ${configSize}x${configSize} game requires at least ${minTickets} tickets to be generated. You have ${tickets.length}.`,
            variant: 'destructive',
            duration: 5000,
          });
          router.push('/Free/Tickets');
          return;
        }

        const allNumbers = Array.from(parseNumbers(configNumbers));
        const cardSize = configSize * configSize;

        if (allNumbers.length === 0) {
          toast({
            title: 'Invalid numbers',
            description: 'Please provide a valid number sequence.',
            variant: 'destructive',
          });
          router.push('/Free/Game');
          return;
        }
        
        const hasFreeSpace = false; // No free space in free games
        const requiredNumbersForGrid = hasFreeSpace ? cardSize -1 : cardSize;

        if (allNumbers.length < requiredNumbersForGrid) {
          toast({
            title: 'Not enough numbers',
            description: `You need at least ${requiredNumbersForGrid} unique numbers for this grid size.`,
            variant: 'destructive',
          });
          router.push('/Free/Game');
          return;
        }

        let initialCardData: (string | number | null)[] =
          Array(cardSize).fill(null);
        const randomIcon =
          freeSpaceIcons[Math.floor(Math.random() * freeSpaceIcons.length)];
        const selectedIconName = (randomIcon as any).displayName || 'Diamond';
        setIconName(selectedIconName);

        if (hasFreeSpace) {
          const centerIndex = Math.floor(cardSize / 2);
          initialCardData[centerIndex] = 'FREE';
        }

        setAllGameNumbers(shuffleArray(allNumbers));
        setCardData(initialCardData);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Could not load game configuration. Please start a new game.',
          variant: 'destructive',
        });
        localStorage.removeItem('freeGameData');
        router.push('/Free/Game');
      }
    } else {
      toast({
        title: 'No Game Found',
        description: 'No game configuration found. Redirecting to home.',
        variant: 'destructive',
      });
      router.push('/Free/Game');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, toast]);

  const availableNumbers = useMemo(() => {
    return allGameNumbers.filter((n) => !spunNumbersHistory.has(n));
  }, [allGameNumbers, spunNumbersHistory]);

  const isGridFull = useMemo(() => {
    return cardData.every((cell) => cell !== null);
  }, [cardData]);

  const handleSpinEnd = useCallback((selectedNumber: number) => {
    setSpunNumbersHistory((prev) => new Set(prev).add(selectedNumber));

    setCardData((prevCardData) => {
      const newCardData = [...prevCardData];
      const nextEmptyIndex = newCardData.findIndex((cell) => cell === null);
      if (nextEmptyIndex !== -1) {
        newCardData[nextEmptyIndex] = selectedNumber;
      }
      return newCardData;
    });
  }, []);

  const handleFindWinner = () => {
    const finalSpunNumbers = Array.from(spunNumbersHistory);
    localStorage.setItem(
      'bingoGameResults',
      JSON.stringify({
        spunNumbers: finalSpunNumbers,
        finalGrid: cardData,
        iconName: iconName,
      })
    );
    router.push('/Free/Winner');
  };

  if (!isClient || !gameConfig || allGameNumbers.length === 0) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <RefreshCw className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8 min-h-screen flex flex-col gap-8">
      <div className="flex flex-col-reverse lg:flex-row gap-8 flex-1 items-center justify-center">
        <div className="lg:w-2/3 flex flex-col justify-center items-center gap-8">
          <div className="w-full flex flex-col items-center justify-center gap-4">
            <NumberWheel
              numbers={availableNumbers}
              onSpinEnd={handleSpinEnd}
              isGridFull={isGridFull}
              onFindWinner={handleFindWinner}
            />
          </div>
         {activeAd && (
            <div className="w-full max-w-2xl">
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
        </div>

        <div className="lg:w-1/3 flex flex-col items-center justify-start lg:justify-center">
          <Card className="p-4 shadow-xl w-full max-w-md lg:max-w-none">
            <BingoGrid
              size={gameConfig.size}
              cardData={cardData}
              FreeSpaceIcon={FreeSpaceIcon}
            />
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function GamePage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-full items-center justify-center">
          <RefreshCw className="h-10 w-10 animate-spin text-primary" />
        </div>
      }
    >
      <GamePageContent />
    </Suspense>
  );
}
