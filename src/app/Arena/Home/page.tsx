
'use client';

import { GiColiseum, GiSpikedDragonHead, GiScrollQuill, GiImperialCrown } from 'react-icons/gi';
import { appConfig } from '@/app/config';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

// Validation function for maintenance mode
const isMaintenanceMode = () => {
  return appConfig.maintenance;
};

export default function ArenaHomePage() {
  if (isMaintenanceMode()) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8 flex-grow">
        <GiColiseum size={128} className="text-primary mb-8" />
        <h1 className="text-4xl font-bold font-headline text-primary">
          Getting Ready - Comeback soon
        </h1>
      </div>
    );
  }

  // This part will be shown when maintenance mode is off
  return (
    <div className="flex flex-col items-center justify-center flex-grow p-4 sm:p-6 lg:p-8">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-headline text-primary">Welcome to the Arena</h1>
        <p className="text-xl text-muted-foreground mt-2">Forge your destiny. Choose your path.</p>
      </div>
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <Card className="flex flex-col text-center border-primary border-2 shadow-lg shadow-primary/20">
            <CardHeader>
               <GiSpikedDragonHead className="w-20 h-20 text-primary mx-auto" />
              <CardTitle className="text-3xl font-headline text-primary mt-4">The Gladiator</CardTitle>
              <CardDescription className="h-12">
                Enter the fray, compete for glory, and win prizes.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex items-center justify-center">
              <p className="text-sm text-muted-foreground">Log in to manage your profile, track your winnings, and join exclusive games.</p>
            </CardContent>
            <div className="p-6 pt-0">
              <Button asChild className="w-full">
                <Link href="/Arena/Gladiator/Login">
                  Enter as Gladiator <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </Card>

          <Card className="flex flex-col text-center">
            <CardHeader>
              <GiScrollQuill className="w-20 h-20 text-muted-foreground mx-auto" />
              <CardTitle className="text-2xl font-bold mt-4">The Munerator</CardTitle>
              <CardDescription className="h-12">
                Organize and host your own customized bingo games.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex items-center justify-center">
               <p className="text-sm text-muted-foreground">For game masters and event organizers. Create engaging contests for your audience.</p>
            </CardContent>
            <div className="p-6 pt-0">
              <Button asChild className="w-full" variant="secondary">
                <Link href="/Know/Aboutus">
                  Become a Munerator <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </Card>

          <Card className="flex flex-col text-center">
            <CardHeader>
              <GiImperialCrown className="w-20 h-20 text-muted-foreground mx-auto" />
              <CardTitle className="text-2xl font-bold mt-4">The Emperor</CardTitle>
              <CardDescription className="h-12">
                Sponsor games and promote your brand to a captive audience.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex items-center justify-center">
              <p className="text-sm text-muted-foreground">Leverage the Arena for powerful marketing campaigns and brand visibility.</p>
            </CardContent>
            <div className="p-6 pt-0">
              <Button asChild className="w-full" variant="outline">
                <Link href="/Know/Aboutus">
                  Inquire Now <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </Card>
          
        </div>
      </div>
    </div>
  );
}
