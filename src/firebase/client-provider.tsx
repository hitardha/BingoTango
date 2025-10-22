'use client';

import React, { useMemo, type ReactNode, useEffect } from 'react';
import { FirebaseProvider } from '@/firebase/provider';
import { initializeFirebase, initiateAnonymousSignIn } from '@/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';

interface FirebaseClientProviderProps {
  children: ReactNode;
}

export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  const firebaseServices = useMemo(() => {
    return initializeFirebase();
  }, []);

  useEffect(() => {
    const auth = firebaseServices.auth;
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      // If after the initial auth state check, there is no user,
      // then we initiate an anonymous sign-in.
      if (!user) {
        initiateAnonymousSignIn(auth);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [firebaseServices.auth]);

  return (
    <FirebaseProvider
      firebaseApp={firebaseServices.firebaseApp}
      auth={firebaseServices.auth}
      firestore={firebaseServices.firestore}
    >
      <FirebaseErrorListener />
      {children}
    </FirebaseProvider>
  );
}
