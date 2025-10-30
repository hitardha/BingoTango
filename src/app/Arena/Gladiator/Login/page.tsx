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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Minimal list of countries for the selector
const countries = [
  { code: 'IN', name: 'India', dial_code: '+91', flag: '🇮🇳' },
  { code: 'US', name: 'United States', dial_code: '+1', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', dial_code: '+44', flag: '🇬🇧' },
];

export default function GladiatorLoginPage() {
  const router = useRouter();
  const auth = useAuth();
  const { toast } = useToast();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [country, setCountry] = useState(countries[0]);
  const [loading, setLoading] = useState(false);

  // This effect sets up the reCAPTCHA verifier
  useEffect(() => {
    if (!auth) return;

    // The 'recaptcha-container' div is used to host the invisible reCAPTCHA widget.
    // It's important that this is only run once on the client.
    if (!(window as any).recaptchaVerifier) {
      (window as any).recaptchaVerifier = new RecaptchaVerifier(
        auth,
        'recaptcha-container',
        {
          size: 'invisible',
        }
      );
    }
  }, [auth]);

  const handleSendOtp = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      toast({
        title: 'Invalid Number',
        description: 'Please enter a valid 10-digit mobile number.',
        variant: 'destructive',
      });
      return;
    }
    setLoading(true);

    try {
      const fullPhoneNumber = `${country.dial_code}${phoneNumber}`;
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        fullPhoneNumber,
        (window as any).recaptchaVerifier
      );
      
      // Store the confirmation result in session storage to be used on the verify page.
      sessionStorage.setItem(
        'phoneAuthConfirmation',
        JSON.stringify(confirmationResult)
      );
      // Store the phone number to display on the verify page.
      sessionStorage.setItem('fullPhoneNumber', fullPhoneNumber);

      toast({
        title: 'OTP Sent',
        description: `An OTP has been sent to ${fullPhoneNumber}.`,
      });
      router.push('/Arena/Gladiator/Verify');
    } catch (error: any) {
      console.error('Error sending OTP:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to send OTP. Please try again.',
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <div id="recaptcha-container"></div>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-headline text-primary">
            Gladiator Login
          </CardTitle>
          <CardDescription>
            Enter your mobile number to receive a verification code.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-2">
            <Select
              value={country.code}
              onValueChange={(value) =>
                setCountry(countries.find((c) => c.code === value)!)
              }
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue>
                  <div className="flex items-center gap-2">
                    <span>{country.flag}</span>
                    <span>{country.dial_code}</span>
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {countries.map((c) => (
                  <SelectItem key={c.code} value={c.code}>
                    <div className="flex items-center gap-2">
                      <span>{c.flag}</span>
                      <span>{c.name} ({c.dial_code})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="tel"
              placeholder="Mobile number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
              maxLength={10}
              className="text-lg"
            />
          </div>
          <Button
            onClick={handleSendOtp}
            disabled={loading}
            className="w-full"
            size="lg"
          >
            {loading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              'Send OTP'
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
