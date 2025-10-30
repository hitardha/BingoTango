
'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, Gamepad2, BarChart, Trophy, Megaphone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function MuneratorDashboardPage() {
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleSignOut = async () => {
    if (!auth) return;
    try {
      await auth.signOut();
      toast({
        title: 'Signed Out',
        description: 'You have been successfully signed out.',
      });
      router.push('/Arena/Munerator/Login');
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        title: 'Error',
        description: 'Failed to sign out. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const features = [
    {
      title: 'My Games',
      description: 'Create and manage your bingo games.',
      icon: <Gamepad2 className="w-10 h-10 text-primary" />,
      href: '/Arena/Munerator/MyGames',
    },
    {
      title: 'My Reports',
      description: 'Analyze game performance and player engagement.',
      icon: <BarChart className="w-10 h-10 text-primary" />,
      href: '/Arena/Munerator/MyReports',
    },
    {
      title: 'My Winners',
      description: 'View winner lists and prize distribution.',
      icon: <Trophy className="w-10 h-10 text-primary" />,
      href: '/Arena/Munerator/MyWinners',
    },
    {
      title: 'My Ads',
      description: 'Manage your brand promotions and ad campaigns.',
      icon: <Megaphone className="w-10 h-10 text-primary" />,
      href: '/Arena/Munerator/MyAds',
    },
  ];

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-headline text-primary">Munerator Dashboard</h1>
        <Button variant="outline" onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature) => (
          <Card key={feature.title} className="flex flex-col text-center">
            <CardHeader>
              <div className="mx-auto bg-primary/10 p-4 rounded-full">
                {feature.icon}
              </div>
              <CardTitle className="mt-4">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <CardDescription>{feature.description}</CardDescription>
            </CardContent>
            <div className="p-6 pt-0">
                <Button asChild className="w-full">
                    <Link href={feature.href}>Go to {feature.title}</Link>
                </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
