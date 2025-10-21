import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { LobbyRecommender } from "./lobby-recommender";

const freeGames = [
  { name: "Classic 75", description: "The timeless American bingo experience." },
  { name: "Speedy 30", description: "Quick rounds for fast-paced fun." },
  { name: "Pattern Master", description: "Create complex patterns to win." },
];

const recentWins = [
  { player: "Player123", prize: "$5.00", game: "Classic 75" },
  { player: "BingoFan", prize: "$2.50", game: "Speedy 30" },
  { player: "LadyLuck", prize: "$10.00", game: "Pattern Master" },
  { player: "WinnerWin", prize: "$1.00", game: "Classic 75" },
];

export default function FreeGamesPage() {
  const gameCardImage = PlaceHolderImages.find(p => p.id === 'free-game-card');
  const rewardWheelImage = PlaceHolderImages.find(p => p.id === 'reward-wheel');

  return (
    <div className="container mx-auto py-12 px-4 space-y-16">
      <div className="text-center">
        <h1 className="text-4xl font-bold font-headline text-primary sm:text-5xl">Free Play Area</h1>
        <p className="mt-4 text-lg text-foreground/80">
          Hone your skills, try new games, and find your perfect lobby.
        </p>
      </div>

      {/* Lobby Recommender */}
      <section>
        <LobbyRecommender />
      </section>

      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          {/* Game Modes */}
          <section>
            <h2 className="text-3xl font-headline font-semibold mb-6">Game Modes</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {freeGames.map(game => (
                <Card key={game.name} className="flex flex-col">
                  {gameCardImage && (
                    <Image
                      src={gameCardImage.imageUrl}
                      alt={gameCardImage.description}
                      data-ai-hint={gameCardImage.imageHint}
                      width={600}
                      height={400}
                      className="rounded-t-lg aspect-video object-cover"
                    />
                  )}
                  <CardHeader>
                    <CardTitle className="font-headline">{game.name}</CardTitle>
                    <CardDescription>{game.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="mt-auto">
                    <Button className="w-full">Play Now</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Win Tracking */}
          <section>
            <h2 className="text-3xl font-headline font-semibold mb-6">Recent Public Wins</h2>
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Player</TableHead>
                    <TableHead>Game</TableHead>
                    <TableHead className="text-right">Prize</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentWins.map((win, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{win.player}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{win.game}</Badge>
                      </TableCell>
                      <TableCell className="text-right font-semibold text-primary">{win.prize}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </section>
        </div>

        <div className="space-y-12">
          {/* Reward Wheel */}
          <section>
            <h2 className="text-3xl font-headline font-semibold mb-6">Reward Wheel</h2>
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="font-headline">Spin to Win!</CardTitle>
                <CardDescription>Get a free spin every day for a chance at bonus rewards.</CardDescription>
              </CardHeader>
              <CardContent>
                {rewardWheelImage && (
                  <Image
                    src={rewardWheelImage.imageUrl}
                    alt={rewardWheelImage.description}
                    data-ai-hint={rewardWheelImage.imageHint}
                    width={500}
                    height={500}
                    className="mx-auto rounded-full"
                  />
                )}
              </CardContent>
              <CardContent>
                <Button>Spin Wheel</Button>
              </CardContent>
            </Card>
          </section>

          {/* Odds Calculator */}
          <section>
            <h2 className="text-3xl font-headline font-semibold mb-6">Odds Calculator</h2>
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Calculate Your Odds</CardTitle>
                <CardDescription>Estimate your potential winnings.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="players">Number of Players</Label>
                  <Input id="players" type="number" defaultValue="50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cards">Your Cards</Label>
                  <Input id="cards" type="number" defaultValue="4" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prize">Prize Pool</Label>
                  <Input id="prize" type="text" defaultValue="$100.00" />
                </div>
                <Button className="w-full">Calculate</Button>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
