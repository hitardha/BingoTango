import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const faqs = [
  {
    question: "What is the main objective of Bingo?",
    answer: "The primary objective in Bingo is to be the first player to mark off a specific pattern on your card. The pattern could be a line, a full house, or another predetermined shape. When you complete the pattern, you shout 'Bingo!' to win.",
  },
  {
    question: "How do I get a Bingo card?",
    answer: "In online bingo, cards are automatically assigned to you when you enter a game room. You can typically choose how many cards you want to play with for each game.",
  },
  {
    question: "How are numbers called in online Bingo?",
    answer: "An automated system, called a random number generator (RNG), 'calls' the numbers. These numbers are displayed on your screen, and the software automatically marks them on your cards, making it easy to follow along.",
  },
  {
    question: "What are some basic Bingo strategies?",
    answer: "While Bingo is a game of chance, some strategies can improve your odds. Playing with more cards increases your chances of winning. Also, playing in rooms with fewer players can increase your odds, though the prize pools may be smaller. Some theories suggest choosing cards with a good balance of odd/even and high/low numbers.",
  },
  {
    question: "What happens if two players call Bingo at the same time?",
    answer: "In the event of a tie, the prize money is typically split equally among all the winners. This is a common occurrence in online bingo.",
  },
];

export default function HowToPlayPage() {
  const howToPlayImage = PlaceHolderImages.find(p => p.id === 'how-to-play-image');

  return (
    <div className="container mx-auto max-w-4xl py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold font-headline text-primary sm:text-5xl">How to Play Bingo</h1>
        <p className="mt-4 text-lg text-foreground/80">
          Your guide to understanding the rules, objectives, and strategies of Bingo.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        <div className="prose max-w-none text-foreground">
          <h2 className="font-headline text-2xl font-semibold">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="relative">
          {howToPlayImage && (
            <Image
              src={howToPlayImage.imageUrl}
              alt={howToPlayImage.description}
              data-ai-hint={howToPlayImage.imageHint}
              width={600}
              height={400}
              className="rounded-lg shadow-lg aspect-video object-cover"
            />
          )}
        </div>
      </div>
    </div>
  );
}
