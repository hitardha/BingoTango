
"use client";

import { Suspense, useEffect, useState, useMemo, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Gem, RefreshCw, Calculator, Home, Download, Share2, Users, FileText } from "lucide-react";
import { scoreWeights } from "@/lib/score-calculator";
import { cn } from "@/lib/utils";
import { freeSpaceIcons } from "@/components/icons";
import { getActiveAd, parseNumbers } from "@/lib/game-utils";
import Link from "next/link";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import * as htmlToImage from 'html-to-image';
import { AdCreative } from "@/lib/ads-config";


const gridClasses = {
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
};

function ScoreCalculatorContent() {
  const router = useRouter();
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);
  
  const [goldenTicketGrid, setGoldenTicketGrid] = useState<(string | number | null)[]>([]);
  const [spunNumbers, setSpunNumbers] = useState<number[]>([]);
  const [gridSize, setGridSize] = useState(0);
  const [gameName, setGameName] = useState('');
  const [Icon, setIcon] = useState(() => freeSpaceIcons[0]);
  
  const [playerGrid, setPlayerGrid] = useState<(string | number | null)[]>([]);
  const [scoreResult, setScoreResult] = useState<{ calculation: any[], totalScore: number } | null>(null);

  const [activeAd, setActiveAd] = useState<AdCreative | null>(null);
  const [canShareFiles, setCanShareFiles] = useState(false);
  
  const goldenTicketRef = useRef<HTMLDivElement>(null);
  const [dateTime, setDateTime] = useState('');
  const [allGameNumbers, setAllGameNumbers] = useState<Set<number>>(new Set());


  useEffect(() => {
    setIsClient(true);
    setDateTime(new Date().toLocaleString());
    
    const gameDataStr = localStorage.getItem('freeGameData');
    if (!gameDataStr) {
      toast({
        title: "No Active Game",
        description: "Please start a new game from the home page.",
        variant: "destructive",
      });
      router.push("/Free/Game");
      return;
    }

    if (navigator.share && navigator.canShare) {
        const dummyFile = new File(["foo"], "foo.png", {type: "image/png"});
        setCanShareFiles(navigator.canShare({ files: [dummyFile] }));
    }

    setActiveAd(getActiveAd('scoreCalculator'));
    const resultsStr = localStorage.getItem("bingoGameResults");

    if (resultsStr && gameDataStr) {
      try {
        const results = JSON.parse(resultsStr);
        const config = JSON.parse(gameDataStr);

        setGoldenTicketGrid(results.finalGrid || []);
        setSpunNumbers(results.spunNumbers || []);
        setGridSize(parseInt(config.grid.split('x')[0]) || 0);
        setGameName(config.gameName);
        setAllGameNumbers(parseNumbers(config.numbers));


        const icon = freeSpaceIcons.find(i => (i as any).displayName === results.iconName) || freeSpaceIcons[0];
        setIcon(() => icon);

        const cardSize = parseInt(config.grid.split('x')[0]) * parseInt(config.grid.split('x')[0]);
        const initialGrid = Array(cardSize).fill("");
        setPlayerGrid(initialGrid);

      } catch (e) {
        console.error("Failed to parse game data from localStorage", e);
        router.push('/Free/Game');
      }
    } else {
      router.push('/Free/Game');
    }
  }, [router, toast]);

  const handleInputChange = (index: number, value: string) => {
    const newGrid = [...playerGrid];
    if (value === "" || (!isNaN(Number(value)) && Number(value) > 0)) {
        newGrid[index] = value === "" ? "" : Number(value);
        setPlayerGrid(newGrid);
    }
    // Reset score result if grid is changed
    if (scoreResult) {
        setScoreResult(null);
    }
  };

  const spunNumbersSet = useMemo(() => new Set(spunNumbers), [spunNumbers]);

  const handleCalculateScore = useCallback(() => {
    const weights = scoreWeights[gridSize as keyof typeof scoreWeights];
    if (!weights) return;

    const filledGrid = playerGrid.map(cell => cell === "" ? null : cell);
    
    // Validation for duplicate numbers
    const numbersOnly = filledGrid.filter(cell => typeof cell === 'number') as number[];
    const seen = new Set<number>();
    const duplicates = new Set<number>();
    numbersOnly.forEach(num => {
        if (seen.has(num)) {
            duplicates.add(num);
        } else {
            seen.add(num);
        }
    });

    if (duplicates.size > 0) {
        toast({ title: "Invalid Ticket", description: `Your ticket contains duplicate numbers: ${Array.from(duplicates).join(', ')}. Please correct them.`, variant: "destructive" });
        return;
    }
    
    // Validation for out-of-range numbers
    const outOfRangeNumbers = numbersOnly.filter(num => !allGameNumbers.has(num));
    if (outOfRangeNumbers.length > 0) {
      toast({
        title: "Invalid Number(s)",
        description: `Your ticket has numbers that were not in the game: ${outOfRangeNumbers.join(', ')}.`,
        variant: "destructive",
      });
      return;
    }

    const hasEmptyCells = filledGrid.some((cell, index) => {
        return cell === null;
    });

    if (hasEmptyCells) {
        toast({ title: "Incomplete Grid", description: "Please fill all cells in your ticket.", variant: "destructive" });
        return;
    }

    let score = 0;
    const calc: { item: string; calculation: string; total: number }[] = [];

    // Cells
    const completedCells = (filledGrid.filter(c => typeof c === 'number' && spunNumbersSet.has(c)) as number[]).length;
    score += completedCells * weights.cell;
    calc.push({ item: `Completed Cells (${completedCells})`, calculation: `${completedCells} cells × ${weights.cell} pts`, total: completedCells * weights.cell });

    const lines: (string | number | null)[][] = [];
    // Rows & Columns
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
    calc.push({ item: `Full Lines (${fullLines})`, calculation: `${fullLines} line(s) × ${weights.line} pts`, total: fullLines * weights.line });
    score += n1Lines * weights.nMinus1;
    calc.push({ item: `N-1 Lines (${n1Lines})`, calculation: `${n1Lines} line(s) × ${weights.nMinus1} pts`, total: n1Lines * weights.nMinus1 });
    if (gridSize > 2) {
      score += n2Lines * weights.nMinus2;
      calc.push({ item: `N-2 Lines (${n2Lines})`, calculation: `${n2Lines} line(s) × ${weights.nMinus2} pts`, total: n2Lines * weights.nMinus2 });
    }

    // Corners
    if (gridSize > 2) {
        const corners = [filledGrid[0], filledGrid[gridSize - 1], filledGrid[gridSize * (gridSize - 1)], filledGrid[gridSize * gridSize - 1]];
        const filledCorners = corners.filter(c => (typeof c === 'number' && spunNumbersSet.has(c)) || c === 'FREE').length;
        if (filledCorners === 4) {
            score += weights.corners;
            calc.push({ item: "Corners (4/4)", calculation: `1 bonus × ${weights.corners} pts`, total: weights.corners });
        } else {
            calc.push({ item: `Corners (${filledCorners}/4)`, calculation: `0 bonus × ${weights.corners} pts`, total: 0 });
        }
    }

    setScoreResult({ calculation: calc, totalScore: score });

  }, [playerGrid, spunNumbersSet, gridSize, toast, allGameNumbers]);

  const downloadTicket = useCallback(() => {
    if (goldenTicketRef.current === null) {
      return;
    }

    htmlToImage.toPng(goldenTicketRef.current, { cacheBust: true, pixelRatio: 2 })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = `bingo-tango-golden-ticket.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        toast({ title: "Error generating image", description: "Could not create PNG for download.", variant: "destructive"});
        console.error(err);
      });
  }, [toast]);

  const shareTicket = useCallback(async () => {
    if (goldenTicketRef.current === null) {
      return;
    }

    try {
      const dataUrl = await htmlToImage.toPng(goldenTicketRef.current, { cacheBust: true, pixelRatio: 2 });
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], `bingo-tango-golden-ticket.png`, { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'BingoTango Golden Ticket',
          text: `Here's the final Golden Ticket for our BingoTango game!`,
        });
      } else {
         toast({ title: "Sharing Not Supported", description: "Your browser does not support sharing files.", variant: "destructive"});
      }
    } catch (err) {
      toast({ title: "Error sharing ticket", description: "Could not generate image for sharing.", variant: "destructive"});
      console.error(err);
    }
  }, [toast]);


  if (!isClient || !gridSize) {
    return <div className="flex h-screen w-full items-center justify-center"><RefreshCw className="h-10 w-10 animate-spin text-primary" /></div>;
  }

  return (
    <div className="container mx-auto p-4 md:p-8 min-h-screen flex flex-col gap-8">
      <header className="flex justify-between items-center">
        <h1 className="text-4xl font-headline text-primary">BingoTango</h1>
         <div className="flex gap-2">
            <Button variant="outline" asChild>
                <Link href="/Free/Winner">
                    <Users className="mr-2 h-4 w-4" /> All Scores
                </Link>
            </Button>
            <Button variant="outline" onClick={() => router.push('/Free/Game')}>
                <Home className="mr-2 h-4 w-4" /> Home
            </Button>
        </div>
      </header>

      <Card>
        <CardHeader className="text-center">
            <CardTitle className="text-3xl font-headline text-primary">Score Calculator</CardTitle>
            <CardDescription>Enter your ticket numbers to see your score for <span className="font-bold text-foreground">{gameName}</span>!</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-8">
            <div className="w-full flex flex-col lg:flex-row gap-8 items-start justify-center">
                {/* Golden Ticket */}
                <div className="flex-1 w-full max-w-xs mx-auto">
                     <Card className="flex flex-col h-full">
                        <CardHeader className="p-4">
                            <h3 className="text-xl font-bold flex items-center justify-center gap-2"><Gem className="text-amber-400"/>Golden Ticket</h3>
                        </CardHeader>
                        <div ref={goldenTicketRef} className="p-4 bg-card flex-grow">
                            <div className={cn(`grid gap-1 sm:gap-2 mx-auto bg-card p-2 rounded-lg border border-amber-400`, gridClasses[gridSize as keyof typeof gridClasses])}>
                                {goldenTicketGrid.map((cell, index) => (
                                    <div key={`gt-${index}`} className={cn("aspect-square rounded-md flex items-center justify-center font-bold", 
                                        gridSize === 3 ? "text-xl" : gridSize === 4 ? "text-lg" : "text-base",
                                        cell === "FREE" ? "bg-primary text-primary-foreground" : "bg-amber-400/20 text-foreground")}>
                                        {cell === "FREE" ? <Icon className="w-6 h-6" /> : cell}
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground px-1">
                                <span>{gameName}</span>
                                <span>{dateTime}</span>
                            </div>
                        </div>
                        <CardFooter className="p-2 flex justify-end gap-2">
                           <Button variant="outline" size="sm" onClick={downloadTicket}><Download className="mr-2 h-4 w-4" /> PNG</Button>
                            {canShareFiles && <Button variant="outline" size="sm" onClick={shareTicket}><Share2 className="mr-2 h-4 w-4" /> Share</Button>}
                        </CardFooter>
                     </Card>
                </div>
                {/* Player Input Ticket */}
                <div className="flex-1 w-full max-w-xs mx-auto">
                    <Card className="flex flex-col h-full">
                         <CardHeader className="p-4">
                            <h3 className="text-xl font-bold text-center">Your Ticket</h3>
                        </CardHeader>
                        <CardContent className="p-4 flex-grow">
                            <div className={cn(`grid gap-1 sm:gap-2 mx-auto bg-card p-2 rounded-lg border`, gridClasses[gridSize as keyof typeof gridClasses])}>
                                {playerGrid.map((cell, index) => {
                                    const isFreeSpace = cell === "FREE";
                                    const isSpunAndMatched = !!scoreResult && typeof cell === 'number' && spunNumbersSet.has(cell);
                                    
                                    return (
                                        <div key={`player-${index}`} className={cn("aspect-square rounded-md flex items-center justify-center font-bold border-2", 
                                            isFreeSpace ? "bg-primary text-primary-foreground border-transparent" : 
                                            isSpunAndMatched ? "bg-accent text-accent-foreground border-accent" : 
                                            "bg-secondary/30 border-transparent")}>
                                            {isFreeSpace ? <Icon className="w-6 h-6" /> : (
                                                <Input
                                                    type="number"
                                                    value={cell as number | ""}
                                                    onChange={(e) => handleInputChange(index, e.target.value)}
                                                    className="w-full h-full text-center p-0 bg-transparent border-0 text-lg font-bold [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                    disabled={!!scoreResult}
                                                />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                        <CardFooter className="p-2 flex flex-row justify-center items-baseline gap-4">
                            <div className="text-3xl font-bold text-muted-foreground">Total Score</div>
                            <div className="text-5xl font-bold text-primary">
                                {scoreResult ? scoreResult.totalScore : '--'}
                            </div>
                        </CardFooter>
                    </Card>
                </div>
            </div>

            {scoreResult ? (
                 <Button asChild size="lg">
                    <Link href="/Free/Formula">
                        <FileText className="mr-2 h-5 w-5" /> Score Formula
                    </Link>
                </Button>
            ) : (
                <Button onClick={handleCalculateScore} size="lg">
                    <Calculator className="mr-2 h-5 w-5" /> Calculate Score
                </Button>
            )}
            
            {scoreResult && (
                <div className="w-full max-w-2xl mt-8">
                    <h3 className="text-2xl font-bold mb-4 text-center">Your Score Result</h3>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Item</TableHead>
                                <TableHead>Calculation</TableHead>
                                <TableHead className="text-right">Points</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                        {scoreResult.calculation.map(item => (
                            <TableRow key={item.item}>
                                <TableCell>{item.item}</TableCell>
                                <TableCell className="text-muted-foreground">{item.calculation}</TableCell>
                                <TableCell className="text-right font-bold">{item.total}</TableCell>
                            </TableRow>
                        ))}
                        <TableRow className="border-t-2 border-primary bg-primary/10">
                            <TableCell colSpan={2} className="font-bold text-lg text-right">Total Score</TableCell>
                            <TableCell className="text-right font-bold text-lg">{scoreResult.totalScore}</TableCell>
                        </TableRow>
                        </TableBody>
                    </Table>
                </div>
            )}
            {activeAd && (
                <div className="w-full max-w-4xl my-8">
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
        </CardContent>
      </Card>
    </div>
  );
}

export default function ScoreCalculatorPage() {
    return (
        <Suspense fallback={<div className="flex h-screen w-full items-center justify-center"><RefreshCw className="h-10 w-10 animate-spin text-primary" /></div>}>
            <ScoreCalculatorContent />
        </Suspense>
    );
}
