'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/firebase/provider';
import { signInWithEmailAndPassword, RecaptchaVerifier, signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { LogIn, ShieldAlert } from 'lucide-react';
import { appConfig } from '@/app/config';

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
  captcha: z.boolean().refine((val) => val === true, {
    message: 'Please complete the CAPTCHA.',
  }),
});

const LOGIN_ATTEMPTS_KEY = 'emperor_login_attempts';
const LOCKOUT_UNTIL_KEY = 'emperor_lockout_until';
const MAX_ATTEMPTS = 3;

export default function EmperorLoginPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const auth = useAuth();
  const router = useRouter();
  const recaptchaContainerRef = useRef<HTMLDivElement | null>(null);
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);

  const [lockoutTime, setLockoutTime] = useState<number | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (appConfig.maintenance) {
      router.push('/Arena/Home');
    }
  }, [router]);

  useEffect(() => {
    const checkLockout = () => {
      const lockoutUntil = localStorage.getItem(LOCKOUT_UNTIL_KEY);
      if (lockoutUntil) {
        const remainingTime = parseInt(lockoutUntil, 10) - Date.now();
        if (remainingTime > 0) {
          setLockoutTime(remainingTime);
        } else {
          localStorage.removeItem(LOCKOUT_UNTIL_KEY);
          localStorage.removeItem(LOGIN_ATTEMPTS_KEY);
        }
      }
    };
    checkLockout();
    const interval = setInterval(checkLockout, 1000);
    return () => clearInterval(interval);
  }, []);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', captcha: false },
  });

  useEffect(() => {
    if (!auth || !recaptchaContainerRef.current || recaptchaVerifierRef.current) return;
    
    // Ensure this runs only on the client
    if(typeof window !== 'undefined') {
        try {
            const verifier = new RecaptchaVerifier(auth, recaptchaContainerRef.current, {
                size: 'normal',
                callback: () => {
                form.setValue('captcha', true, { shouldValidate: true });
                },
                'expired-callback': () => {
                form.setValue('captcha', false, { shouldValidate: true });
                },
            });
            recaptchaVerifierRef.current = verifier;
            verifier.render();
        } catch (error) {
            console.error("reCAPTCHA rendering error:", error);
            toast({
                title: "CAPTCHA Error",
                description: "Could not load the CAPTCHA. Please refresh the page.",
                variant: "destructive"
            })
        }
    }

    // Cleanup on unmount
    return () => {
        if(recaptchaVerifierRef.current) {
            recaptchaVerifierRef.current.clear();
        }
    }

  }, [auth, form, toast]);

  function handleFailedLogin() {
    const attemptsStr = localStorage.getItem(LOGIN_ATTEMPTS_KEY);
    const currentAttempts = attemptsStr ? parseInt(attemptsStr, 10) : 0;
    const newAttempts = currentAttempts + 1;

    if (newAttempts >= MAX_ATTEMPTS) {
      const lockoutDuration = 24 * 60 * 60 * 1000; // 24 hours
      const lockoutUntil = Date.now() + lockoutDuration;
      localStorage.setItem(LOCKOUT_UNTIL_KEY, lockoutUntil.toString());
      localStorage.removeItem(LOGIN_ATTEMPTS_KEY);
      setLockoutTime(lockoutDuration);
      toast({
        title: 'Too Many Failed Attempts',
        description: 'You have been locked out for 24 hours for security reasons.',
        variant: 'destructive',
      });
    } else {
      localStorage.setItem(LOGIN_ATTEMPTS_KEY, newAttempts.toString());
      toast({
        title: 'Login Failed',
        description: `Invalid credentials. ${MAX_ATTEMPTS - newAttempts} attempts remaining.`,
        variant: 'destructive',
      });
    }
  }

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    if (lockoutTime && lockoutTime > 0) return;
    setIsSubmitting(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);

      const isEmailProvider = userCredential.user.providerData.some(
        (provider) => provider.providerId === 'password'
      );
      
      if(!isEmailProvider) {
         await signOut(auth);
         throw new Error("Only administrators with email/password accounts can access this area.");
      }

      localStorage.removeItem(LOGIN_ATTEMPTS_KEY);
      localStorage.removeItem(LOCKOUT_UNTIL_KEY);
      toast({
        title: 'Login Successful',
        description: 'Welcome, Emperor. Redirecting to the dashboard.',
      });
      router.push('/Arena/Emperor/Dashboard');
    } catch (error: any) {
      console.error('Login Error:', error);
      handleFailedLogin();
    } finally {
      setIsSubmitting(false);
      // Reset reCAPTCHA for the next attempt
      if (recaptchaVerifierRef.current) {
        try {
            recaptchaVerifierRef.current.render();
            form.setValue('captcha', false);
        } catch (e) {
            console.error("Error resetting reCAPTCHA", e);
        }
      }
    }
  }

  if (appConfig.maintenance || !isClient) {
    return null; // or a loading spinner
  }

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-10rem)] p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-headline text-primary">
            Emperor Access
          </CardTitle>
          <CardDescription>
            Administration and Operations Login.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {lockoutTime && lockoutTime > 0 ? (
             <div className="text-center p-8 bg-destructive/10 rounded-lg">
                <ShieldAlert className="w-16 h-16 text-destructive mx-auto mb-4" />
                <h3 className="text-xl font-bold text-destructive">Account Locked</h3>
                <p className="text-destructive">Too many failed login attempts.</p>
                <p className="text-lg font-mono text-destructive mt-4">{formatTime(lockoutTime)}</p>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="emperor@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                    control={form.control}
                    name="captcha"
                    render={() => (
                        <FormItem>
                            <FormControl>
                                <div ref={recaptchaContainerRef} className="flex justify-center"></div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                 />
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Authenticating...' : 'Enter the Palace'}
                  <LogIn className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
