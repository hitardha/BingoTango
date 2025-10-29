'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth, useUser } from '@/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserCog, Shield, Users, ArrowRight, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { signOut } from 'firebase/auth';

export default function EmperorDashboardPage() {
  const router = useRouter();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();

  useEffect(() => {
    if (isUserLoading) {
      return; // Wait until user auth state is resolved
    }

    if (!user) {
      // If no user, redirect to login
      router.replace('/Arena/Emperor/Login');
      return;
    }

    // Check if the provider is password
    const isEmailProvider = user.providerData.some(
      (provider) => provider.providerId === 'password'
    );

    if (!isEmailProvider) {
      toast({
        title: 'Access Denied',
        description: 'Only administrators with email/password accounts can access this area.',
        variant: 'destructive',
      });
      // Sign out the user and redirect
      signOut(auth).finally(() => {
        router.replace('/Arena/Emperor/Login');
      });
    }
  }, [user, isUserLoading, router, auth, toast]);

  if (isUserLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="mb-12 text-center">
        <h1 className="text-5xl font-headline text-primary">Emperor Dashboard</h1>
        <p className="text-xl text-muted-foreground mt-2">Oversee the entire Arena.</p>
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

        <Card className="flex flex-col text-center opacity-50 cursor-not-allowed">
          <CardHeader>
            <Shield className="w-20 h-20 text-muted-foreground mx-auto" />
            <CardTitle className="text-2xl font-bold mt-4">Sponsors</CardTitle>
            <CardDescription>
              (Coming Soon) Review and manage all Munerators.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex items-center justify-center">
             <p className="text-sm text-muted-foreground">Approve new sponsors, view game statistics, and oversee brand promotions.</p>
          </CardContent>
          <div className="p-6 pt-0">
            <Button className="w-full" variant="secondary" disabled>
              Manage Sponsors
            </Button>
          </div>
        </Card>

        <Card className="flex flex-col text-center opacity-50 cursor-not-allowed">
          <CardHeader>
            <Users className="w-20 h-20 text-muted-foreground mx-auto" />
            <CardTitle className="text-2xl font-bold mt-4">Players</CardTitle>
            <CardDescription>
               (Coming Soon) View player data and statistics.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex items-center justify-center">
            <p className="text-sm text-muted-foreground">Monitor player activity, manage profiles, and handle support escalations.</p>
          </CardContent>
          <div className="p-6 pt-0">
            <Button className="w-full" variant="outline" disabled>
              Manage Players
            </Button>
          </div>
        </Card>
        
      </div>
    </div>
  );
}
