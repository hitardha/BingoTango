'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth, useUser } from '@/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserCog, Shield, Users, ArrowRight, Loader2, Ban } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { signOut } from 'firebase/auth';

export default function EmperorDashboardPage() {
  const router = useRouter();
  const auth = useAuth();
  const { user, isUserLoading, operatorData, isOperatorLoading, isSuperAdmin } = useUser();
  const { toast } = useToast();

  useEffect(() => {
    if (isUserLoading || isOperatorLoading) {
      return; 
    }

    if (!user) {
      router.replace('/Arena/Emperor/Login');
      return;
    }
    
    if (!isSuperAdmin) {
       toast({
        title: 'Insufficient Permissions',
        description: 'You must be a Super Admin to access the Emperor dashboard.',
        variant: 'destructive',
        duration: 10000,
      });
      // Signing out is optional, but can be a good security measure
      // signOut(auth).finally(() => {
        router.replace('/Arena/Home');
      // });
    }

  }, [user, isUserLoading, isOperatorLoading, isSuperAdmin, router, toast]);

  if (isUserLoading || isOperatorLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!isSuperAdmin) {
    return (
       <div className="container mx-auto p-4 md:p-8 flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center">
            <Ban className="w-24 h-24 text-destructive mb-4" />
            <h1 className="text-4xl font-headline text-destructive">Access Restricted</h1>
            <p className="text-xl text-muted-foreground mt-2">Only Super Admins can access this page.</p>
             <Button onClick={() => router.push('/Arena/Home')} className="mt-8">Go to Arena Home</Button>
        </div>
    )
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="mb-12 text-center">
        <h1 className="text-5xl font-headline text-primary">Welcome, {operatorData?.UserName || 'Emperor'}</h1>
        <p className="text-xl text-muted-foreground mt-2">Oversee the entire Arena from the Emperor Dashboard.</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        
        <Card className="flex flex-col text-center border-primary border-2 shadow-lg shadow-primary/20">
          <CardHeader>
             <UserCog className="w-20 h-20 text-primary mx-auto" />
            <CardTitle className="text-3xl font-headline text-primary mt-4">Operators</CardTitle>
            <CardDescription>
              Manage administrators and their permissions.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex items-center justify-center">
            <p className="text-sm text-muted-foreground">Add, remove, or modify operator roles and access levels.</p>
          </CardContent>
          <div className="p-6 pt-0">
            <Button asChild className="w-full">
              <Link href="/Arena/Emperor/Operators">
                Manage Operators <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Card>

        <Card className="flex flex-col text-center">
          <CardHeader>
            <Shield className="w-20 h-20 text-muted-foreground mx-auto" />
            <CardTitle className="text-2xl font-bold mt-4">Sponsors</CardTitle>
            <CardDescription>
              Review and manage all Munerators.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex items-center justify-center">
             <p className="text-sm text-muted-foreground">Approve new sponsors, view game statistics, and oversee brand promotions.</p>
          </CardContent>
          <div className="p-6 pt-0">
            <Button asChild className="w-full" variant="secondary">
                <Link href="/Arena/Emperor/Sponsors">
                    Manage Sponsors <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
            </Button>
          </div>
        </Card>

        <Card className="flex flex-col text-center">
          <CardHeader>
            <Users className="w-20 h-20 text-muted-foreground mx-auto" />
            <CardTitle className="text-2xl font-bold mt-4">Players</CardTitle>
            <CardDescription>
               View player data and statistics.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex items-center justify-center">
            <p className="text-sm text-muted-foreground">Monitor player activity, manage profiles, and handle support escalations.</p>
          </CardContent>
          <div className="p-6 pt-0">
            <Button asChild className="w-full" variant="outline">
                <Link href="/Arena/Emperor/Players">
                    Manage Players <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
            </Button>
          </div>
        </Card>
        
      </div>
    </div>
  );
}
