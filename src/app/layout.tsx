import type { Metadata } from 'next';
import { cn } from '@/lib/utils';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Roboto, Righteous } from 'next/font/google';

export const metadata: Metadata = {
  title: 'BingoTango',
  description: 'Your Winning Ticket to Fun!',
};

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-roboto',
});

const righteous = Righteous({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-righteous',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased flex flex-col',
          roboto.variable,
          righteous.variable
        )}
      >
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
