
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions - BingoTango',
  description: 'Read the official Terms and Conditions for using the BingoTango platform. Understand the rules for hosts and players, user conduct, and our limitation of liability.',
  keywords: ['BingoTango terms', 'terms and conditions', 'legal', 'platform rules', 'user conduct', 'giveaway rules', 'contest rules'],
};

const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="space-y-2">
        <h2 className="text-xl font-semibold text-primary">{title}</h2>
        <div className="text-muted-foreground space-y-2">
            {children}
        </div>
    </div>
);

export default function TncPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
        <header className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-headline text-primary">Terms & Conditions</h1>
            <Button asChild variant="outline">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
              </Link>
            </Button>
        </header>

        <Card>
            <CardHeader>
                <CardTitle>BingoTango Platform - Terms and Conditions of Use</CardTitle>
                <CardDescription>Last Updated: 2025-10-19</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <Section title="1. Introduction">
                    <p>Welcome to BingoTango ("the Platform"), a product of Xenford Internet Private Limited ("the Company," "we," "us," or "our"). These Terms and Conditions govern your use of our website, services, and the BingoTango platform. By accessing or using the Platform, you agree to be bound by these terms.</p>
                </Section>
                
                <Section title="2. Nature of the Platform">
                    <p>BingoTango is a contest-based marketing platform designed for businesses and individuals ("Hosts") to create and run engaging promotional activities. It is explicitly NOT a gambling platform. No real money can be wagered, paid, or won by players. The platform's virtual currency ("tokens") has no real-world monetary value and is used for scoring and reward-tracking purposes only.</p>
                </Section>

                <Section title="3. User Accounts (The Arena)">
                    <p>Users may register for a free account in the "Arena" to track their winnings, manage a wallet of tokens, and maintain a user profile. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.</p>
                </Section>

                <Section title="4. Rules for Hosts">
                    <p>Hosts who wish to create games for promotional or marketing purposes are required to pay a platform fee and cover the cost of any prizes or gifts they commit to the winners of their games. Hosts agree that game outcomes are determined by the Platform's random number generation and scoring algorithms and cannot be influenced or predetermined.</p>
                </Section>
                
                <Section title="5. Rules for Players">
                    <p>Participation in games on BingoTango is free for all players. There is no requirement to purchase anything or pay any fee to generate a ticket and play. Winnings are distributed as per the rules set by the Host for each specific game.</p>
                </Section>

                <Section title="6. User Conduct">
                    <p>You agree not to use the Platform to:</p>
                    <ul className="list-disc list-inside ml-4">
                        <li>Engage in any form of cheating, including the use of bots, scripts, or any automated means to play games or manipulate outcomes.</li>
                        <li>Violate any applicable local, state, national, or international law.</li>
                        <li>Impersonate any person or entity or misrepresent your affiliation with a person or entity.</li>
                        <li>Attempt to interfere with or disrupt the Platform's servers or networks.</li>
                    </ul>
                </Section>

                <Section title="7. Intellectual Property">
                    <p>All content, features, and functionality on the Platform, including but not limited to text, graphics, logos, and software, are the exclusive property of Xenford Internet Private Limited and are protected by international copyright, trademark, and other intellectual property laws.</p>
                </Section>

                <Section title="8. Limitation of Liability">
                    <p>The Platform is provided on an "as is" and "as available" basis. Xenford Internet Private Limited makes no warranties, expressed or implied, and hereby disclaims all other warranties. In no event shall the Company be liable for any direct, indirect, incidental, special, or consequential damages arising out of the use or inability to use the Platform.</p>
                </Section>
                
                <Section title="9. Termination">
                    <p>We reserve the right to terminate or suspend your access to the Platform at our sole discretion, without notice, for conduct that we believe violates these Terms and Conditions or is harmful to other users of the Platform, us, or third parties, or for any other reason.</p>
                </Section>
                
                <Section title="10. Governing Law">
                    <p>These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.</p>
                </Section>

                <Section title="11. Changes to Terms">
                    <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of any changes by posting the new Terms and Conditions on this page.</p>
                </Section>

                <Section title="12. Contact Us">
                    <p>If you have any questions about these Terms, please contact us at <a href="mailto:bingotango.com@gmail.com" className="font-semibold underline hover:text-primary">bingotango.com@gmail.com</a>.</p>
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
