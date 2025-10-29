
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
    // This effect runs whenever the auth state changes.
    // The logic inside ensures we only act when the state is stable.

    const isLoading = isUserLoading || isOperatorLoading;
    const isAuthPage = pathname.includes('/Arena/Emperor/Login');

    // Condition for redirection:
    // 1. All loading must be finished.
    // 2. We must have a logged-in user who is a Super Admin.
    // 3. The user must currently be on the login page.
    if (!isLoading && user && isSuperAdmin && isAuthPage) {
      router.replace('/Arena/Emperor/Dashboard');
    }

    // The dependency array ensures this logic re-runs every time any of these
    // auth-related values change, guaranteeing that we eventually reach a
    // stable state and perform the correct action.
  }, [isUserLoading, isOperatorLoading, user, isSuperAdmin, router, pathname]);

  // This component does not render anything.
  return null;
}
