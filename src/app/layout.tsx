import type { Metadata } from 'next';
import { cn } from '@/lib/utils';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { PT_Sans, Space_Grotesk } from 'next/font/google';

export const metadata: Metadata = {
  title: 'BingoTango',
  description: 'Your Winning Ticket to Fun!',
};

const ptSans = PT_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-pt-sans',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-space-grotesk',
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
          ptSans.variable,
          spaceGrotesk.variable
        )}
      >
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
