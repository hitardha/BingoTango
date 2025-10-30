
'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

/**
 * Initializes the Firebase app and returns the core services.
 * This function handles both initial and subsequent calls, ensuring
 * that Firebase is initialized only once.
 */
export function initializeFirebase() {
  if (getApps().length > 0) {
    return getSdks(getApp());
  }

  const firebaseApp = initializeApp(firebaseConfig);
  
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
export * from './non-blocking-updates';
