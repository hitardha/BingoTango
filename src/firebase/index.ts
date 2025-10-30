
'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

/**
 * Initializes the Firebase app and returns the core services.
 * This function handles both initial an-d subsequent calls, ensuring
 * that Firebase is initialized only once.
 */
export function initializeFirebase() {
  if (getApps().length > 0) {
    return getSdks(getApp());
  }

  const firebaseApp = initializeApp(firebaseConfig);
  
  // Initiate anonymous sign-in in the background for new sessions.
  // This listener ensures we only do this if there's no user after the initial check.
  const auth = getAuth(firebaseApp);
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    unsubscribe(); // We only need to run this check once on startup.
    if (!user) {
      signInAnonymously(auth).catch((error) => {
        console.error("Anonymous sign-in failed:", error);
      });
    }
  });

  return getSdks(firebaseApp);
}

/**
 * A helper function to get all the necessary SDK instances from a FirebaseApp.
 * @param firebaseApp The initialized FirebaseApp instance.
 * @returns An object containing the Auth and Firestore instances.
 */
function getSdks(firebaseApp: FirebaseApp) {
  const auth = getAuth(firebaseApp);
  const firestore = getFirestore(firebaseApp);
  return { firebaseApp, auth, firestore };
}

// Export the hooks and components that the rest of the application will use.
export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './errors';
export * from './error-emitter';
