
'use client';

import { useEffect } from 'react';
import { useUser } from '@/firebase';
import { usePathname, useRouter } from 'next/navigation';

/**
 * An invisible component that handles auth-based redirections.
 * It waits for all authentication and user data loading to complete
 * before making a decision, preventing race conditions.
 */
export function AuthRedirector() {
  const { isUserLoading, isOperatorLoading, user, isSuperAdmin } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    alert(`AuthRedirector running. States: isUserLoading=${isUserLoading}, isOperatorLoading=${isOperatorLoading}, user=${!!user}, isSuperAdmin=${isSuperAdmin}`);
    
    // Wait until all user and operator data has finished loading.
    if (isUserLoading || isOperatorLoading) {
      alert('AuthRedirector: Exiting because loading is not complete.');
      return;
    }

    const isAuthPage = pathname.includes('/Arena/Emperor/Login');

    // If the user is a super admin and they are on the login page,
    // redirect them to their dashboard.
    if (user && isSuperAdmin && isAuthPage) {
      alert('AuthRedirector: Conditions met. Redirecting to dashboard.');
      router.replace('/Arena/Emperor/Dashboard');
    } else {
      alert('AuthRedirector: Conditions not met for redirect.');
    }

    // This dependency array is crucial. It ensures this effect re-runs
    // whenever any of these values change. So, when isSuperAdmin flips to true,
    // this logic will execute again and perform the redirect.
  }, [isUserLoading, isOperatorLoading, user, isSuperAdmin, router, pathname]);

  // This component does not render anything.
  return null;
}
