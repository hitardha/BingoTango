
'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

function InviteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const referralCode = searchParams.get('ReferralCode');
    const nextPage = searchParams.get('NextPage');

    if (referralCode) {
      sessionStorage.setItem('ReferralCode', referralCode);
    }
    if (nextPage) {
      sessionStorage.setItem('NextPage', nextPage);
    }

    // Redirect to the login page after attempting to save the params.
    router.replace('/Arena/Gladiator/Login');
  }, [router, searchParams]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
      <h1 className="text-2xl font-semibold">Preparing your invitation...</h1>
      <p className="text-muted-foreground">Redirecting you to the login page.</p>
    </div>
  );
}

export default function InvitePage() {
    return (
        <Suspense fallback={
             <div className="flex flex-col items-center justify-center min-h-screen text-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <h1 className="text-2xl font-semibold">Loading...</h1>
            </div>
        }>
            <InviteContent />
        </Suspense>
    );
}
