import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="flex flex-col text-center">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Enter Arena</CardTitle>
              <CardDescription className="h-12">
                Win Gift Vouchers | Launch Games | Brand Promotion
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex items-center justify-center"></CardContent>
            <div className="p-6 pt-0">
              <Button asChild className="w-full">
                <Link href="/Arena/Home">
                  Enter <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </Card>

          <Card className="flex flex-col text-center">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Free Games</CardTitle>
              <CardDescription className="h-12">
                Instantly generate cards and host games without any sign-up.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex items-center justify-center"></CardContent>
            <div className="p-6 pt-0">
              <Button asChild className="w-full" variant="secondary">
                <Link href="/Free/Game">
                  Start Playing <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </Card>

          <Card className="flex flex-col text-center">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Know More</CardTitle>
              <CardDescription className="h-12">
                How to play | FAQ | About us & more
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex items-center justify-center"></CardContent>
            <div className="p-6 pt-0">
              <Button asChild className="w-full" variant="outline">
                <Link href="/Know/Howto">
                  Explore <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
