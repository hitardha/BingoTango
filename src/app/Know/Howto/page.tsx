
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, Gamepad2, Ticket, Trophy, Download, Share2 } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How to Play - BingoTango Tutorial',
  description: 'Learn how to play BingoTango. Follow our step-by-step guide to set up your game, generate and share tickets, and find the winner using our transparent scoring system.',
  keywords: ['how to play bingo', 'bingo rules', 'bingo instructions', 'BingoTango tutorial', 'bingo scoring', 'game setup', 'generate bingo tickets', 'bingo winner', 'transparent contest'],
};

export default function HowToPlayPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
        <header className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-headline text-primary">How to Play BingoTango</h1>
            <Button asChild variant="outline">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
              </Link>
            </Button>
        </header>

        <div className="space-y-12">
            {/* Step 1: Start a Game */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <div className="bg-primary/10 p-3 rounded-full"><Gamepad2 className="w-8 h-8 text-primary" /></div>
                        <div>
                            <CardTitle className="text-2xl">Step 1: Start a New Game</CardTitle>
                            <CardDescription>Choose your grid and set up your game session.</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div>
                        <p className="mb-4">From the "Play Free Games" card on the home page, you'll land on the game setup screen. Here you can:</p>
                        <ul className="list-disc list-inside space-y-2">
                            <li><strong>Select a Grid Type:</strong> We offer various grid sizes (3x3, 4x4, 5x5). Choose based on your audience: "Kitty Party" is great for small groups, while "Super Spin" is perfect for classic bingo lovers.</li>
                            <li><strong>Name Your Game:</strong> Give your bingo session a unique name (e.g., "Friday Night Fun").</li>
                            <li><strong>Define Numbers:</strong> Set the range of numbers to be used in the game (like 1-75) or a custom list.</li>
                        </ul>
                    </div>
                </CardContent>
            </Card>

             {/* Step 2: Generate Tickets */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <div className="bg-primary/10 p-3 rounded-full"><Ticket className="w-8 h-8 text-primary" /></div>
                        <div>
                            <CardTitle className="text-2xl">Step 2: Generate & Share Tickets</CardTitle>
                            <CardDescription>Create unique bingo tickets for all your players.</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div>
                        <p className="mb-4">Once your game is set up, you can generate unique tickets for your players. While our system can create a vast number of combinations, there are practical limits based on the grid size:</p>
                        <ul className="list-disc list-inside space-y-2 mb-4">
                            <li><strong>3x3 Grids:</strong> Up to 2,000 unique tickets can be generated.</li>
                            <li><strong>4x4 Grids:</strong> Up to 720,000 unique tickets can be generated.</li>
                            <li><strong>5x5 Grids:</strong> Virtually unlimited tickets can be generated.</li>
                        </ul>
                        <p className="mb-4">Each player needs their own ticket!</p>
                        <ul className="list-disc list-inside space-y-2">
                            <li><strong>Enter Player Name:</strong> Type a player's name and click "Generate New Ticket".</li>
                            <li><strong>Unique Grid:</strong> A unique bingo grid is instantly created for that player.</li>
                            <li><strong>Download or Share:</strong> Each ticket has two options:
                                <ul className="list-inside list-['-_'] ml-4">
                                    <li><Download className="inline h-4 w-4 mr-1"/> <strong>PNG:</strong> Download a high-quality image of the ticket to print or send manually.</li>
                                    <li><Share2 className="inline h-4 w-4 mr-1"/> <strong>Share:</strong> Use your device's native share feature to send the ticket image directly via text, email, or social media.</li>
                                </ul>
                             </li>
                        </ul>
                        <p className="mt-4 text-sm text-muted-foreground">Each ticket displays the player's name and the game name, so it's easy to keep track.</p>
                    </div>
                </CardContent>
            </Card>

            {/* Step 3: Find the Winner */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <div className="bg-primary/10 p-3 rounded-full"><Trophy className="w-8 h-8 text-primary" /></div>
                        <div>
                            <CardTitle className="text-2xl">Step 3: Play the Game & Find the Winner</CardTitle>
                            <CardDescription>Spin the wheel and find out who has the highest score!</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div>
                        <p className="mb-4">As the host, you'll spin the virtual wheel. Each spin draws a new number.</p>
                         <ul className="list-disc list-inside space-y-2">
                            <li><strong>Spin the Wheel:</strong> Click the "SPIN" button to draw a number. This number is then automatically added to a "Golden Ticket" grid that fills up as you play.</li>
                            <li><strong>Game End:</strong> Once the grid is full, the spin button becomes "Find the Winner".</li>
                            <li><strong>Scoring:</strong> If no one gets a "Full House" (all numbers), don't worry! We use a point-based system. Points are awarded for completed cells, lines, and patterns.</li>
                             <li><strong>Tie-Breaker Rules:</strong>
                                <ul className="list-inside list-['-_'] ml-4">
                                    <li>The player with the highest score wins.</li>
                                    <li>If scores are tied, the player who matched a number first (a "first strike") wins.</li>
                                    <li>In the rare event of a tie on the first strike, a secondary calculation on all matched numbers determines the winner. Earlier matches are always better!</li>
                                </ul>
                             </li>
                            <li><strong>Calculate Score:</strong> All scores are automatically calculated and displayed on the "All Scores" page. You can also use the "Score Calculator" to manually check a score.</li>
                        </ul>
                    </div>
                </CardContent>
            </Card>

             <div className="text-center py-8">
                <Button size="lg" asChild>
                    <Link href="/Free/Game">
                        Let's Play! <Gamepad2 className="ml-2 h-5 w-5" />
                    </Link>
                </Button>
            </div>
        </div>

        <footer className="mt-8 pt-8 border-t">
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
                <Link href="/Know/Aboutus" className="hover:text-primary">About Us</Link>
                <Link href="/Know/Faq" className="hover:text-primary">FAQ</Link>
                <Link href="/Know/Terms" className="hover:text-primary">Terms & Conditions</Link>
                <Link href="/Know/Privacy" className="hover:text-primary">Privacy Policy</Link>
                <Link href="/Know/Refunds" className="hover:text-primary">Returns & Refunds</Link>
            </div>
        </footer>
    </div>
  );
}
