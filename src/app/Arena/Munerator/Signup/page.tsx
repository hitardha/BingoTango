
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';

import { useUser, useFirestore } from '@/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

// Schema for form validation
const formSchema = z.object({
  sponsorName: z.string().min(3, 'Sponsor name must be at least 3 characters.'),
  brandName: z.string().min(2, 'Brand name must be at least 2 characters.'),
  contactPerson: z.string().min(3, 'Contact person name is required.'),
  email: z.string().email('Please enter a valid email address.'),
  terms: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms and conditions.',
  }),
});

export default function MuneratorSignupPage() {
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sponsorName: '',
      brandName: '',
      contactPerson: '',
      email: '',
      terms: false,
    },
  });

  useEffect(() => {
    // Redirect if user data is loading or if user is not logged in
    if (!isUserLoading && !user) {
      toast({
        title: 'Not Authorized',
        description: 'Please log in to create a Munerator profile.',
        variant: 'destructive',
      });
      router.replace('/Arena/Munerator/Login');
      return;
    }
    // Pre-fill email if available from user object
    if (user?.email) {
      form.setValue('email', user.email);
    }
  }, [user, isUserLoading, router, toast, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user || !user.uid) {
      toast({
        title: 'Authentication Error',
        description: 'No user found. Please log in again.',
        variant: 'destructive',
      });
      return;
    }
    setLoading(true);

    const sponsorData = {
      id: user.uid,
      sponsorName: values.sponsorName,
      brandName: values.brandName,
      contactPerson: values.contactPerson,
      contactNumber: user.phoneNumber || '', // From Firebase Auth user
      email: values.email,
      signupDate: serverTimestamp(),
      lastLoginDate: serverTimestamp(),
      numberOfGames: 0,
      Role: 'Sponsor',
      SponsorLevel: 'Beginner',
      SubscriptionLevel: 'Free',
      subscriptionEndDate: null,
      Tags: [],
      Remarks: null,
      UserType: 'M',
      termsAccepted: values.terms,
    };

    try {
      // Use the user's UID as the document ID for the sponsor profile
      const sponsorDocRef = doc(firestore, 'sponsors', user.uid);
      
      await setDoc(sponsorDocRef, sponsorData);

      toast({
        title: 'Profile Created!',
        description: 'Welcome, Munerator! Redirecting to your dashboard.',
      });
      
      router.push('/Arena/Munerator/Dashboard');

    } catch (error: any) {
      console.error('Error creating sponsor profile:', error);
      toast({
        title: 'Signup Failed',
        description: error.message || 'Could not create your profile. Please try again.',
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

  if (isUserLoading || !user) {
     return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-headline text-primary">
            Become a Munerator
          </CardTitle>
          <CardDescription>
            Complete your registration to start hosting games.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="sponsorName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sponsor Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Acme Corporation" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
                <FormField
                control={form.control}
                name="brandName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand Name</FormLabel>
                    <FormControl>
                      <Input placeholder="The name displayed in games" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="contactPerson"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Person</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Jane Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="your.email@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="terms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Accept terms and conditions
                      </FormLabel>
                      <FormDescription>
                        You agree to our <Link href="/Know/Terms" className="underline hover:text-primary">Terms and Conditions</Link>.
                      </FormDescription>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={loading} className="w-full" size="lg">
                {loading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  'Complete Signup'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
