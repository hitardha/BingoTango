
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
import { useFirestore } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function VerifyOtpPage() {
  const router = useRouter();
  const { toast } = useToast();
  const firestore = useFirestore();

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
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
      router.push('/Arena/Sponsor/Login');
      return;
    }
    
    setConfirmationResult(confirmation);
    setPhoneNumber(phoneNum);

  }, [router, toast]);

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
       router.push('/Arena/Sponsor/Login');
       return;
    }

    try {
      const result = await confirmationResult.confirm(otp);
      const user = result.user;

      toast({
        title: 'Verification Successful!',
        description: 'You have been successfully signed in.',
      });

      // Check if user has a sponsor document in `/sponsors/{uid}`
      const sponsorDocRef = doc(firestore, 'sponsors', user.uid);
      const sponsorDoc = await getDoc(sponsorDocRef);
      const exists = sponsorDoc.exists();
      
      alert(exists ? 'yes' : 'no');

      // Cleanup session storage and window object
      sessionStorage.removeItem('fullPhoneNumber');
      delete (window as any).confirmationResult;

      // Redirect based on whether the user is new or existing
      if (exists) {
         router.push('/Arena/Sponsor/Dashboard');
      } else {
         router.push('/Arena/Sponsor/Signup');
      }

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
          />
          <Button
            onClick={handleVerifyOtp}
            disabled={loading}
            className="w-full"
            size="lg"
          >
            {loading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              'Verify & Proceed'
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
