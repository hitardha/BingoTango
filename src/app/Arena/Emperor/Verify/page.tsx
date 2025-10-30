
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ConfirmationResult } from 'firebase/auth';
import { useUser, useAuth } from '@/firebase';

export default function VerifyOtpPage() {
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();
  const { user, isSuperAdmin, isUserLoading, isOperatorLoading } = useUser();

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    // Retrieve the confirmation result from the window object.
    const confirmation = (window as any).confirmationResult;
    const phoneNum = sessionStorage.getItem('fullPhoneNumber');

    if (!confirmation || !phoneNum) {
      toast({
        title: 'Verification Error',
        description: 'Could not find confirmation data. Please start again.',
        variant: 'destructive',
      });
      router.push('/Arena/Emperor/Login');
      return;
    }
    
    setConfirmationResult(confirmation);
    setPhoneNumber(phoneNum);

  }, [router, toast]);

  useEffect(() => {
    // This effect runs when the user's auth state or claims finish loading.
    if (checkingStatus && !isUserLoading && !isOperatorLoading && user) {
        if (isSuperAdmin) {
            toast({
                title: 'Access Granted',
                description: 'Redirecting to Emperor Dashboard.',
            });
            router.push('/Arena/Emperor/Dashboard');
        } else {
             toast({
                title: 'Access Denied',
                description: 'You do not have Emperor Privileges.',
                variant: 'destructive',
            });
            // Sign the user out before redirecting
            if(auth) {
                auth.signOut();
            }
            router.push('/Arena/Home');
        }
         // Cleanup session storage and window object
        sessionStorage.removeItem('fullPhoneNumber');
        delete (window as any).confirmationResult;
        setCheckingStatus(false);
    }
  }, [checkingStatus, isUserLoading, isOperatorLoading, isSuperAdmin, user, router, toast, auth]);

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      toast({
        title: 'Invalid OTP',
        description: 'Please enter a 6-digit OTP.',
        variant: 'destructive',
      });
      return;
    }
    setLoading(true);

    if (!confirmationResult) {
       toast({
        title: 'Verification Error',
        description: 'Confirmation data is missing. Please restart login.',
        variant: 'destructive',
      });
       setLoading(false);
       router.push('/Arena/Emperor/Login');
       return;
    }

    try {
      // Confirm the OTP. This signs the user in.
      await confirmationResult.confirm(otp);

      toast({
        title: 'Verification Successful!',
        description: 'You have been signed in. Checking your access rights...',
      });
      
      // User is signed in. Now, we wait for the useUser hook to update with claims.
      setCheckingStatus(true);
      // The useEffect above will handle the redirect.

    } catch (error: any) {
      console.error('Error verifying OTP:', error);
      toast({
        title: 'Verification Failed',
        description: error.message || 'The OTP you entered is incorrect. Please try again.',
        variant: 'destructive',
      });
      setLoading(false);
    }
  };
  
  const isLoading = loading || checkingStatus;

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-headline text-primary">
            Verify OTP
          </CardTitle>
          <CardDescription>
            Enter the 6-digit code sent to {phoneNumber}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Input
            type="tel"
            placeholder="_ _ _ _ _ _"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
            maxLength={6}
            className="text-2xl text-center tracking-[1rem]"
            disabled={isLoading}
          />
          <Button
            onClick={handleVerifyOtp}
            disabled={isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                {checkingStatus ? 'Checking Status...' : 'Verifying...'}
              </>
            ) : (
              'Verify & Proceed'
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
