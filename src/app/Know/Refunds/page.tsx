
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, CircleDollarSign, Ticket, ShieldAlert } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Returns and Refunds Policy - BingoTango',
  description: 'Read the Returns and Refunds Policy for the BingoTango platform. Understand our policies on monetary transactions for game hosts and token usage for players.',
  keywords: ['returns policy', 'refund policy', 'BingoTango refunds', 'no refunds', 'final sale', 'token policy', 'platform fees'],
};

const Section = ({ title, icon, children }: { title: string, icon: React.ReactNode, children: React.ReactNode }) => (
    <div className="space-y-2">
        <h2 className="text-xl font-semibold text-primary flex items-center gap-3">{icon} {title}</h2>
        <div className="text-muted-foreground space-y-2 text-base leading-relaxed">
            {children}
        </div>
    </div>
);

export default function ReturnsAndRefundsPage() {
  return (
    <div className="container mx-auto p-4 md:p-8 min-h-screen">
        <header className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-headline text-primary">Returns & Refunds</h1>
            <Button asChild variant="outline">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
              </Link>
            </Button>
        </header>

        <Card>
            <CardHeader>
                <CardTitle>Our Policy</CardTitle>
                <CardDescription>Last Updated: 2025-10-19</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                <div className="p-4 rounded-lg border border-destructive/50 bg-destructive/10 text-destructive-foreground flex items-center gap-4">
                    <ShieldAlert className="h-8 w-8 text-destructive"/>
                    <div>
                        <h3 className="font-bold text-lg">All Transactions Are Final</h3>
                        <p className="text-sm">Please read the following policies carefully. Due to the digital nature of our services and the immediate costs incurred, we do not offer returns or refunds.</p>
                    </div>
                </div>
                
                <Section title="For Game Hosts (Monetary Transactions)" icon={<CircleDollarSign className="w-6 h-6"/>}>
                    <p>When a game host pays to create a game on the BingoTango platform, they are purchasing a marketing service. This service includes access to the platform's game creation tools, ticket generation system, and prize fund management.</p>
                    <p className="font-semibold text-foreground">No returns or refunds of money will be issued once a game has been successfully created and paid for. This policy is in place because the service is considered delivered at the point of game creation.</p>
                </Section>
                
                <Section title="For Players (Token Transactions)" icon={<Ticket className="w-6 h-6"/>}>
                    <p>Players in the BingoTango Arena use virtual tokens to participate in games by generating tickets. These tokens may be earned through gameplay, referrals, or promotions.</p>
                    <p className="font-semibold text-foreground">No returns or refunds of tokens will be provided once a ticket has been successfully generated for a game. The tokens are considered consumed at the moment the ticket is created.</p>
                </Section>

                <Section title="Contact Us" icon={<ArrowLeft className="w-6 h-6"/>}>
                    <p>If you have any questions about this policy, please feel free to contact us at <a href="mailto:bingotango.com@gmail.com" className="font-semibold underline hover:text-primary">bingotango.com@gmail.com</a> before making any purchase or transaction.</p>
                </Section>
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
