"use client";

import { Suspense, useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";


function FormulaContent() {
  const router = useRouter();
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
    const gameData = localStorage.getItem("freeGameData");
    if (!gameData) {
      toast({
        title: "No Game Data Found",
        description: "Please play a game first to see the formula in action.",
        variant: "destructive",
      });
      router.push("/Free/Game");
    }
  }, [router, toast]);


  if (!isClient) {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <RefreshCw className="h-10 w-10 animate-spin text-primary" />
        </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center p-4 md:p-8">
      <div className="w-full max-w-4xl">
        <Card className="shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-4xl font-headline text-primary">Scoring Formula</CardTitle>
            <CardDescription className="text-lg">Understand how winners are determined when there's no Full House.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-8 items-center">
             <p className="text-center text-muted-foreground">The scoring system is designed to reward players who get closest to a Full House. Points are awarded for completed cells, lines, and patterns. In case of a tie, the player who achieved their score first wins.</p>
            
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Button variant="outline" onClick={() => router.push('/Free/Game')}>
                  <Home className="mr-2 h-4 w-4" /> Start a New Game
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
