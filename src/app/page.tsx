import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Gamepad2, HelpCircle, Swords } from 'lucide-react';

const ticketSections = [
  {
    title: 'Enter Arena',
    description: 'Registered gladiators, enter here to compete and win big.',
    href: '/login',
    icon: <Swords className="size-8 text-primary" />,
    cta: 'Enter Arena',
  },
  {
    title: 'Free Games',
    description: 'Try our games for free, explore lobbies, and have fun.',
    href: '/free-games',
    icon: <Gamepad2 className="size-8 text-primary" />,
    cta: 'Play for Free',
  },
  {
    title: 'How to Play',
    description: 'Learn the rules, strategies, and tips to become a Bingo pro.',
    href: '/how-to-play',
    icon: <HelpCircle className="size-8 text-primary" />,
    cta: 'Learn More',
  },
];

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center">
      <section className="w-full py-20 md:py-32 lg:py-40 bg-primary/10">
        <div className="container mx-auto text-center px-4 md:px-6">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl font-headline text-primary">
            BingoTango
          </h1>
          <p className="mx-auto max-w-[700px] text-foreground/80 md:text-xl mt-4">
            Your ultimate destination for thrilling bingo games and big wins.
          </p>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-3">
            {ticketSections.map((section) => (
              <Link href={section.href} key={section.title} className="group">
                <Card className="h-full flex flex-col bg-accent/50 hover:bg-accent/80 transition-colors duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 rounded-xl overflow-hidden">
                  <CardHeader className="flex flex-row items-center gap-4 p-6">
                    <div className="bg-primary/10 p-3 rounded-full">{section.icon}</div>
                    <CardTitle className="font-headline text-2xl text-accent-foreground">{section.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow p-6 pt-0 flex flex-col">
                    <p className="text-accent-foreground/80 flex-grow">{section.description}</p>
                    <Button variant="link" className="p-0 h-auto mt-4 text-primary justify-start">
                      {section.cta}
                      <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
