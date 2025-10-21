import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, Ticket, Trophy } from "lucide-react";
import Link from "next/link";

const summaryCards = [
  {
    title: "Total Winnings",
    value: "$1,250.75",
    description: "+20% from last month",
    icon: <Trophy className="size-6 text-primary" />,
    link: "/arena/winnings",
  },
  {
    title: "Win Rate",
    value: "62%",
    description: "Across all game types",
    icon: <BarChart3 className="size-6 text-primary" />,
    link: "/arena/stats",
  },
  {
    title: "Active Tickets",
    value: "12",
    description: "Ready for upcoming games",
    icon: <Ticket className="size-6 text-primary" />,
    link: "/arena/tickets",
  },
];

export default function ArenaPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Welcome back, Gladiator!</h1>
        <p className="text-muted-foreground">Here is your battle summary.</p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {summaryCards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              {card.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">{card.description}</p>
            </CardContent>
            <CardContent>
               <Button variant="outline" size="sm" asChild>
                 <Link href={card.link}>View Details</Link>
               </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      <div>
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Next Big Game</CardTitle>
                <CardDescription>The weekly jackpot is starting soon. Are you ready?</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
                <div>
                    <p className="text-2xl font-bold text-primary">$10,000 Jackpot</p>
                    <p className="text-muted-foreground">Starts in: 2h 15m</p>
                </div>
                <Button>Join Lobby</Button>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
