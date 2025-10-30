'use server';

import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, getApps, App } from 'firebase-admin/app';

// This function initializes Firebase Admin SDK and ensures it's a singleton.
function getFirebaseAdminApp(): App {
  if (getApps().length > 0) {
    return getApps()[0];
  }
  return initializeApp();
}

/**
 * Checks if a player document exists in the 'players' collection.
 * @param uid The user's UID to check.
 * @returns A boolean indicating if the player exists.
 */
export async function checkPlayerExists(uid: string): Promise<boolean> {
  try {
    const adminApp = getFirebaseAdminApp();
    const db = getFirestore(adminApp);
    
    const playerDocRef = db.collection('players').doc(uid);
    const playerDoc = await playerDocRef.get();
    
    return playerDoc.exists;
  } catch (error) {
    console.error("Error checking player existence:", error);
    // In case of an error, we conservatively return false.
    return false;
  }
}
