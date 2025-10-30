
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { add, format, sub } from 'date-fns';

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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { appConfig } from '@/app/config';
import { CalendarIcon, Loader2 } from 'lucide-react';

const eightCharRef = () => Math.random().toString(36).substring(2, 10).toUpperCase();

// Schema for form validation
const formSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters.'),
  dob: z.date({
    required_error: 'Date of birth is required.',
  }),
  gender: z.string({
    required_error: 'Please select a gender.',
  }),
  email: z.string().email('Please enter a valid email address.'),
  referredBy: z.string().optional(),
});

export default function GladiatorSignupPage() {
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [initialReferralCode, setInitialReferralCode] = useState('');

  // Define the default start date for the calendar (18 years ago)
  const defaultDob = sub(new Date(), { years: 18 });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      dob: defaultDob,
      email: '',
      referredBy: '',
    },
  });

  useEffect(() => {
    // Redirect if user data is loading or if user is not logged in
    if (!isUserLoading && !user) {
      toast({
        title: 'Not Authorized',
        description: 'Please log in to create a profile.',
        variant: 'destructive',
      });
      router.replace('/Arena/Gladiator/Login');
    }

    // Check for referral code from session storage
    const refCode = sessionStorage.getItem('ReferralCode');
    if (refCode) {
      setInitialReferralCode(refCode);
      form.setValue('referredBy', refCode);
    }
  }, [user, isUserLoading, router, toast, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast({
        title: 'Authentication Error',
        description: 'No user found. Please log in again.',
        variant: 'destructive',
      });
      return;
    }
    setLoading(true);

    const subscriptionEod = new Date('2999-12-31T23:59:59Z');

    const profileData = {
      userId: user.uid,
      username: values.username,
      dob: values.dob,
      gender: values.gender,
      email: values.email,
      referredBy: values.referredBy || '',
      referralCode: eightCharRef(),
      numberOfReferrals: 0,
      wallet: appConfig.signupbonus,
      userLevel: 'beginner',
      subscriptionLevel: 'free',
      subscriptionType: 'free',
      subscriptionEod: subscriptionEod,
      createdAt: serverTimestamp(),
    };

    try {
      // Use the user's UID as the document ID for the profile
      const profileDocRef = doc(firestore, 'users', user.uid, 'gladiatorProfiles', user.uid);
      
      await setDoc(profileDocRef, profileData);

      toast({
        title: 'Profile Created!',
        description: 'Welcome to the Arena! Redirecting to your dashboard.',
      });
      
      // Cleanup session storage
      sessionStorage.removeItem('ReferralCode');
      sessionStorage.removeItem('NextPage');

      router.push('/Arena/Gladiator/Dashboard');

    } catch (error: any) {
      console.error('Error creating profile:', error);
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
            Create Your Gladiator Profile
          </CardTitle>
          <CardDescription>
            Complete your registration to enter the Arena.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Maximus99" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="dob"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date of Birth</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={'outline'}
                              className={cn(
                                'w-full pl-3 text-left font-normal',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              {field.value ? (
                                format(field.value, 'PPP')
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            defaultMonth={field.value}
                            captionLayout="dropdown-buttons"
                            fromYear={1950}
                            toYear={defaultDob.getFullYear()}
                            disabled={(date) =>
                              date > new Date() || date < new Date('1900-01-01')
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                          <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
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
                name="referredBy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Referral Code (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter referral code"
                        {...field}
                        readOnly={!!initialReferralCode}
                      />
                    </FormControl>
                    <FormMessage />
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

    