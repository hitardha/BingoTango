'use client';

import { useEffect } from 'react';
import { useUser } from '@/firebase';
import { usePathname, useRouter } from 'next/navigation';

/**
 * An invisible component that handles auth-based redirections.
 */
export function AuthRedirector() {
  const { isUserLoading, isOperatorLoading, user, isSuperAdmin } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Wait until all user and operator data has finished loading.
    if (isUserLoading || isOperatorLoading) {
      return;
    }

    const isAuthPage = pathname.includes('/Arena/Emperor/Login');

    // If the user is a super admin and they are on the login page,
    // redirect them to their dashboard.
    if (user && isSuperAdmin && isAuthPage) {
      router.replace('/Arena/Emperor/Dashboard');
    }

  }, [isUserLoading, isOperatorLoading, user, isSuperAdmin, router, pathname]);

  // This component does not render anything.
  return null;
}
