import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-card border-b shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="text-3xl font-bold font-headline text-primary"
            >
              BingoTango
            </Link>
          </div>
          <div className="hidden sm:block sm:ml-6">
            <p className="text-sm text-muted-foreground">
              Your Winning Ticket to Fun!
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
