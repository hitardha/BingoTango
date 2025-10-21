import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ - BingoTango',
  description: 'Frequently Asked Questions about BingoTango. Learn about our marketing platform, how to host games, player rules, scoring, and our commitment to transparency.',
  keywords: ['BingoTango FAQ', 'marketing contest', 'promotional game questions', 'free to play bingo', 'transparent lucky draw', 'bingo scoring rules', 'giveaway platform'],
};

const faqItems = [
    {
        question: "What is BingoTango?",
        answer: "BingoTango is a contest-based marketing platform designed for engagement and fun. It is not a gambling site, and we do not encourage gambling. Our platform allows hosts to run bingo games as a promotional activity to connect with their audience."
    },
    {
        question: "Who can host a game on BingoTango?",
        answer: "BingoTango is a versatile tool for anyone looking to run a fair and transparent lucky draw or contest without charging participants. It's perfect for:\n\n- **YouTubers & Content Creators:** Host exciting giveaways to engage with your subscribers.\n- **Retail Stores & Businesses:** Run promotional lucky draws to attract customers and boost sales.\n- **Malls & Event Organizers:** Add a fun, interactive element to your events.\n- **Community Groups & Clubs:** Host transparent raffles for your members.\n- **Anyone** who wants to conduct a contest with 100% transparency, where the outcome is purely random and cannot be manipulated."
    },
    {
        question: "Do users or players have to pay to play?",
        answer: "No. Users and players do not need to pay any money to participate in games. Even if a player wanted to, there is no provision on our platform to use real money to play."
    },
    {
        question: "Do I need to pay to create a game?",
        answer: "Yes, for game hosts or organizers, launching a game is part of a marketing service to advertise and engage with players. This requires paying a platform fee along with covering the cost of the prize money committed as gifts for the winners."
    },
    {
        question: "Can the game creator control the outcome or choose the winner?",
        answer: "No. The game is completely random and transparent. The numbers are drawn randomly by the system, and scores are calculated based on a fixed set of rules. This ensures a fair experience for all players."
    },
    {
        question: "How are winners determined if no one gets a Full House?",
        answer: "We use a point-based scoring system. Points are awarded for various patterns, such as completed lines and corners. In the case of a tie, the player who achieved their score with the earliest-drawn numbers wins, ensuring a fair tie-breaker."
    },
    {
        question: "How do I get my tickets?",
        answer: "After a game is created by a host, you can generate a unique ticket by entering your name on the 'Generate Ticket' page. You can then download it as a PNG image or share it directly with others."
    },
    {
        question: "What is the 'Arena'?",
        answer: "The Arena is our loyalty and rewards section. By signing up, you get a profile, a wallet to track tokens, and the ability to win gift vouchers through special Arena-only games. It's completely free to join."
    },
    {
        question: "What are tokens and how do I earn them?",
        answer: "Tokens are the Arena's virtual currency. You earn them through signup bonuses, by referring friends, and by winning games. They are used to track your performance and winnings but cannot be purchased with real money."
    }
];

export default function FaqPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
        <header className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-headline text-primary">Frequently Asked Questions</h1>
            <Button asChild variant="outline">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
              </Link>
            </Button>
        </header>

        <Card>
            <CardHeader>
                <CardTitle>About BingoTango</CardTitle>
                <CardDescription>Find answers to the most common questions about our platform.</CardDescription>
            </CardHeader>
            <CardContent>
                <Accordion type="single" collapsible className="w-full">
                    {faqItems.map((item, index) => (
                        <AccordionItem value={`item-${index}`} key={index}>
                            <AccordionTrigger className="text-lg text-left">{item.question}</AccordionTrigger>
                            <AccordionContent className="text-base text-muted-foreground whitespace-pre-wrap">
                                {item.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </CardContent>
        </Card>

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
