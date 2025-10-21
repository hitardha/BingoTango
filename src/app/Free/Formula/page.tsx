
"use client";

import { Suspense, useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Home, Ticket, Gem, RefreshCw, Calculator } from "lucide-react";
import { scoreWeights } from "@/lib/score-calculator";
import { cn } from "@/lib/utils";
import { freeSpaceIcons } from "@/components/icons";
import { parseNumbers, shuffleArray } from "@/lib/game-utils";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

function ExampleGrid() {
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);
    const [goldenTicketGrid, setGoldenTicketGrid] = useState<(string | number | null)[]>([]);
    const [playerTicketGrid, setPlayerTicketGrid] = useState<(string | number | null)[]>([]);
    const [spunNumbers, setSpunNumbers] = useState<number[]>([]);
    const [gridSize, setGridSize] = useState(3);
    const [Icon, setIcon] = useState(() => freeSpaceIcons[0]);
    const { toast } = useToast();


    useEffect(() => {
        setIsClient(true);
        const resultsStr = localStorage.getItem("bingoGameResults");
        const gameDataStr = localStorage.getItem("freeGameData");
        
        if (resultsStr && gameDataStr) {
            try {
                const results = JSON.parse(resultsStr);
                const gameData = JSON.parse(gameDataStr);

                setGoldenTicketGrid(results.finalGrid || []);
                setSpunNumbers(results.spunNumbers || []);

                const size = parseInt(gameData.grid.split('x')[0]);
                setGridSize(size);
                
                const icon = freeSpaceIcons.find(i => (i as any).displayName === results.iconName) || freeSpaceIcons[0];
                setIcon(() => icon);

                // Generate a realistic player ticket example
                const allNumbers = Array.from(parseNumbers(gameData.numbers));
                const cardSize = size * size;
                const requiredNumbers = cardSize;
                
                if (allNumbers.length >= requiredNumbers) {
                    const playerNumbers = shuffleArray(allNumbers).slice(0, requiredNumbers);
                    let examplePlayerGrid: (string | number | null)[] = [...playerNumbers];
                    setPlayerTicketGrid(examplePlayerGrid);
                } else {
                    // Fallback in case there aren't enough numbers
                    setPlayerTicketGrid(results.finalGrid || []);
                }

            } catch (e) {
                console.error("Failed to parse game data from localStorage", e);
                toast({ title: "Error", description: "Could not load example data.", variant: "destructive"});
                router.push('/Free/Game');
            }

        } else {
             toast({ title: "No game data", description: "Play a game to see an example.", variant: "destructive"});
            router.push('/Free/Game');
        }
    }, [router, toast]);


    const { calculation, totalScore } = useMemo(() => {
        if (!playerTicketGrid || playerTicketGrid.length === 0 || !spunNumbers || spunNumbers.length === 0) {
            return { calculation: [], totalScore: 0 };
        }
        
        const weights = scoreWeights[gridSize as keyof typeof scoreWeights];
        if (!weights) return { calculation: [], totalScore: 0 };
        const spunSet = new Set(spunNumbers);
        let score = 0;
        const calc: { item: string; calculation: string; total: number }[] = [];

        // Cells
        const completedCells = (playerTicketGrid.filter(c => typeof c === 'number' && spunSet.has(c)) as number[]).length;
        score += completedCells * weights.cell;
        calc.push({ item: `Completed Cells (${completedCells})`, calculation: `${completedCells} cells × ${weights.cell} pts`, total: completedCells * weights.cell });

        const lines: (number | string)[][] = [];
        // Rows & Columns
        for (let i = 0; i < gridSize; i++) {
            lines.push(playerTicketGrid.slice(i * gridSize, (i + 1) * gridSize) as (string|number)[]);
            const col = [];
            for (let j = 0; j < gridSize; j++) col.push(playerTicketGrid[j * gridSize + i]);
            lines.push(col as (string|number)[]);
        }

        let fullLines = 0, n1Lines = 0, n2Lines = 0;
        lines.forEach(line => {
            const filledCount = line.filter(c => (typeof c === 'number' && spunSet.has(c)) || c === 'FREE').length;
            if (filledCount === gridSize) fullLines++;
            else if (filledCount === gridSize - 1) n1Lines++;
            else if (filledCount === gridSize - 2 && (gridSize > 2)) n2Lines++;
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
            const corners = [playerTicketGrid[0], playerTicketGrid[gridSize - 1], playerTicketGrid[gridSize * (gridSize - 1)], playerTicketGrid[gridSize * gridSize - 1]];
            const filledCorners = corners.filter(c => (typeof c === 'number' && spunSet.has(c)) || c === 'FREE').length;
            if (filledCorners === 4) {
                score += weights.corners;
                calc.push({ item: "Corners (4/4)", calculation: `1 bonus × ${weights.corners} pts`, total: weights.corners });
            } else {
                calc.push({ item: `Corners (${filledCorners}/4)`, calculation: `0 bonus × ${weights.corners} pts`, total: 0 });
            }
        }
        
        return { calculation: calc, totalScore: score };
    }, [playerTicketGrid, spunNumbers, gridSize]);

    if (!isClient || goldenTicketGrid.length === 0 || playerTicketGrid.length === 0) {
        return (
            <div className="flex h-64 w-full items-center justify-center">
                <RefreshCw className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }
    
    return (
        <div className="w-full flex flex-col gap-8 rounded-lg border p-4 sm:p-6 bg-secondary/30">
             <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
                {/* Golden Ticket */}
                <div className="flex-1 w-full max-w-xs mx-auto">
                    <h3 className="text-xl font-bold mb-4 flex items-center justify-center gap-2"><Gem className="text-amber-400"/>Golden Ticket</h3>
                    <div className={cn(`grid gap-1 sm:gap-2 mx-auto bg-card p-2 rounded-lg border border-amber-400`, 
                        gridSize === 3 ? "grid-cols-3" : gridSize === 4 ? "grid-cols-4" : "grid-cols-5")}>
                        {goldenTicketGrid.map((cell, index) => {
                            const isFree = cell === "FREE";
                            return (
                                <div key={`gt-${index}`} className={cn("aspect-square rounded-md flex items-center justify-center font-bold", 
                                 gridSize === 3 ? "text-xl" : gridSize === 4 ? "text-lg" : "text-base",
                                 isFree ? "bg-primary text-primary-foreground" : "bg-amber-400/20 text-foreground")}>
                                     {isFree ? <Icon className="w-6 h-6" /> : cell}
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Player Ticket */}
                <div className="flex-1 w-full max-w-xs mx-auto">
                    <h3 className="text-xl font-bold mb-4 flex items-center justify-center gap-2"><Ticket className="text-primary"/>Player's Ticket Example</h3>
                    <div className={cn(`grid gap-1 sm:gap-2 mx-auto bg-card p-2 rounded-lg border`,
                         gridSize === 3 ? "grid-cols-3" : gridSize === 4 ? "grid-cols-4" : "grid-cols-5")}>
                        {playerTicketGrid.map((cell, index) => {
                            const isFree = cell === "FREE";
                            const isSpun = typeof cell === 'number' && spunNumbers.includes(cell);
                            return (
                                <div key={`pt-${index}`} className={cn("aspect-square rounded-md flex items-center justify-center font-bold border-2",
                                    gridSize === 3 ? "text-xl" : gridSize === 4 ? "text-lg" : "text-base",
                                    isFree ? "bg-primary text-primary-foreground" :
                                    isSpun ? "bg-accent text-accent-foreground ring-2 ring-accent" : "bg-card text-card-foreground"
                                )}>
                                    {isFree ? <Icon className="w-6 h-6" /> : cell}
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
             <div className="w-full">
                 <h3 className="text-xl font-bold mb-4 text-center">Example Score Calculation</h3>
                 <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Item</TableHead>
                            <TableHead>Calculation</TableHead>
                            <TableHead className="text-right">Points</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                       {calculation.map(item => (
                           <TableRow key={item.item}>
                               <TableCell>{item.item}</TableCell>
                               <TableCell className="text-muted-foreground">{item.calculation}</TableCell>
                               <TableCell className="text-right font-bold">{item.total}</TableCell>
                           </TableRow>
                       ))}
                       <TableRow className="border-t-2 border-primary">
                           <TableCell colSpan={2} className="font-bold text-lg text-right">Total Score</TableCell>
                           <TableCell className="text-right font-bold text-lg">{totalScore}</TableCell>
                       </TableRow>
                    </TableBody>
                 </Table>
            </div>
        </div>
    )
}


function FormulaContent() {
  const router = useRouter();
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);
  const [gameName, setGameName] = useState("");
  const [gridSize, setGridSize] = useState(0);

  useEffect(() => {
    setIsClient(true);
    const gameDataStr = localStorage.getItem("freeGameData");
    
    if (gameDataStr) {
        try {
            const gameData = JSON.parse(gameDataStr);
            setGameName(gameData.gameName);
            setGridSize(parseInt(gameData.grid.split('x')[0]));
        } catch (e) {
            toast({ title: "Error", description: "Could not load game data.", variant: "destructive"});
            router.push('/Free/Game');
        }
    } else {
        toast({ title: "No game data", description: "Please start a game first.", variant: "destructive"});
        router.push('/Free/Game');
    }

  }, [router, toast]);
  
  const getScoringRules = (size: number) => {
    if (size === 0) return [];
    const weights = scoreWeights[size as keyof typeof scoreWeights] || scoreWeights[5];
    return [
      { rule: "Each Completed Cell", points: `${weights.cell} pts` },
      { rule: `Full Row (${size} cells)`, points: `${weights.line} pts` },
      { rule: `Full Column (${size} cells)`, points: `${weights.line} pts` },
      { rule: `N-1 Potential (Line with ${size-1} filled cells)`, points: `${weights.nMinus1} pts` },
      ...(size > 2 ? [{ rule: `N-2 Potential (Line with ${size-2} filled cells)`, points: `${weights.nMinus2} pts` }] : []),
      ...(size > 2 ? [{ rule: "Corner Pattern (All 4 corners filled)", points: `${weights.corners} pts` }] : []),
    ]
  }

  if (!isClient || !gridSize) {
    return <div className="flex h-screen w-full items-center justify-center"><RefreshCw className="h-10 w-10 animate-spin text-primary" /></div>;
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center p-4 md:p-8">
      <div className="w-full max-w-4xl">
        <Card className="shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-4xl font-headline text-primary">No Full House?</CardTitle>
            <CardDescription className="text-lg">Here's how we find the winner for <span className="font-bold text-foreground">{gameName}</span>!</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-8 items-center">
            <div className="w-full">
              <h2 className="text-2xl font-bold mb-4 text-center">Scoring Rules ({gridSize}x{gridSize} Grid)</h2>
               <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Scoring Rule</TableHead>
                    <TableHead className="text-right">Points</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                    {getScoringRules(gridSize).map(rule => (
                        <TableRow key={rule.rule}>
                            <TableCell>{rule.rule}</TableCell>
                            <TableCell className="text-right font-bold">{rule.points}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
              </Table>
              <p className="text-sm text-muted-foreground mt-4 text-center">Tally up the points for each of your tickets. The player with the highest score wins!</p>
            </div>
            
            <ExampleGrid />
            
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Button variant="outline" onClick={() => router.push('/Free/Game')}>
                  <Home className="mr-2 h-4 w-4" /> Start a New Game
              </Button>
               <Button asChild variant="outline">
                    <Link href="/Free/Winner">
                        <Trophy className="mr-2 h-4 w-4" /> Back to Winner
                    </Link>
                </Button>
              <Button asChild>
                  <Link href="/Free/Calculator">
                    <Calculator className="mr-2 h-4 w-4" /> Score Calculator
                  </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function FormulaPage() {
  return (
    <Suspense fallback={<div className="flex h-screen w-full items-center justify-center"><RefreshCw className="h-10 w-10 animate-spin text-primary" /></div>}>
      <FormulaContent />
    </Suspense>
  );
}

    